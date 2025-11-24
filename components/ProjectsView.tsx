import React from 'react';
import { PROJECTS } from '../constants';
import { Lock, Play, Star } from 'lucide-react';
import { Button } from './Button';

export const ProjectsView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-slate-900">Projects Hub</h2>
        <p className="text-slate-500">Apply your skills to build real things.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map(project => (
          <div key={project.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="h-32 bg-slate-100 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
              {project.image}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase">
                  {project.track}
                </span>
                <span className="text-xs font-bold text-amber-500 flex items-center">
                  <Star size={12} className="mr-1 fill-current" /> {project.xpReward}
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-2">{project.title}</h3>
              <p className="text-slate-500 text-sm mb-6">{project.description}</p>
              
              <Button fullWidth disabled={project.locked} variant={project.locked ? 'ghost' : 'primary'}>
                {project.locked ? (
                  <><Lock size={16} className="mr-2" /> Locked</>
                ) : (
                  <><Play size={16} className="mr-2" /> Start Project</>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};