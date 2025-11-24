import React from 'react';
import { BADGES } from '../constants';
import { UserProgress } from '../types';
import { Shield } from 'lucide-react';

interface RewardsViewProps {
  progress: UserProgress;
}

export const RewardsView: React.FC<RewardsViewProps> = ({ progress }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in">
       {/* Avatar Section */}
       <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white mb-10 flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-display font-bold mb-2">My Inventory</h2>
           <p className="text-indigo-100">Show off your achievements!</p>
         </div>
         <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
           <span className="text-6xl">🧑‍🚀</span>
         </div>
       </div>

       {/* Badges Grid */}
       <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
         <Shield className="mr-2 text-brand-primary" /> Badges
       </h3>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {BADGES.map(badge => {
           const isUnlocked = progress.badges.includes(badge.id);
           return (
             <div 
               key={badge.id} 
               className={`
                 p-4 rounded-2xl border-2 text-center transition-all
                 ${isUnlocked ? 'bg-white border-brand-primary' : 'bg-slate-50 border-slate-100 opacity-60 grayscale'}
               `}
             >
               <div className="text-4xl mb-3">{badge.icon}</div>
               <h4 className="font-bold text-slate-900 text-sm mb-1">{badge.name}</h4>
               <p className="text-xs text-slate-500">{badge.description}</p>
             </div>
           );
         })}
       </div>
    </div>
  );
};