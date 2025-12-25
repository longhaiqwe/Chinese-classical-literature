import React from 'react';
import { GenerationProgress } from '../types';
import { UI_LABELS } from '../constants';

interface LoadingScreenProps {
  progress?: GenerationProgress;
  mode: 'story' | 'image';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, mode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-ink-800 p-8 space-y-8 animate-fade-in">
      <div className="relative w-24 h-24 border-4 border-ink-800 rounded-full flex items-center justify-center animate-spin-slow">
         <div className="w-16 h-16 border-t-2 border-r-2 border-accent-red rounded-full animate-spin"></div>
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-calligraphy text-4xl">
          {mode === 'story' ? UI_LABELS.loading_story : UI_LABELS.loading_images}
        </h2>
        
        {progress && (
          <div className="w-64 h-2 bg-ink-500/20 rounded-full overflow-hidden mx-auto mt-4 border border-ink-800/30">
            <div 
              className="h-full bg-accent-red transition-all duration-500 ease-out"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        )}
        
        {progress && (
          <p className="text-sm font-serif italic text-ink-500">
             {progress.message} ({progress.current}/{progress.total})
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;