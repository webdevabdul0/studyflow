import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';

interface FocusTimerProps {
  className?: string;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ className = '' }) => {
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Auto flip mode
      if (mode === 'study') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('study');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggleRun = () => setIsRunning(!isRunning);

  const resetTimer = (newMode = mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'study' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalTime = mode === 'study' ? 25 * 60 : 5 * 60;
  const progressPercent = Math.round(((totalTime - timeLeft) / totalTime) * 100);

  return (
    <div className={`bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {mode === 'study' ? (
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {mode === 'study' ? 'Pomodoro Focus' : 'Short Break'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {isRunning ? 'Timer running...' : 'Ready to concentrate?'}
            </p>
          </div>
        </div>

        {/* Mode switch */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => resetTimer('study')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mode === 'study' ? 'bg-white text-blue-700 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => resetTimer('break')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mode === 'break' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            5m Rest
          </button>
        </div>
      </div>

      {/* Timer Display */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono tracking-tight text-slate-900">
            {formattedTime}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {mode === 'study' ? 'Session' : 'Break'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleRun}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs shadow-xs transition-all active:scale-95 ${
              isRunning
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start</span>
              </>
            )}
          </button>
          <button
            onClick={() => resetTimer(mode)}
            title="Reset timer"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress line */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            mode === 'study' ? 'bg-blue-600' : 'bg-emerald-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
