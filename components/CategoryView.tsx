import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { IGameCategory, IGameStory } from '../types';
import StoryCard from './StoryCard';

interface CategoryViewProps {
    category: IGameCategory;
    onSelectStory: (story: IGameStory) => void;
    onBack: () => void;
}

const CategoryView: React.FC<CategoryViewProps> = ({ category, onSelectStory, onBack }) => {
    const touchStartRef = useRef<{ x: number, y: number } | null>(null);
    const [isNative, setIsNative] = useState(false);

    useEffect(() => {
        setIsNative(Capacitor.isNativePlatform());
    }, []);

    // Global touch listener for "Edge Swipe Back"
    useEffect(() => {
        if (!isNative) return;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStartRef.current) return;

            const startX = touchStartRef.current.x;
            const currentX = e.changedTouches[0].clientX;
            const currentY = e.changedTouches[0].clientY;

            const deltaX = currentX - startX;
            const deltaY = currentY - touchStartRef.current.y;

            // Logic:
            // 1. Must start from the left edge (e.g., within 50px)
            // 2. Must swipe right significantly (> 60px)
            // 3. Must be relatively horizontal (abs(deltaY) < abs(deltaX))
            if (startX < 50 && deltaX > 60 && Math.abs(deltaY) < Math.abs(deltaX)) {
                onBack();
            }

            touchStartRef.current = null;
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isNative, onBack]);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 animate-fade-in">
            {/* Header with Back Button */}
            {/* Header with Title Only - Improved Design */}
            <div className="flex items-center justify-center mb-10 pb-2 mt-4">
                <h2 className="text-4xl font-calligraphy text-ink-800 tracking-wider flex items-center gap-4">
                    <span className="opacity-40 text-2xl font-serif">❝</span>
                    {category.title}
                    <span className="opacity-40 text-2xl font-serif">❞</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.stories.map(story => (
                    <StoryCard
                        key={story.id}
                        story={story}
                        onClick={onSelectStory}
                        disabled={!story.isReady}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryView;
