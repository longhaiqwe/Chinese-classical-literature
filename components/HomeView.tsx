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

    // Create an extended array: [Last, ...Originals, First]
    // This allows swiping left from First to Last, and right from Last to First.
    const extendedCategories = React.useMemo(() => {
        if (categories.length === 0) return [];

        return [
            { ...categories[categories.length - 1], id: categories[categories.length - 1].id + '_clone_start' },
            ...categories,
            { ...categories[0], id: categories[0].id + '_clone_end' }
        ];
    }, [categories]);

    // Ref to track if we need to adjust scroll silently
    const isScrollingRef = React.useRef(false);

    // Initial scroll positioning
    useEffect(() => {
        if (isNative && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const itemWidth = container.clientWidth;
            // Start at index 1 (the first real item)
            // Use setTimeout to ensure layout is ready
            setTimeout(() => {
                container.scrollTo({ left: itemWidth, behavior: 'auto' });
            }, 0);
        }
    }, [isNative]); // Run once when switching to native view

    const handleScroll = () => {
        if (!isNative || !scrollContainerRef.current || isScrollingRef.current) return;

        const container = scrollContainerRef.current;
        const scrollLeft = container.scrollLeft;
        const itemWidth = container.clientWidth;
        const totalWidth = container.scrollWidth;

        // Check if we are near the start (Clone of Last Item)
        if (scrollLeft <= 0) {
            isScrollingRef.current = true;
            // Jump to the real Last Item (index: length - 2)
            // Position: (total items - 2) * itemWidth
            container.scrollTo({ left: (extendedCategories.length - 2) * itemWidth, behavior: 'auto' });
            setTimeout(() => { isScrollingRef.current = false; }, 50);
        }
        // Check if we are near the end (Clone of First Item)
        else if (scrollLeft >= totalWidth - itemWidth - 1) { // -1 for rounding errors
            isScrollingRef.current = true;
            // Jump to the real First Item (index: 1)
            container.scrollTo({ left: itemWidth, behavior: 'auto' });
            setTimeout(() => { isScrollingRef.current = false; }, 50);
        }
    };

    // Mobile App View: Swipeable Carousel with Circular (Infinite) Scroll
    if (isNative) {
        if (categories.length === 0) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in pb-4 text-ink-400">
                    <p>暂无典籍数据</p>
                </div>
            );
        }

        return (
            <div className="w-full h-full flex flex-col overflow-hidden animate-fade-in pb-4">
                {/* Compact Header for Carousel */}
                <div className="text-center mb-8 mt-0 flex-shrink-0">
                    <h2 className="text-xl text-ink-600 font-serif mb-4">
                        请选择典籍
                    </h2>
                    <div className="text-ink-400 text-xs opacity-60">← 左右滑动以查看 →</div>
                </div>

                {/* Carousel Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 flex overflow-x-auto snap-x snap-mandatory w-full no-scrollbar px-0 items-center"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {extendedCategories.map((category) => (
                        <div key={category.id} className="w-full flex-shrink-0 snap-center flex justify-center px-8 h-full items-center">
                            <div className="w-full max-w-sm flex items-center justify-center">
                                {/* Pass the original category object (handle clones mapping back to original if needed by logic, but ID is unique string usually ok if just passed through) */}
                                {/* Need to make sure onClick passes the correct original category.
                                    The clones have modified IDs, so we might need to find the original if ID is critical for selection.
                                    However, onSelectCategory likely uses the whole object.
                                    Let's pass the 'original' corresponding category data using the lookup or sanitizing the clone.
                                */}
                                <CategoryCard
                                    category={{
                                        ...category,
                                        // Restore original ID if it was cloned, for correct selection logic
                                        id: category.id.replace('_clone_start', '').replace('_clone_end', '')
                                    }}
                                    onClick={(cat) => {
                                        // Ensure we pass the clean category back
                                        onSelectCategory(categories.find(c => c.id === cat.id) || cat);
                                    }}
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
