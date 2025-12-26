
import React, { useState } from 'react';
import { IGameScene } from '../types';
import { UI_LABELS } from '../constants';

interface GameSceneProps {
  scene: IGameScene;
  onNext: () => void;
  onGameOver: () => void;
}

const GameScene: React.FC<GameSceneProps> = ({ scene, onNext, onGameOver }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionClick = (index: number) => {
    if (showFeedback) return; // Prevent double clicking
    setSelectedOptionIndex(index);
    setShowFeedback(true);
  };

  const currentOption = selectedOptionIndex !== null ? scene.options[selectedOptionIndex] : null;
  const isCorrect = currentOption?.isCorrect;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header / Title */}
      <div className="text-center border-b-2 border-ink-800/10 pb-4">
        <h2 className="text-3xl font-calligraphy text-accent-red mb-2">
          {scene.id === 7 ? scene.title : `第 ${scene.id} 章 · ${scene.title}`}
        </h2>
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
      </div>

      {/* Options Area */}
      <div className="space-y-4 pt-4">
        {!showFeedback ? (
          // Choice Mode
          <div className="grid gap-4">
            {scene.options.map((option, idx) => (
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

            <div className="flex justify-end">
              {isCorrect ? (
                <button
                  onClick={onNext}
                  className="px-8 py-2 bg-ink-800 text-paper-100 font-serif text-lg rounded hover:bg-accent-red transition-colors shadow-lg"
                >
                  {UI_LABELS.next_scene}
                </button>
              ) : (
                <button
                  onClick={onGameOver}
                  className="px-8 py-2 bg-accent-red text-paper-100 font-serif text-lg rounded hover:bg-red-800 transition-colors shadow-lg"
                >
                  结束
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScene;
