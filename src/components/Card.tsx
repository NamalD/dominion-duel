import React from 'react';
import type { Card as CardType } from '../engine/types';
import '../styles/card.css';

interface CardProps {
    card: CardType;
    onClick?: () => void;
    disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onClick, disabled }) => {
    const getTypeClass = () => {
        if (card.types.includes('VICTORY') || card.types.includes('CURSE')) return 'type-victory';
        if (card.types.includes('TREASURE')) return 'type-treasure';
        if (card.types.includes('ACTION')) return 'type-action';
        return '';
    };

    return (
        <div
            className={`card ${getTypeClass()} ${disabled ? 'disabled' : ''}`}
            onClick={!disabled ? onClick : undefined}
        >
            <div className="card-header">
                <span className="card-title">{card.name}</span>
                <span className="card-cost">${card.cost}</span>
            </div>
            <div className="card-body">
                <div className="card-type">{card.types.join(' - ')}</div>
                <div className="card-description">{card.description}</div>
            </div>
        </div>
    );
};
