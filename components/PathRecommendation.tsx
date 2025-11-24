import React, { useEffect, useState } from 'react';
import { UserProfile, TrackType } from '../types';
import { Button } from './Button';
import { Sparkles, ArrowRight, BrainCircuit, Code, Puzzle } from 'lucide-react';

interface PathRecommendationProps {
  profile: UserProfile;
  onConfirm: (track: TrackType) => void;
}

export const PathRecommendation: React.FC<PathRecommendationProps> = ({ profile, onConfirm }) => {
  const [recommendedTrack, setRecommendedTrack] = useState<TrackType | null>(null);

  useEffect(() => {
    // Recommendation Logic (Kids-First Rules)
    let track = TrackType.SCRATCH;

    if (profile.ageGroup === '7-9') {
      track = TrackType.SCRATCH;
    } else if (profile.ageGroup === '10-12') {
      // If interest is specifically web and they have some exp, maybe JS?
      // But safe bet is Python for logic or Scratch for games
      if (profile.goals.includes('web') && profile.experience !== 'none') {
        track = TrackType.JAVASCRIPT;
      } else if (profile.goals.includes('games') && profile.experience === 'none') {
        track = TrackType.SCRATCH;
      } else {
        track = TrackType.PYTHON;
      }
    } else { // 13-14
       if (profile.goals.includes('web')) {
         track = TrackType.JAVASCRIPT;
       } else {
         track = TrackType.PYTHON;
       }
    }
    
    // Override: If experience is totally none and they want visual
    if (profile.experience === 'none' && profile.learningStyle === 'visual') {
        track = TrackType.SCRATCH;
    }

    setRecommendedTrack(track);
  }, [profile]);

  if (!recommendedTrack) return null;

  const getTrackInfo = (track: TrackType) => {
    switch (track) {
      case TrackType.SCRATCH:
        return {
          title: 'Scratch Creative Path',
          desc: 'Perfect for visual learners! You will drag and drop blocks to make games and stories.',
          icon: Puzzle,
          color: 'bg-orange-500'
        };
      case TrackType.PYTHON:
        return {
          title: 'Python Logic Path',
          desc: 'The best language for beginners who want to type real code. Used by NASA and Google!',
          icon: BrainCircuit,
          color: 'bg-blue-500'
        };
      case TrackType.JAVASCRIPT:
        return {
          title: 'Web Master Path',
          desc: 'Build real websites and interactive apps. The language of the internet.',
          icon: Code,
          color: 'bg-yellow-400'
        };
    }
  };

  const info = getTrackInfo(recommendedTrack);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-primary rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-secondary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full relative z-10 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles size={40} className="text-brand-primary" />
        </div>
        
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Path Found!</h1>
        <p className="text-slate-500 mb-8">Based on your profile, Sathi recommends:</p>

        <div className="bg-slate-50 border-2 border-indigo-100 rounded-2xl p-8 mb-8 hover:shadow-lg transition-shadow cursor-default">
          <div className={`${info.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            <info.icon className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">{info.title}</h2>
          <p className="text-slate-600 leading-relaxed max-w-md mx-auto">{info.desc}</p>
        </div>

        <Button size="lg" fullWidth onClick={() => onConfirm(recommendedTrack!)} className="group">
          Start My Adventure <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        <p className="mt-4 text-xs text-slate-400">You can always switch tracks later in the settings.</p>
      </div>
    </div>
  );
};