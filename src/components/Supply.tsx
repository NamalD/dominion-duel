import React from 'react';
import type { Card as CardType } from '../engine/types';
import { Card } from './Card';

interface SupplyProps {
    supply: Record<string, CardType[]>;
    onBuyCard: (cardId: string) => void;
    canBuy: (card: CardType) => boolean;
}

export const Supply: React.FC<SupplyProps> = ({ supply, onBuyCard, canBuy }) => {
    const piles = Object.entries(supply).map(([id, cards]) => {
        if (cards.length === 0) return null;
        const topCard = cards[0];
        return { id, card: topCard, count: cards.length };
    }).filter(Boolean) as { id: string, card: CardType, count: number }[];

    piles.sort((a, b) => a.card.cost - b.card.cost);

    // Grouping piles for better layout
    const basicPiles = piles.filter(p => !p.card.types.includes('ACTION'));
    const kingdomPiles = piles.filter(p => p.card.types.includes('ACTION'));

    const Section = ({ title, items, color }: { title: string, items: typeof piles, color: string }) => (
        <div className="space-y-4">
            <h4 className={`text-xs font-black uppercase tracking-[0.3em] ${color} flex items-center gap-3 after:content-[''] after:h-px after:flex-grow after:bg-current after:opacity-20`}>
                {title}
            </h4>
            <div className="flex flex-wrap gap-6">
                {items.map(pile => (
                    <div key={pile.id} className="group flex flex-col items-center gap-3">
                        <Card
                            card={pile.card}
                            onClick={() => onBuyCard(pile.id)}
                            disabled={!canBuy(pile.card)}
                        />
                        <div className="px-3 py-1 bg-background border border-secondary/20 rounded-full text-[10px] font-black text-secondary group-hover:bg-secondary group-hover:text-background transition-colors">
                            {pile.count} UNITS
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-12">
            <Section title="Kingdom Cards" items={kingdomPiles} color="text-highlight" />
            <Section title="Basic Supplies" items={basicPiles} color="text-secondary" />
        </div>
    );
};
