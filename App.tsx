import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Layout,
  LogOut,
  Map,
  Grid,
  Gift,
} from 'lucide-react';
import { INITIAL_USER_STATE, LESSONS } from './constants';
import { UserProgress, TrackType, AppView, UserProfile, Lesson } from './types';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { PathRecommendation } from './components/PathRecommendation';
import { TracksView } from './components/TracksView';
import { ProjectsView } from './components/ProjectsView';
import { RewardsView } from './components/RewardsView';
import { LessonPlayer } from './components/LessonPlayer';
import {
  fetchProgress,
  fetchUserProfile,
  recordLessonCompletion,
  updateTrack,
  upsertUserProfile,
} from './services/userService';
import { supabase } from './lib/supabase';

export default function App() {
  const [view, setView] = useState<AppView>('auth');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(INITIAL_USER_STATE);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [pendingProfile, setPendingProfile] = useState<UserProfile | null>(null);

  // Apply any onboarding profile saved before email verification, once the user logs in.
  const maybeApplyPendingProfile = async (uid: string) => {
    const raw = localStorage.getItem('pending_profile');
    if (!raw) return;

    try {
      const profile = JSON.parse(raw) as UserProfile;
      const saved = await upsertUserProfile(uid, profile);
      setUserProfile(saved);
      setPendingProfile(null);
      localStorage.removeItem('pending_profile');
    } catch (err) {
      console.error('Failed to apply pending profile after login', err);
      // Do not block boot; keep pending_profile for a later retry.
      try {
        JSON.parse(raw);
      } catch {
        localStorage.removeItem('pending_profile');
      }
    }
  };

  // Load initial state
  useEffect(() => {
    let alive = true;

    const clearLocalAuthJunk = () => {
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.includes('sb-') && k.includes('auth-token')) {
            localStorage.removeItem(k);
          }
        });
        localStorage.removeItem('pending_profile');
      } catch {
        // ignore storage errors
      }
    };

    const consumeVerificationCode = async (): Promise<void> => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      if (!code) return;

      const { error } = await supabase.auth.exchangeCodeForSession({ code });
      url.searchParams.delete('code');
      url.searchParams.delete('type');
      window.history.replaceState({}, document.title, url.toString());

      if (error) {
        console.error('Email verification exchange failed', error);
        setError('Verification link is invalid or expired. Please log in again.');
      }
    };

    const boot = async () => {
      setLoading(true);
      await consumeVerificationCode();

      const { data, error } = await supabase.auth.getSession();
      if (!alive) return;

      if (error) {
        await supabase.auth.signOut();
        clearLocalAuthJunk();
        setLoading(false);
        setView('auth');
        return;
      }

      const session = data.session;
      if (!session?.user) {
        setLoading(false);
        setView('auth');
        return;
      }

      setUserId(session.user.id);
      await hydrateUser(session.user.id);
      await maybeApplyPendingProfile(session.user.id);
      setLoading(false);
      setView('dashboard');
    };

    boot();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!alive) return;

      if (!session?.user) {
        resetState();
        setView('auth');
        return;
      }

      setUserId(session.user.id);
      await hydrateUser(session.user.id);
      await maybeApplyPendingProfile(session.user.id);
      setView('dashboard');
    });

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const resetState = () => {
    setUserProfile(null);
    setUserProgress(INITIAL_USER_STATE);
    setCurrentLesson(null);
    setView('auth');
    setError(null);
    setUserId(null);
    setPendingProfile(null);
  };

  const hydrateUser = async (id: string) => {
    setError(null);
    try {
      const [profile, progress] = await Promise.all([
        fetchUserProfile(id),
        fetchProgress(id),
      ]);
      setUserProfile(profile);
      setUserProgress(progress);
      setView(profile ? 'dashboard' : 'onboarding');
    } catch (err: any) {
      console.error(err);
      setError('Could not load your data. Please try again.');
    }
  };

  // --- Handlers ---

  const handleLogin = async (email: string, password: string) => {
    setActionLoading(true);
    setError(null);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      const msg =
        authError.code === 'invalid_credentials'
          ? 'User not found or password is incorrect.'
          : authError.message || 'Unable to log in right now.';
      setError(msg);
      setActionLoading(false);
      return;
    }

    const nextUserId = data.session?.user.id || data.user?.id || null;
    if (!nextUserId) {
      setError('Could not start a session. Please verify your email and try again.');
      setActionLoading(false);
      return;
    }

    setUserId(nextUserId);
    await hydrateUser(nextUserId);
    await maybeApplyPendingProfile(nextUserId);
    setView('dashboard');
    setActionLoading(false);
  };

  const handleSignup = async () => {
    // New users start onboarding first; credentials collected at final step.
    setView('onboarding');
  };

  const handleOnboardingComplete = async ({ profile, email, password }: { profile: UserProfile; email: string; password: string }) => {
    setActionLoading(true);
    setError(null);
    // Sign up after collecting onboarding data.
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (signupError) {
      setError(signupError.message);
      setActionLoading(false);
      return;
    }

    const newUserId = data.session?.user?.id || data.user?.id || null;
    setPendingProfile(profile);
    localStorage.setItem('pending_profile', JSON.stringify(profile));

    if (!newUserId || !data.session?.access_token) {
      setError('Check your email to verify, then log in to finish setup.');
      setView('auth');
      setActionLoading(false);
      return;
    }

    // We have a session; save profile now.
    try {
      const saved = await upsertUserProfile(newUserId, profile);
      setUserId(newUserId);
      setUserProfile(saved);
      setView('recommendation');
      localStorage.removeItem('pending_profile');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Could not save your profile. Please try again.');
      setView('auth');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTrackSelection = (track: TrackType) => {
    if (!userId) return;
    setActionLoading(true);
    setError(null);
    updateTrack(userId, track, userProgress)
      .then((updated) => {
        setUserProgress(updated);
        setView('dashboard');
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to update your track right now.');
      })
      .finally(() => setActionLoading(false));
  };

  const handleStartLesson = (id: string) => {
    const lesson = LESSONS.find(l => l.id === id);
    if (lesson) {
      setCurrentLesson(lesson);
      setView('lesson');
    }
  };

  const handleLessonComplete = () => {
    if (currentLesson && userId) {
      setActionLoading(true);
      recordLessonCompletion(userId, currentLesson.id, currentLesson.xpReward)
        .then((updated) => {
          setUserProgress(updated);
        })
        .catch((err) => {
          console.error(err);
          setError('Could not save lesson progress. Please retry.');
        })
        .finally(() => setActionLoading(false));
    }
    setView('dashboard');
    setCurrentLesson(null);
  };

  // --- Render ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600 font-semibold">Loading your workspace...</div>
      </div>
    );
  }

  if (view === 'auth') return <Auth onLogin={handleLogin} onSignup={handleSignup} isLoading={actionLoading} error={error} />;
  if (view === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} isSaving={actionLoading} error={error} />;
  if (view === 'recommendation' && userProfile) return <PathRecommendation profile={userProfile} onConfirm={handleTrackSelection} />;
  if (view === 'lesson' && currentLesson) return <LessonPlayer lesson={currentLesson} onComplete={handleLessonComplete} onBack={() => setView('dashboard')} />;

  // Main Layout for Dashboard/Tracks/Projects/Rewards
  return (
    <div className="min-h-screen bg-brand-background font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('dashboard')}>
             <div className="bg-brand-primary p-1.5 rounded-lg text-white">
               <Layout size={24} />
             </div>
             <span className="text-xl font-display font-bold text-slate-800 tracking-tight">CodeSathi</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100">
              <Flame size={18} className="fill-current" />
              <span className="font-bold">{userProgress.streak} Days</span>
            </div>
            <div className="hidden md:flex items-center space-x-1 bg-indigo-50 text-brand-primary px-3 py-1 rounded-full border border-indigo-100">
              <Trophy size={18} className="fill-current" />
              <span className="font-bold">{userProgress.xp} XP</span>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                resetState();
              }}
              className="text-slate-400 hover:text-slate-600 p-2"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {view === 'dashboard' && (
          <TracksView 
            currentTrack={userProgress.currentTrack} 
            progress={userProgress} 
            onSelectLesson={handleStartLesson}
            onChangeTrack={(t) => handleTrackSelection(t)}
          />
        )}
        {view === 'tracks' && <div className="p-8 text-center">Tracks (Use Dashboard)</div>}
        {view === 'projects' && <ProjectsView />}
        {view === 'rewards' && <RewardsView progress={userProgress} />}
      </main>

      {/* Bottom Nav (Mobile/Tablet Friendly) */}
      <nav className="bg-white border-t border-slate-200 sticky bottom-0 z-30 pb-safe">
        <div className="max-w-md mx-auto flex justify-around p-2">
          <NavButton active={view === 'dashboard'} icon={Map} label="Path" onClick={() => setView('dashboard')} />
          <NavButton active={view === 'projects'} icon={Grid} label="Projects" onClick={() => setView('projects')} />
          <NavButton active={view === 'rewards'} icon={Gift} label="Rewards" onClick={() => setView('rewards')} />
        </div>
      </nav>
    </div>
  );
}

const NavButton: React.FC<{ active: boolean, icon: any, label: string, onClick: () => void }> = ({ active, icon: Icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-2 rounded-xl transition-all w-20 ${
      active ? 'text-brand-primary bg-blue-50' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <Icon size={24} className={active ? 'fill-current' : ''} />
    <span className="text-xs font-bold mt-1">{label}</span>
  </button>
);
