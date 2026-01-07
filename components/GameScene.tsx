
import React, { useState, useMemo } from 'react';
import { IGameScene } from '../types';
import { UI_LABELS } from '../constants';
import { VoicePlayer } from './VoicePlayer';

interface GameSceneProps {
  scene: IGameScene;
  storyId: string;
  onNext: () => void;
  onGameOver: () => void;
  currentSceneIndex: number;
  totalScenes: number;
}

const GameScene: React.FC<GameSceneProps> = ({ scene, storyId, onNext, onGameOver, currentSceneIndex, totalScenes }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Randomize options when scene changes or retried
  const shuffledOptions = useMemo(() => {
    const options = [...scene.options];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }, [scene, retryCount]);

  const handleOptionClick = (index: number) => {
    if (showFeedback) return; // Prevent double clicking
    setSelectedOptionIndex(index);
    setShowFeedback(true);
  };

  const currentOption = selectedOptionIndex !== null ? shuffledOptions[selectedOptionIndex] : null;
  const isCorrect = currentOption?.isCorrect;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header / Title */}
      {/* Header / Title */}
      <div className="flex flex-col md:flex-row items-center justify-center relative border-b-2 border-ink-800/10 pb-4 gap-2 md:gap-0">

        {/* Title - Centered on mobile and desktop */}
        <h2 className="text-2xl md:text-3xl font-calligraphy text-accent-red text-center w-full">
          {scene.id === 7 ? scene.title : `第 ${scene.id} 章 · ${scene.title}`}
        </h2>

        {/* Progress Indicator - Below title on mobile, Right aligned on desktop */}
        <div className="md:absolute md:right-0 md:bottom-4 text-ink-500 font-serif text-sm md:text-xl md:text-ink-600 md:opacity-80 flex items-center gap-2">
          <span className="md:hidden opacity-50 text-xs">—</span>
          <span>第 {currentSceneIndex + 1} / {totalScenes} 幕</span>
          <span className="md:hidden opacity-50 text-xs">—</span>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-video bg-ink-900 rounded-sm overflow-hidden shadow-xl border-4 border-double border-ink-800/50">
        {scene.imageUrl ? (
          <img
            src={scene.imageUrl}
            alt={scene.title}
            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-paper-200 font-serif">
            [画卷缺失]
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent pointer-events-none" />
      </div>

      {/* Narrative Text */}
      <div className="bg-paper-100/80 p-6 rounded-lg border border-ink-800/20 shadow-inner">
        <p className="text-base md:text-lg leading-relaxed md:leading-loose tracking-wide text-ink-900 font-serif text-justify indent-8">
          {scene.narrative}
        </p>
        <div className="mt-4 flex justify-end">
          <VoicePlayer
            storyId={storyId}
            sceneIndex={scene.id}
            text={scene.narrative}
          />
        </div>
      </div>

      {/* Options Area */}
      <div className="space-y-4 pt-4">
        {!showFeedback ? (
          // Choice Mode
          <div className="grid gap-4">
            {shuffledOptions.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                className="w-full text-left p-4 rounded border-2 border-ink-800/30 hover:border-accent-red hover:bg-paper-200 transition-all duration-300 group relative overflow-hidden"
              >
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-ink-800 group-hover:bg-accent-red transition-colors"></span>
                <span className="pl-4 font-serif text-base md:text-lg font-bold text-ink-800">{option.text}</span>
              </button>
            ))}
          </div>
        ) : (
          // Feedback Mode
          <div className={`p-6 rounded-lg border-2 ${isCorrect ? 'border-green-700 bg-green-50' : 'border-accent-red bg-red-50'} animate-slide-up`}>
            <div className="flex items-center mb-4">
              <div className={`text-4xl mr-4 font-calligraphy ${isCorrect ? 'text-green-800' : 'text-accent-red'}`}>
                {isCorrect ? UI_LABELS.correct_feedback : UI_LABELS.incorrect_feedback}
              </div>
              <h3 className="text-xl font-bold font-serif text-ink-900">
                {isCorrect ? "抉择明智" : "此路不通"}
              </h3>
            </div>

            <p className="text-md text-ink-800 mb-6 font-serif leading-relaxed">
              {currentOption?.feedback}
            </p>

            <div className="flex justify-end gap-3">
              {isCorrect ? (
                <button
                  onClick={onNext}
                  className="px-8 py-2 bg-ink-800 text-paper-100 font-serif text-lg rounded hover:bg-accent-red transition-colors shadow-lg"
                >
                  {UI_LABELS.next_scene}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSelectedOptionIndex(null);
                      setShowFeedback(false);
                      // Optional: Reshuffle or not? User asked to "retry", usually implies resetting the decision point.
                      // If we want to reshuffle, we'd need to depend on something that changes.
                      // Currently shuffledOptions depends on [scene].
                      // If we want to reshuffle, we can add a retryCount state to the dependency.
                      setRetryCount(c => c + 1);
                    }}
                    className="px-6 py-2 bg-accent-brown text-paper-100 font-serif text-lg rounded hover:opacity-90 transition-colors shadow-lg"
                  >
                    {UI_LABELS.retry_chapter}
                  </button>
                  <button
                    onClick={onGameOver}
                    className="px-4 py-2 bg-transparent border border-accent-red text-accent-red font-serif text-lg rounded hover:bg-red-50 transition-colors"
                  >
                    结束
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScene;
