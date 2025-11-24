import React, { useState, useEffect } from 'react';
import { Lesson } from '../types';
import { Button } from './Button';
import { CodeEditor } from './CodeEditor';
import { ArrowRight, Lightbulb, RotateCcw, Unlock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { askSathiAI } from '../services/sathiApi';

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete: () => void;
  onBack: () => void;
}

type Step = 'intro' | 'theory' | 'practice' | 'challenge' | 'rewards';

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, onComplete, onBack }) => {
  const [step, setStep] = useState<Step>('intro');
  const [cardIndex, setCardIndex] = useState(0); // For theory
  const [editorOutput, setEditorOutput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Challenge Mode State
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  // AI State
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [aiHelp, setAiHelp] = useState<string | null>(null);

  // Persistence Key
  const storageKey = `lesson_progress_${lesson.id}`;

  // Load state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const { step: savedStep, cardIndex: savedCardIndex } = JSON.parse(saved);
        if (savedStep && savedStep !== 'rewards') setStep(savedStep);
        if (typeof savedCardIndex === 'number') setCardIndex(savedCardIndex);
      } catch (e) {
        console.error("Failed to load lesson progress", e);
      }
    }
  }, [lesson.id, storageKey]);

  // Save state to local storage when it changes
  useEffect(() => {
    if (step !== 'rewards') {
      localStorage.setItem(storageKey, JSON.stringify({ step, cardIndex }));
    }
  }, [step, cardIndex, storageKey]);

  // STEP 1: INTRO
  if (step === 'intro') {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md text-center animate-in fade-in zoom-in duration-500">
          <div className="text-6xl mb-6 animate-bounce">👋</div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">{lesson.title}</h1>
          <p className="text-xl text-slate-600 mb-8">{lesson.introText}</p>
          <Button size="lg" onClick={() => setStep('theory')}>Let's Learn! <ArrowRight className="ml-2" /></Button>
        </div>
      </div>
    );
  }

  // STEP 2: THEORY CARDS
  if (step === 'theory') {
    const card = lesson.theoryCards[cardIndex];
    const isLast = cardIndex === lesson.theoryCards.length - 1;

    return (
      <div className="h-full flex flex-col items-center justify-center bg-indigo-600 p-6 text-white relative overflow-hidden">
        <div className="w-full max-w-lg bg-white text-slate-900 rounded-3xl shadow-2xl p-8 min-h-[400px] flex flex-col justify-between animate-in slide-in-from-right duration-300" key={card.id}>
           <div>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concept {cardIndex + 1}/{lesson.theoryCards.length}</span>
             <h2 className="text-3xl font-display font-bold text-brand-primary mt-2 mb-6">{card.title}</h2>
             <p className="text-lg text-slate-600 leading-relaxed">{card.content}</p>
           </div>
           
           <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
             <Button 
                variant="ghost" 
                onClick={() => setCardIndex(c => Math.max(0, c - 1))}
                disabled={cardIndex === 0}
             >
               Back
             </Button>
             <Button onClick={() => {
               if (isLast) setStep('practice');
               else setCardIndex(c => c + 1);
             }}>
               {isLast ? 'Start Practice' : 'Next Card'}
             </Button>
           </div>
        </div>
        <div className="absolute top-10 right-10 opacity-20 text-9xl">📚</div>
      </div>
    );
  }

  // STEP 5: REWARDS
  if (step === 'rewards') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-brand-primary text-white p-6 relative overflow-hidden animate-in zoom-in duration-500">
        <div className="text-center z-10 max-w-lg">
          <div className="text-8xl mb-6 animate-bounce">🏆</div>
          <h1 className="text-5xl font-display font-bold mb-4">Lesson Complete!</h1>
          <p className="text-2xl text-indigo-100 mb-8">You earned <span className="font-bold text-yellow-300">{lesson.xpReward} XP</span> and unlocked new skills!</p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
             <div className="flex items-center justify-center space-x-4">
                <div className="text-5xl">🏅</div>
                <div className="text-left">
                  <div className="text-sm uppercase tracking-widest text-indigo-200 font-bold">New Badge</div>
                  <div className="text-xl font-bold">Concept Master</div>
                </div>
             </div>
          </div>

          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => {
              localStorage.removeItem(storageKey); // Clear persistence on completion
              onComplete();
            }}
            className="w-full sm:w-auto px-12"
          >
            Continue Journey <ArrowRight className="ml-2" />
          </Button>
        </div>
        
        {/* Confetti Background Effect */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
           <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full blur-3xl"></div>
        </div>
      </div>
    );
  }

  // STEP 3 & 4: PRACTICE & CHALLENGE
  const isChallenge = step === 'challenge';
  
  const handleRun = (code: string) => {
    let output = '';
    let success = false;
    
    // Check against pattern
    const pattern = isChallenge && lesson.challenge 
      ? lesson.challenge.solutionPattern 
      : lesson.solutionPattern;
    
    if (pattern instanceof RegExp) {
       success = pattern.test(code);
    } else {
       success = code.includes(pattern as string);
    }

    // Generate simulated output based on track
    if (lesson.track === 'PYTHON') {
        output = code.includes('print') ? (code.match(/["'](.*?)["']/) || [])[1] || 'Output' : 'Running...';
    } else if (lesson.track === 'JAVASCRIPT') {
        output = code.includes('alert') ? "Browser Alert Triggered!" : "Console Logged";
    } else {
        output = "Sprite moved 10 steps!";
    }

    setEditorOutput(output);
    setIsCorrect(success);

    if (success) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      
      setTimeout(() => {
        if (!isChallenge && lesson.challenge) {
            // Transition Practice -> Challenge
            setStep('challenge');
            setEditorOutput('');
            setIsCorrect(null);
            setAiHint(null);
            setAiHelp(null);
        } else {
            // Transition Challenge -> Rewards
            setStep('rewards');
        }
      }, 2000);
    } else {
      if (isChallenge) {
        setAttempts(prev => prev + 1);
      }
    }
  };

  const handleGetHint = async () => {
    if (aiHint) return; // Already showing
    setAiHint("Thinking...");
    const hint = await askSathiAI({ 
      intent: 'hint', 
      context: lesson.title, 
      message: 'Give me a hint for this task', 
      track: lesson.track 
    });
    setAiHint(hint);
  };

  const handleAskHelp = async () => {
    setAiHelp("Sathi is analyzing your code...");
    const help = await askSathiAI({
      intent: 'explain',
      context: `Lesson: ${lesson.title}. Task: ${isChallenge ? 'Challenge Mode' : 'Practice Mode'}.`,
      message: 'I am stuck and need an explanation.',
      track: lesson.track
    });
    setAiHelp(help);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-slate-50">
       <div className="w-full md:w-1/3 p-6 flex flex-col border-r border-slate-200 bg-white overflow-y-auto">
         
         {/* Header */}
         <div className="mb-6">
           <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold uppercase mb-2 ${isChallenge ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
             {isChallenge ? '🔥 Challenge Mode' : '🛠️ Guided Practice'}
           </div>
           <h2 className="text-2xl font-bold font-display text-slate-900">{lesson.title}</h2>
         </div>
         
         {/* Instructions */}
         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6 text-slate-700 shadow-sm">
           {isChallenge && lesson.challenge ? (
             <div>
               <p className="font-bold mb-2">Your Mission:</p>
               <p>{lesson.challenge.description}</p>
             </div>
           ) : (
             <div>
               <p className="font-bold mb-2">Instructions:</p>
               <ul className="list-disc pl-4 space-y-2">
                 {lesson.instructions.map((i, idx) => <li key={idx}>{i}</li>)}
               </ul>
             </div>
           )}
         </div>

         {/* Hint Section */}
         {!isChallenge && !aiHint && (
           <Button variant="ghost" size="sm" onClick={handleGetHint} className="mb-4 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
             <Lightbulb size={16} className="mr-2" /> Need a Hint?
           </Button>
         )}

         {aiHint && (
           <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 text-sm mb-4 animate-in fade-in flex items-start">
             <Lightbulb size={16} className="mr-2 mt-0.5 flex-shrink-0" />
             <div>{aiHint}</div>
           </div>
         )}

         {/* AI Help Response */}
         {aiHelp && (
           <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-brand-primary text-sm mb-4 animate-in fade-in flex items-start">
              <div className="mr-2 text-xl mt-0.5">🤖</div>
              <div>{aiHelp}</div>
           </div>
         )}
         
         {/* Challenge Mode Extras */}
         {isChallenge && attempts >= 3 && !showSolution && (
           <div className="mb-4 animate-in fade-in">
             <p className="text-xs text-red-500 mb-2 font-bold">Stuck? You've tried {attempts} times.</p>
             <Button size="sm" variant="secondary" onClick={() => setShowSolution(true)} fullWidth>
               <Unlock size={14} className="mr-2" /> Show Solution Pattern
             </Button>
           </div>
         )}

         {showSolution && (
           <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-xs mb-4">
             Pattern: {String(lesson.challenge?.solutionPattern)}
           </div>
         )}

         <div className="mt-auto space-y-3">
            <Button fullWidth variant="outline" onClick={handleAskHelp}>
              Ask Sathi for Help
            </Button>
            <Button fullWidth variant="ghost" onClick={onBack} className="text-slate-400 hover:text-slate-600">
              <RotateCcw size={16} className="mr-2" /> Exit Lesson
            </Button>
         </div>
       </div>

       {/* Editor */}
       <div className="flex-1 p-4 md:p-6 bg-slate-100">
         <CodeEditor 
           initialCode={isChallenge && lesson.challenge ? lesson.challenge.initialCode : lesson.initialCode}
           language={lesson.track.toLowerCase()}
           onRun={handleRun}
           output={editorOutput}
           isCorrect={isCorrect}
         />
       </div>
    </div>
  );
};