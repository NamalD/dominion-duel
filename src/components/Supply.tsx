import React from 'react';
import type { Card as CardType } from '../engine/types';
import { Card } from './Card';
import '../styles/supply.css';

interface SupplyProps {
    supply: Record<string, CardType[]>;
    onBuyCard: (cardId: string) => void;
    canBuy: (card: CardType) => boolean;
}

export const Supply: React.FC<SupplyProps> = ({ supply, onBuyCard, canBuy }) => {
    // Group by type or just list? 
    // Usually Treasure, Victory, Kingdom.
    // We can just iterate keys and display top card.

    const piles = Object.entries(supply).map(([id, cards]) => {
        if (cards.length === 0) return null; // Or show empty pile placeholder
        const topCard = cards[0];
        return { id, card: topCard, count: cards.length };
    }).filter(Boolean) as { id: string, card: CardType, count: number }[];

    // Sort by cost then name? Or standard preset order.
    // For now simple sort by cost.
    piles.sort((a, b) => a.card.cost - b.card.cost);

    return (
        <div className="supply-container">
            <h3>Supply</h3>
            <div className="supply-grid">
                {piles.map(pile => (
                    <div key={pile.id} className="supply-pile">
                        <Card
                            card={pile.card}
                            onClick={() => onBuyCard(pile.id)}
                            disabled={!canBuy(pile.card)}
                        />
                        <div className="pile-count">{pile.count} left</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
