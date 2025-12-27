import React, { useEffect, useState } from 'react';
import { IGameCategory } from '../types';
import CategoryCard from './CategoryCard';
import { Capacitor } from '@capacitor/core';

interface HomeViewProps {
    categories: IGameCategory[];
    onSelectCategory: (category: IGameCategory) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ categories, onSelectCategory }) => {
    const [isNative, setIsNative] = useState(false);

    useEffect(() => {
        setIsNative(Capacitor.isNativePlatform());
    }, []);

    // Mobile App View: Swipeable Carousel
    if (isNative) {
        return (
            <div className="w-full h-[calc(100vh-160px)] animate-fade-in flex flex-col justify-center">
                <div className="text-center mb-8">
                    <h2 className="text-2xl text-ink-600 font-serif mb-2">
                        请选择典籍
                    </h2>
                    <div className="text-ink-400 text-sm opacity-60">← 左右滑动以查看 →</div>
                </div>

                {/* Carousel Container */}
                <div className="flex overflow-x-auto snap-x snap-mandatory w-full no-scrollbar pb-8 px-8 gap-6 items-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {categories.map(category => (
                        <div key={category.id} className="w-full flex-shrink-0 snap-center flex justify-center">
                            <div className="w-full max-w-sm">
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
