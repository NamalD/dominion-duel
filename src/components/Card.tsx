import React from 'react';
import type { Card as CardType } from '../engine/types';

interface CardProps {
    card: CardType;
    onClick?: () => void;
    disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onClick, disabled }) => {
    const getTypeStyles = () => {
        if (card.types.includes('VICTORY')) return 'border-emerald-500 bg-emerald-950/30 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.1)]';
        if (card.types.includes('CURSE')) return 'border-purple-500 bg-purple-950/30 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.1)]';
        if (card.types.includes('TREASURE')) return 'border-yellow-500 bg-yellow-950/30 text-yellow-100 shadow-[0_0_20px_rgba(234,179,8,0.1)]';
        if (card.types.includes('ACTION')) return 'border-secondary bg-secondary/10 text-secondary shadow-[0_0_20px_rgba(65,234,212,0.1)]';
        return 'border-main/20 bg-main/5 text-main shadow-lg';
    };

    return (
        <div
            className={`
                relative w-32 h-48 rounded-lg border-2 p-2 flex flex-col transition-all duration-300
                ${getTypeStyles()}
                ${disabled ? 'opacity-50 grayscale cursor-not-allowed scale-95' : 'cursor-pointer hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:z-20'}
            `}
            onClick={!disabled ? onClick : undefined}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="font-black text-xs leading-tight uppercase tracking-tighter max-w-[75%]">{card.name}</span>
                <span className="bg-background text-yellow-400 w-6 h-6 rounded-full flex items-center justify-center font-black border border-yellow-500/50 shadow-inner text-[10px]">
                    {card.cost}
                </span>
            </div>

            <div className="flex-grow flex flex-col justify-center text-center p-1 rounded-md bg-background/30 backdrop-blur-sm border border-white/5 mb-2">
                <div className="text-[7px] font-bold uppercase tracking-[0.1em] opacity-60 mb-1">
                    {card.types.join(' • ')}
                </div>
                <div className="text-[10px] font-medium italic leading-tight text-main/90 line-clamp-4 overflow-hidden">
                    {card.description}
                </div>
            </div>

            <div className="mt-auto h-0.5 w-full rounded-full opacity-30 bg-current"></div>
        </div>
    );
};
