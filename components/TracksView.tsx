import React from 'react';
import { TrackType, Lesson, UserProgress } from '../types';
import { LESSONS } from '../constants';
import { Lock, Rocket, Check, Star } from 'lucide-react';

interface TracksViewProps {
  currentTrack: TrackType;
  progress: UserProgress;
  onSelectLesson: (id: string) => void;
  onChangeTrack: (track: TrackType) => void;
}

export const TracksView: React.FC<TracksViewProps> = ({ currentTrack, progress, onSelectLesson, onChangeTrack }) => {
  const tabs = [
    { id: TrackType.SCRATCH, label: 'Scratch', color: 'text-orange-500 border-orange-500' },
    { id: TrackType.PYTHON, label: 'Python', color: 'text-blue-500 border-blue-500' },
    { id: TrackType.JAVASCRIPT, label: 'JavaScript', color: 'text-yellow-500 border-yellow-500' },
  ];

  const lessons = LESSONS.filter(l => l.track === currentTrack);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-12">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChangeTrack(tab.id)}
            className={`px-6 py-3 rounded-full font-bold font-display text-lg transition-all border-2 ${
              currentTrack === tab.id 
                ? `bg-white ${tab.color} shadow-lg scale-105` 
                : 'border-transparent text-slate-400 hover:bg-white hover:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vertical Map */}
      <div className="relative flex flex-col items-center">
         {/* Line */}
         <div className="absolute top-0 bottom-0 w-2 bg-slate-200 rounded-full -z-10" />

         {lessons.map((lesson, index) => {
            const isCompleted = progress.completedLessons.includes(lesson.id);
            const isLocked = index > 0 && !progress.completedLessons.includes(lessons[index-1].id);
            const isCurrent = !isLocked && !isCompleted;
            
            return (
              <div key={lesson.id} className="mb-16 w-full max-w-md relative group">
                <div 
                  onClick={() => !isLocked && onSelectLesson(lesson.id)}
                  className={`
                    relative bg-white p-6 rounded-2xl shadow-md border-2 transition-all duration-300 cursor-pointer
                    ${isLocked ? 'border-slate-100 opacity-60 grayscale' : 'hover:scale-105 hover:shadow-xl'}
                    ${isCurrent ? 'border-brand-primary ring-4 ring-blue-100' : ''}
                    ${isCompleted ? 'border-brand-success' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-display text-slate-800">{lesson.title}</h3>
                    {isLocked && <Lock className="text-slate-300" />}
                    {isCompleted && <Check className="text-brand-success" />}
                    {isCurrent && <Rocket className="text-brand-primary animate-bounce" />}
                  </div>
                  <p className="text-slate-500 text-sm mb-4">{lesson.description}</p>
                  
                  {!isLocked && (
                    <div className="flex items-center text-xs font-bold text-amber-500">
                      <Star size={14} className="mr-1 fill-current" />
                      {lesson.xpReward} XP
                    </div>
                  )}

                  {/* Connector Node on the line */}
                  <div className={`
                    absolute left-1/2 -translate-x-1/2 -bottom-10 w-4 h-4 rounded-full border-2 border-white
                    ${isCompleted ? 'bg-brand-success' : 'bg-slate-300'}
                  `} />
                </div>
              </div>
            );
         })}
      </div>
    </div>
  );
};