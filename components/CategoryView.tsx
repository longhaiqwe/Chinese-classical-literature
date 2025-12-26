import React from 'react';
import { IGameCategory, IGameStory } from '../types';
import StoryCard from './StoryCard';

interface CategoryViewProps {
    category: IGameCategory;
    onSelectStory: (story: IGameStory) => void;
    onBack: () => void;
}

const CategoryView: React.FC<CategoryViewProps> = ({ category, onSelectStory, onBack }) => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 animate-fade-in">
            {/* Header with Back Button */}
            <div className="flex items-center mb-8 pb-4 border-b border-ink-100">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 text-ink-600 hover:text-accent-red transition-colors"
                >
                    <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="font-serif">返回书架</span>
                </button>
                <div className="flex-1 text-center pr-24">
                    <h2 className="text-3xl font-calligraphy text-ink-900">{category.title}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.stories.map(story => (
                    <StoryCard
                        key={story.id}
                        story={story}
                        onClick={onSelectStory}
                        disabled={story.scenes.length === 0}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryView;
