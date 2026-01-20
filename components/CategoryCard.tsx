import React from 'react';
import { IGameCategory } from '../types';

interface CategoryCardProps {
    category: IGameCategory;
    onClick: (category: IGameCategory) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
    return (
        <div
            onClick={() => onClick(category)}
            className="group relative cursor-pointer w-full aspect-[3/4] overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
        >
            {/* Background Image */}
            <img
                src={category.coverImage}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300"></div>

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
                <h3 className="text-3xl font-calligraphy text-paper-100 mb-2 drop-shadow-md group-hover:text-accent-gold transition-colors">
                    {category.title}
                </h3>
                <div className="w-12 h-1 bg-accent-red mb-4 group-hover:w-24 transition-all duration-300"></div>
                <p className="text-paper-200 text-sm font-serif opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    点击进入
                </p>
            </div>

            {/* Border effect */}
            <div className="absolute inset-4 border border-white/20 rounded opacity-50 group-hover:inset-3 group-hover:opacity-100 transition-all duration-500"></div>
        </div>
    );
};

export default CategoryCard;
