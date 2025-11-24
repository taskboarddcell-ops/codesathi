import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Layout,
  LogOut,
  Map,
  Grid,
  Gift,
} from 'lucide-react';
import { LESSONS } from './constants';
import { TrackType, AppView, Lesson } from './types';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { PathRecommendation } from './components/PathRecommendation';
import { TracksView } from './components/TracksView';
import { ProjectsView } from './components/ProjectsView';
import { RewardsView } from './components/RewardsView';
import { LessonPlayer } from './components/LessonPlayer';
import {
  recordLessonCompletion,
  updateTrack,
  upsertUserProfile,
} from './services/userService';
import { supabase } from './lib/supabase';
import { useAuth } from './hooks/useAuth';
import { useUserData } from './hooks/useUserData';

export default function App() {
  const [view, setView] = useState<AppView>('auth');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Use custom hooks for auth and user data
  const auth = useAuth();
  const userData = useUserData(auth.userId);

  // Determine initial view based on auth and user data
  React.useEffect(() => {
    if (auth.loading || userData.loading) return;

    if (!auth.userId) {
      setView('auth');
    } else if (!userData.userProfile) {
      setView('onboarding');
    } else if (view === 'auth' || view === 'onboarding') {
      setView('dashboard');
    }
  }, [auth.loading, auth.userId, userData.loading, userData.userProfile]);

  // --- Handlers ---

  const handleLogin = async (email: string, password: string) => {
    setActionLoading(true);
    auth.setError(null);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      const msg =
        authError.code === 'invalid_credentials'
          ? 'User not found or password is incorrect.'
          : authError.message || 'Unable to log in right now.';
      auth.setError(msg);
      setActionLoading(false);
      return;
    }

    const nextUserId = data.session?.user.id || data.user?.id || null;
    if (!nextUserId) {
      auth.setError('Could not start a session. Please verify your email and try again.');
      setActionLoading(false);
      return;
    }

    setActionLoading(false);
  };

  const handleSignup = async () => {
    // New users start onboarding first; credentials collected at final step.
    setView('onboarding');
  };

  const handleOnboardingComplete = async ({ profile, email, password }: { profile: any; email: string; password: string }) => {
    setActionLoading(true);
    auth.setError(null);
    
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (signupError) {
      auth.setError(signupError.message);
      setActionLoading(false);
      return;
    }

    const newUserId = data.session?.user?.id || data.user?.id || null;
    userData.setPendingProfile(profile);
    localStorage.setItem('pending_profile', JSON.stringify(profile));

    if (!newUserId || !data.session?.access_token) {
      auth.setError('Check your email to verify, then log in to finish setup.');
      setView('auth');
      setActionLoading(false);
      return;
    }

    // We have a session; save profile now.
    try {
      const saved = await upsertUserProfile(newUserId, profile);
      userData.setUserProfile(saved);
      setView('recommendation');
      localStorage.removeItem('pending_profile');
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Could not save your profile. Please try again.';
      auth.setError(errorMessage);
      setView('auth');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTrackSelection = (track: TrackType) => {
    if (!auth.userId) return;
    setActionLoading(true);
    auth.setError(null);
    updateTrack(auth.userId, track, userData.userProgress)
      .then((updated) => {
        userData.setUserProgress(updated);
        setView('dashboard');
      })
      .catch((err) => {
        console.error(err);
        auth.setError('Unable to update your track right now.');
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
    if (currentLesson && auth.userId) {
      setActionLoading(true);
      recordLessonCompletion(auth.userId, currentLesson.id, currentLesson.xpReward)
        .then((updated) => {
          userData.setUserProgress(updated);
        })
        .catch((err) => {
          console.error(err);
          auth.setError('Could not save lesson progress. Please retry.');
        })
        .finally(() => setActionLoading(false));
    }
    setView('dashboard');
    setCurrentLesson(null);
  };

  const handleLogout = async () => {
    await auth.signOut();
    setView('auth');
    setCurrentLesson(null);
  };

  // --- Render ---

  if (auth.loading || userData.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600 font-semibold">Loading your workspace...</div>
      </div>
    );
  }

  if (view === 'auth') return <Auth onLogin={handleLogin} onSignup={handleSignup} isLoading={actionLoading} error={auth.error} />;
  if (view === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} isSaving={actionLoading} error={auth.error} />;
  if (view === 'recommendation' && userData.userProfile) return <PathRecommendation profile={userData.userProfile} onConfirm={handleTrackSelection} />;
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
              <span className="font-bold">{userData.userProgress.streak} Days</span>
            </div>
            <div className="hidden md:flex items-center space-x-1 bg-indigo-50 text-brand-primary px-3 py-1 rounded-full border border-indigo-100">
              <Trophy size={18} className="fill-current" />
              <span className="font-bold">{userData.userProgress.xp} XP</span>
            </div>
            <button
              onClick={handleLogout}
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
            currentTrack={userData.userProgress.currentTrack} 
            progress={userData.userProgress} 
            onSelectLesson={handleStartLesson}
            onChangeTrack={(t) => handleTrackSelection(t)}
          />
        )}
        {view === 'tracks' && <div className="p-8 text-center">Tracks (Use Dashboard)</div>}
        {view === 'projects' && <ProjectsView />}
        {view === 'rewards' && <RewardsView progress={userData.userProgress} />}
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

const NavButton: React.FC<{ active: boolean, icon: React.ComponentType<{ size: number; className?: string }>, label: string, onClick: () => void }> = ({ active, icon: Icon, label, onClick }) => (
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
