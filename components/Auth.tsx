import React, { useState } from 'react';
import { Rocket, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface AuthProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: () => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onSignup, isLoading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    await onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left Side - Brand */}
        <div className="md:w-1/2 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute right-10 top-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute left-10 bottom-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-indigo-500 p-2 rounded-xl">
                <Rocket size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold">CodeSathi</h1>
            </div>
            <h2 className="text-4xl font-display font-bold leading-tight mb-6">
              Code Your Future. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                Build Your Dreams.
              </span>
            </h2>
            <p className="text-slate-400 text-lg">
              The AI-powered coding platform built just for you. Start your adventure today!
            </p>
          </div>

          <div className="relative z-10 mt-12 flex space-x-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-slate-900"></div>
              <div className="w-8 h-8 rounded-full bg-pink-400 border-2 border-slate-900"></div>
              <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-slate-900"></div>
            </div>
            <span className="text-sm font-medium text-slate-300 self-center">Join 10,000+ young coders</span>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
              Welcome Back!
            </h3>
            <p className="text-slate-500">Ready to continue your streak?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email (Parent's or Yours)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="hello@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            
            {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}

            <Button fullWidth size="lg" className="mt-4 group" disabled={isLoading}>
              {isLoading ? 'Please wait...' : 'Log In'}
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              New here?{' '}
              <button
                onClick={() => onSignup()}
                className="font-bold text-brand-primary hover:underline"
              >
                Start onboarding
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
