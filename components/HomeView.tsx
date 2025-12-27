import React, { useEffect, useState } from 'react';
import { IGameCategory } from '../types';
import CategoryCard from './CategoryCard';
import { Capacitor } from '@capacitor/core';

interface HomeViewProps {
    categories: IGameCategory[];
    onSelectCategory: (category: IGameCategory) => void;
    initialScrollToCategoryId?: string;
}

const HomeView: React.FC<HomeViewProps> = ({ categories, onSelectCategory, initialScrollToCategoryId }) => {
    const [isNative, setIsNative] = useState(false);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsNative(Capacitor.isNativePlatform());
    }, []);

    // Instant scroll restoration
    React.useLayoutEffect(() => {
        if (isNative && initialScrollToCategoryId && scrollContainerRef.current) {
            const index = categories.findIndex(c => c.id === initialScrollToCategoryId);
            if (index !== -1) {
                // Assuming each item is full width (w-full in parent logic) or calculation needed.
                // In our code below: <div className="w-full ..."> wrapper for each item.
                // So scrollLeft = index * flowContainerWidth
                const container = scrollContainerRef.current;
                const itemWidth = container.clientWidth; // Since it's full width carousel

                // Use 'auto' for instant jump
                container.scrollTo({
                    left: index * itemWidth,
                    behavior: 'auto'
                });
            }
        }
    }, [isNative, initialScrollToCategoryId, categories.length]);

    // Mobile App View: Swipeable Carousel
    if (isNative) {
        return (
            <div className="w-full h-full flex flex-col overflow-hidden animate-fade-in pb-4">
                {/* Compact Header for Carousel */}
                <div className="text-center mb-8 mt-0 flex-shrink-0">
                    <h2 className="text-xl text-ink-600 font-serif mb-4">
                        请选择典籍
                    </h2>
                    <div className="text-ink-400 text-xs opacity-60">← 左右滑动以查看 →</div>
                </div>

                {/* Carousel Container - Flex Item that takes remaining space */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 flex overflow-x-auto snap-x snap-mandatory w-full no-scrollbar px-0 items-center"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map(category => (
                        <div key={category.id} className="w-full flex-shrink-0 snap-center flex justify-center px-8 h-full items-center">
                            <div className="w-full max-w-sm flex items-center justify-center">
                                <CategoryCard
                                    category={category}
                                    onClick={onSelectCategory}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Web View: Original Grid Layout
    return (
        <div className="w-full max-w-6xl mx-auto px-4 animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="text-2xl text-ink-600 font-serif mb-4">
                    请选择典籍
                </h2>
                <div className="w-24 h-1 bg-ink-100 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map(category => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        onClick={onSelectCategory}
                    />
                ))}
            </div>
        </div>
    );
};

export default HomeView;
