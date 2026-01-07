import React from 'react';

interface FeedbackTasselProps {
    onClick: () => void;
    className?: string;
}

const FeedbackTassel: React.FC<FeedbackTasselProps> = ({ onClick, className = '' }) => {
    return (
        <div
            className={`absolute top-3 right-1 z-[60] cursor-pointer hover:brightness-110 transition-all origin-top hover:rotate-1 ${className} group`}
            onClick={onClick}
            title="意见反馈"
        >
            {/* Hanging Rope */}
            <div className="w-[2px] h-5 bg-accent-red mx-auto" />

            <svg
                width="34"
                height="102"
                viewBox="0 0 60 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-md -mt-0.5"
            >
                {/* Chinese Knot (Simplified Mystic Knot Style) */}
                <path
                    d="M30 10 
             C 45 0, 55 10, 50 20
             C 55 30, 45 40, 30 30
             C 15 40, 5 30, 10 20
             C 5 10, 15 0, 30 10 Z"
                    stroke="#8B2626"
                    strokeWidth="3"
                    fill="none"
                />
                <path
                    d="M30 10 V 30"
                    stroke="#8B2626"
                    strokeWidth="3"
                />
                <path
                    d="M10 20 H 50"
                    stroke="#8B2626"
                    strokeWidth="3"
                />

                {/* Jade Bead Connection */}
                <circle cx="30" cy="38" r="4" fill="#A5C2A8" stroke="#8B2626" strokeWidth="1" />

                {/* The 'Tag' - This is the key affordance for 'Feedback' */}
                {/* Using a rectangular Wooden/Paper tag shape */}
                <rect x="16" y="43" width="28" height="46" rx="2" fill="#F7F4E9" stroke="#8B2626" strokeWidth="2" />
                <rect x="18" y="45" width="24" height="42" rx="1" stroke="#8B2626" strokeWidth="1" strokeOpacity="0.3" fill="none" />

                {/* Vertical Text 'Feedback' */}
                <text x="30" y="61" textAnchor="middle" fontSize="15" fontFamily="Ma Shan Zheng, cursive" fill="#8B2626" className="select-none pointer-events-none">反</text>
                <text x="30" y="79" textAnchor="middle" fontSize="15" fontFamily="Ma Shan Zheng, cursive" fill="#8B2626" className="select-none pointer-events-none">馈</text>

                {/* Tassel Head */}
                <path d="M22 90 Q 30 95 38 90 L 36 100 H 24 L 22 90 Z" fill="#8B2626" />

                {/* Tassel Fringes */}
                <g stroke="#8B2626" strokeWidth="1.5">
                    <path d="M25 100 Q 20 130 22 160" />
                    <path d="M27 100 Q 25 130 26 165" />
                    <path d="M30 100 Q 30 130 30 170" />
                    <path d="M33 100 Q 35 130 34 165" />
                    <path d="M35 100 Q 40 130 38 160" />

                    {/* Inner finer strands for density */}
                    <path d="M28 100 V 155" strokeWidth="1" opacity="0.8" />
                    <path d="M32 100 V 155" strokeWidth="1" opacity="0.8" />
                </g>
            </svg>
        </div>
    );
};

export default FeedbackTassel;
