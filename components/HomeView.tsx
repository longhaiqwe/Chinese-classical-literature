import React from 'react';
import { IGameCategory } from '../types';
import CategoryCard from './CategoryCard';

interface HomeViewProps {
    categories: IGameCategory[];
    onSelectCategory: (category: IGameCategory) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ categories, onSelectCategory }) => {
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
