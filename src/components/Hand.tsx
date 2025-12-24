import React from 'react';
import type { Player, Card as CardType } from '../engine/types';
import { Card } from './Card';
import '../styles/hand.css';

interface HandProps {
    player: Player;
    onPlayCard: (index: number) => void;
    canPlay: (card: CardType) => boolean;
}

export const Hand: React.FC<HandProps> = ({ player, onPlayCard, canPlay }) => {
    return (
        <div className="hand-container">
            <h3>Your Hand</h3>
            <div className="hand-cards">
                {player.hand.map((card, index) => (
                    <div key={`${card.id}-${index}`} className="hand-card-wrapper">
                        <Card
                            card={card}
                            onClick={() => onPlayCard(index)}
                            disabled={!canPlay(card)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
