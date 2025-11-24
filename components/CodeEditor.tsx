import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Terminal } from 'lucide-react';
import { Button } from './Button';

interface CodeEditorProps {
  initialCode: string;
  language: string;
  onRun: (code: string) => void;
  output: string | null;
  isCorrect: boolean | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialCode, 
  language, 
  onRun, 
  output,
  isCorrect
}) => {
  const [code, setCode] = useState(initialCode);

  // Reset code when lesson changes
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleRun = () => {
    onRun(code);
  };

  const handleReset = () => {
    setCode(initialCode);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-2">
           <div className="flex space-x-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-slate-400 text-sm font-mono uppercase font-bold">{language} Env</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Reset Code"
          >
            <RotateCcw size={18} />
          </button>
          <Button size="sm" variant="secondary" onClick={handleRun}>
            <Play size={16} className="mr-2 fill-current" /> Run Code
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative flex">
        {/* Line Numbers */}
        <div className="bg-slate-900 w-12 py-4 flex flex-col items-end pr-3 text-slate-600 select-none font-mono text-sm border-r border-slate-800">
          {code.split('\n').map((_, i) => (
            <div key={i} className="leading-6">{i + 1}</div>
          ))}
        </div>
        
        {/* Text Area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-slate-900 text-slate-100 p-4 font-mono text-sm leading-6 outline-none resize-none border-none focus:ring-0"
          spellCheck={false}
        />
      </div>

      {/* Output Console (Active Learning Feedback) */}
      <div className={`border-t border-slate-700 bg-slate-950 transition-all duration-300 ${output ? 'h-40' : 'h-12'}`}>
        <div className="px-4 py-2 bg-slate-900/50 flex items-center text-xs text-slate-400 font-bold uppercase tracking-wider">
          <Terminal size={12} className="mr-2" /> Console Output
        </div>
        <div className="p-4 font-mono text-sm h-full overflow-y-auto">
          {output ? (
             <div className={isCorrect === true ? "text-green-400" : isCorrect === false ? "text-red-400" : "text-slate-300"}>
               {isCorrect === true && <span className="font-bold">✅ Success: </span>}
               {isCorrect === false && <span className="font-bold">❌ Error: </span>}
               <span className="whitespace-pre-wrap">{output}</span>
             </div>
          ) : (
            <span className="text-slate-600 italic">... Waiting for execution ...</span>
          )}
        </div>
      </div>
    </div>
  );
};