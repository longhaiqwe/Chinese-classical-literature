import React from 'react';
import { IGameStory } from '../types';

interface StoryCardProps {
    story: IGameStory;
    onClick: (story: IGameStory) => void;
    disabled?: boolean;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onClick, disabled = false }) => {
    const titleSizeClassName = Array.from(story.title.trim()).length >= 7
        ? 'text-lg sm:text-xl'
        : 'text-xl';

    return (
        <div
            onClick={() => !disabled && onClick(story)}
            className={`
        group relative grid min-h-[150px] grid-cols-[42%_minmax(0,1fr)] items-start gap-4 overflow-hidden rounded-lg border-2 border-ink-200 bg-paper-50 p-4 shadow-sm
        transition-all duration-300 
        ${disabled
                    ? 'opacity-60 cursor-not-allowed grayscale'
                    : 'cursor-pointer hover:border-accent-red hover:shadow-lg hover:-translate-y-1'
                }
      `}
        >
            <div className="relative aspect-[4/3] w-full self-start overflow-hidden rounded border border-ink-800/20 bg-paper-200 shadow-inner">
                {story.coverImage ? (
                    <img
                        src={story.coverImage}
                        alt={`${story.title}封面`}
                        className="h-full w-full object-cover opacity-95 transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-4xl font-calligraphy text-accent-red/50">故事</div>
                )}
            </div>

            <div className="flex h-full min-w-0 flex-col">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className={`min-w-0 break-words text-balance ${titleSizeClassName} font-bold leading-tight font-serif ${disabled ? 'text-ink-400' : 'text-ink-900'}`}>
                        {story.title}
                    </h3>
                    {disabled && (
                        <span className="shrink-0 rounded bg-ink-200 px-2 py-1 text-xs text-ink-500 font-sans">
                            敬请期待
                        </span>
                    )}
                </div>

                <p className="line-clamp-2 text-sm leading-relaxed text-ink-600 font-serif">
                    {story.description}
                </p>

                {!disabled && (
                    <div className="mt-auto flex items-center justify-end border-t border-accent-red/15 pt-2.5">
                        <span className="text-sm font-bold tracking-widest text-accent-red transition-transform group-hover:translate-x-1">
                            开始闯关 →
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryCard;
