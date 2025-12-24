import React from 'react';
import type { Player, Card as CardType } from '../engine/types';
import { Card } from './Card';

interface HandProps {
    player: Player;
    onPlayCard: (index: number) => void;
    canPlay: (card: CardType) => boolean;
}

export const Hand: React.FC<HandProps> = ({ player, onPlayCard, canPlay }) => {
    return (
        <div className="w-full flex flex-col gap-4">
            <h3 className="text-secondary font-black tracking-widest uppercase text-xs flex items-center gap-2 after:content-[''] after:h-px after:flex-grow after:bg-secondary/20">
                Your Arsenal ({player.hand.length} cards)
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-6 scroll-smooth scrollbar-hide">
                {player.hand.map((card, index) => (
                    <div
                        key={`${card.id}-${index}`}
                        className="flex-shrink-0"
                    >
                        <Card
                            card={card}
                            onClick={() => onPlayCard(index)}
                            disabled={!canPlay(card)}
                        />
                    </div>
                ))}
                {player.hand.length === 0 && (
                    <div className="w-full text-center py-10 text-main/30 border-2 border-dashed border-main/10 rounded-2xl italic">
                        No cards in hand
                    </div>
                )}
            </div>
        </div>
    );
};
