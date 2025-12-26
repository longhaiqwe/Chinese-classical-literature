import React from 'react';
import { IGameStory } from '../types';

interface StoryCardProps {
    story: IGameStory;
    onClick: (story: IGameStory) => void;
    disabled?: boolean;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onClick, disabled = false }) => {
    return (
        <div
            onClick={() => !disabled && onClick(story)}
            className={`
        relative p-6 border-2 border-ink-200 bg-paper-50 rounded-lg shadow-sm 
        transition-all duration-300 
        ${disabled
                    ? 'opacity-60 cursor-not-allowed grayscale'
                    : 'cursor-pointer hover:border-accent-red hover:shadow-lg hover:-translate-y-1'
                }
      `}
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className={`text-xl font-bold font-serif ${disabled ? 'text-ink-400' : 'text-ink-900'}`}>
                    {story.title}
                </h3>
                {disabled && (
                    <span className="text-xs px-2 py-1 bg-ink-200 text-ink-500 rounded font-sans">
                        未解锁
                    </span>
                )}
            </div>

            <p className="text-ink-600 font-serif leading-relaxed text-sm">
                {story.description}
            </p>

            {!disabled && (
                <div className="mt-4 flex justify-end">
                    <span className="text-accent-red font-bold text-sm tracking-widest group-hover:translate-x-1 transition-transform">
                        开始闯关 →
                    </span>
                </div>
            )}
        </div>
    );
};

export default StoryCard;
