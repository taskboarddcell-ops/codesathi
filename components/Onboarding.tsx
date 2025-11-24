import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Button } from './Button';
import { Sparkles, Gamepad2, Globe, Cpu, Palette, User, Users, Smartphone, Laptop, Monitor, Clock, CheckCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: (result: { profile: UserProfile; email: string; password: string }) => Promise<void> | void;
  error?: string | null;
  isSaving?: boolean;
}

const STEPS = 12;

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, error, isSaving }) => {
  const [step, setStep] = useState(1);
  
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    goals: [],
    devices: [],
    timePerDay: 15,
    parentReport: false,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'goals' | 'devices', value: string) => {
    const current = profile[key] || [];
    const updated = current.includes(value) 
      ? current.filter(i => i !== value)
      : [...current, value];
    updateProfile(key, updated);
  };

  const handleNext = async () => {
    if (step < STEPS) {
      setStep(step + 1);
    } else {
      const finalProfile = profile as UserProfile;
      await onComplete({ profile: finalProfile, email, password });
    }
  };

  const StepContent = () => {
    switch (step) {
      case 1: // Learner Type
        return (
          <div className="space-y-4 animate-in slide-in-from-right fade-in">
            <h2 className="text-2xl font-bold font-display text-center mb-6">Who is learning today?</h2>
            <div className="grid grid-cols-2 gap-4">
              <SelectionCard 
                icon={User} label="Myself" 
                selected={profile.learnerType === 'myself'} 
                onClick={() => updateProfile('learnerType', 'myself')} 
              />
              <SelectionCard 
                icon={Users} label="My Child" 
                selected={profile.learnerType === 'child'} 
                onClick={() => updateProfile('learnerType', 'child')} 
              />
            </div>
            {profile.learnerType && (
              <div className="mt-4">
                <label className="block text-sm font-bold text-slate-700 mb-1">What is the learner's name?</label>
                <input 
                  type="text" 
                  value={profile.name || ''} 
                  onChange={(e) => updateProfile('name', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none"
                  placeholder="e.g. Maya"
                />
              </div>
            )}
          </div>
        );
      case 2: // Age
        return (
          <div className="space-y-4 animate-in slide-in-from-right fade-in">
            <h2 className="text-2xl font-bold font-display text-center mb-6">How old is {profile.name || 'the learner'}?</h2>
            <div className="grid grid-cols-1 gap-3">
              {['7-9', '10-12', '13-14'].map((age) => (
                <button
                  key={age}
                  onClick={() => updateProfile('ageGroup', age)}
                  className={`p-4 rounded-xl border-2 text-lg font-bold transition-all ${
                    profile.ageGroup === age 
                    ? 'border-brand-primary bg-blue-50 text-brand-primary' 
                    : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {age} years old
                </button>
              ))}
            </div>
          </div>
        );
      case 3: // Goals
        return (
          <div className="space-y-4 animate-in slide-in-from-right fade-in">
            <h2 className="text-2xl font-bold font-display text-center mb-6">What do you want to build?</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'games', label: 'Make Games', icon: Gamepad2 },
                { id: 'web', label: 'Build Websites', icon: Globe },
                { id: 'animations', label: 'Animations', icon: Palette },
                { id: 'explore', label: 'Just Exploring', icon: Sparkles },
              ].map(opt => (
                <SelectionCard 
                  key={opt.id}
                  icon={opt.icon} label={opt.label} 
                  selected={profile.goals?.includes(opt.id)} 
                  onClick={() => toggleArrayItem('goals', opt.id)} 
                />
              ))}
            </div>
          </div>
        );
      case 4: // Experience
        return (
           <div className="space-y-4 animate-in slide-in-from-right fade-in">
            <h2 className="text-2xl font-bold font-display text-center mb-6">Coding Experience?</h2>
             <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'none', label: 'Brand New', desc: "I've never coded before." },
                { id: 'scratch', label: 'Scratch User', desc: 'I have used blocks.' },
                { id: 'code', label: 'Hacker', desc: 'I have typed code before.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateProfile('experience', opt.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    profile.experience === opt.id 
                      ? 'border-brand-primary bg-blue-50 ring-2 ring-blue-100' 
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900">{opt.label}</div>
                  <div className="text-sm text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
           </div>
        );
      case 5: // Learning Style
        return (
           <div className="space-y-4 animate-in slide-in-from-right fade-in">
            <h2 className="text-2xl font-bold font-display text-center mb-6">How do you learn best?</h2>
             <div className="grid grid-cols-1 gap-3">
              <SelectionCard label="Visuals & Stories" selected={profile.learningStyle === 'visual'} onClick={() => updateProfile('learningStyle', 'visual')} icon={Palette} />
              <SelectionCard label="Challenges & Games" selected={profile.learningStyle === 'challenges'} onClick={() => updateProfile('learningStyle', 'challenges')} icon={Gamepad2} />
              <SelectionCard label="Step-by-Step Instructions" selected={profile.learningStyle === 'step'} onClick={() => updateProfile('learningStyle', 'step')} icon={CheckCircle} />
            </div>
           </div>
        );
      case 6: // Devices
        return (
           <div className="space-y-4 animate-in slide-in-from-right fade-in">
            <h2 className="text-2xl font-bold font-display text-center mb-6">What devices do you use?</h2>
             <div className="grid grid-cols-2 gap-3">
               <SelectionCard icon={Smartphone} label="Tablet/Phone" selected={profile.devices?.includes('mobile')} onClick={() => toggleArrayItem('devices', 'mobile')} />
               <SelectionCard icon={Laptop} label="Laptop" selected={profile.devices?.includes('laptop')} onClick={() => toggleArrayItem('devices', 'laptop')} />
            </div>
           </div>
        );
      case 7: // Time
        return (
           <div className="space-y-8 animate-in slide-in-from-right fade-in text-center">
            <h2 className="text-2xl font-bold font-display mb-2">Daily Goal</h2>
            <p className="text-slate-500 mb-6">How many minutes per day?</p>
            
            <div className="relative pt-6 pb-2">
              <div className="text-4xl font-black text-brand-primary mb-4">{profile.timePerDay} min</div>
              <input 
                type="range" 
                min="5" max="60" step="5"
                value={profile.timePerDay}
                onChange={(e) => updateProfile('timePerDay', parseInt(e.target.value))}
                className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-bold">
                <span>5m</span>
                <span>30m</span>
                <span>60m</span>
              </div>
            </div>
           </div>
        );
      case 8: // Parent Toggle
        return (
           <div className="space-y-6 animate-in slide-in-from-right fade-in">
            <h2 className="text-2xl font-bold font-display text-center mb-6">Parent Preferences</h2>
             
             {profile.learnerType === 'child' && (
               <div className="bg-white p-6 rounded-2xl border-2 border-indigo-50 shadow-sm flex items-center justify-between">
                 <div>
                   <h4 className="font-bold text-slate-900">Weekly Parent Report</h4>
                   <p className="text-xs text-slate-500 max-w-[200px]">Receive progress updates via email.</p>
                 </div>
                 <button 
                  onClick={() => updateProfile('parentReport', !profile.parentReport)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${profile.parentReport ? 'bg-brand-success' : 'bg-slate-300'}`}
                 >
                   <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${profile.parentReport ? 'left-7' : 'left-1'}`} />
                 </button>
               </div>
             )}

             <div className="bg-blue-50 p-6 rounded-2xl text-center">
               <h3 className="font-bold text-brand-primary mb-2">Ready to Launch? 🚀</h3>
               <p className="text-sm text-slate-600">Tell us how to reach you next.</p>
             </div>
           </div>
        );
      case 9: // Phone
        return (
          <div className="space-y-6 animate-in slide-in-from-right fade-in">
            <h2 className="text-2xl font-bold font-display text-center mb-6">Parent / Guardian Phone</h2>
            <p className="text-slate-500 text-center">We use this only for important updates. No spam.</p>
            <input
              type="tel"
              value={profile.phoneNumber || ''}
              onChange={(e) => updateProfile('phoneNumber', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none"
              placeholder="e.g. +1 555 123 4567"
            />
            <p className="text-xs text-slate-400 text-center">Enter a valid number with country code.</p>
          </div>
        );
      case 10: // Address
        return (
          <div className="space-y-6 animate-in slide-in-from-right fade-in">
            <h2 className="text-2xl font-bold font-display text-center mb-6">Mailing Address</h2>
            <p className="text-slate-500 text-center">Optional, for certificates and rewards.</p>
            <textarea
              value={profile.address || ''}
              onChange={(e) => updateProfile('address', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none min-h-[120px] resize-none"
              placeholder="Street, City, State, Zip/Postal, Country"
            />
            <p className="text-xs text-slate-400 text-center">We keep your info private and secure.</p>
          </div>
        );
      case 11: // Account Email
        return (
          <div className="space-y-6 animate-in slide-in-from-right fade-in">
            <h2 className="text-2xl font-bold font-display text-center mb-6">Create Your Account</h2>
            <p className="text-slate-500 text-center">Use a parent/guardian email if you are under 13.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none"
              placeholder="name@example.com"
            />
          </div>
        );
      case 12: // Account Password
        return (
          <div className="space-y-6 animate-in slide-in-from-right fade-in">
            <h2 className="text-2xl font-bold font-display text-center mb-6">Secure Your Account</h2>
            <p className="text-slate-500 text-center">Use a strong password you can remember.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none"
              placeholder="••••••••"
            />
            <p className="text-xs text-slate-400 text-center">Minimum 8 characters recommended.</p>
          </div>
        );
      default: return null;
    }
  };

  const isStepValid = () => {
    switch(step) {
      case 1: return !!profile.learnerType && !!profile.name;
      case 2: return !!profile.ageGroup;
      case 3: return profile.goals && profile.goals.length > 0;
      case 4: return !!profile.experience;
      case 5: return !!profile.learningStyle;
      case 6: return profile.devices && profile.devices.length > 0;
      case 9: return !!(profile.phoneNumber && profile.phoneNumber.trim().length >= 7);
      case 10: return !!(profile.address && profile.address.trim().length >= 10);
      case 11: return !!email && email.includes('@');
      case 12: return !!password && password.length >= 6;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Progress */}
        <div className="bg-slate-100 h-2 w-full">
          <div className="bg-brand-primary h-full transition-all duration-300" style={{ width: `${(step/STEPS)*100}%` }} />
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          <StepContent />
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => setStep(s => Math.max(1, s-1))}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!isStepValid() || isSaving}
            className="w-32"
          >
            {isSaving ? 'Loading...' : step === STEPS ? 'Finish' : 'Next'}
          </Button>
        </div>

        {error && (
          <div className="px-8 pb-4 text-sm font-semibold text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

const SelectionCard: React.FC<{ icon: any, label: string, selected?: boolean, onClick: () => void }> = ({ icon: Icon, label, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all h-32 ${
      selected 
        ? 'border-brand-primary bg-blue-50 text-brand-primary' 
        : 'border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-200'
    }`}
  >
    <Icon size={32} className="mb-2" />
    <span className="font-bold text-sm">{label}</span>
    {selected && <div className="mt-1 bg-brand-primary text-white p-0.5 rounded-full"><CheckCircle size={12} /></div>}
  </button>
);
