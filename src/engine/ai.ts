import type { GameState } from './types';
import { playCard, buyCard, endPhase, endTurn, playAllTreasures } from './game';

const ACTION_PRIORITY = ['market', 'village', 'smithy'];
const BUY_PRIORITY = ['province', 'gold', 'duchy', 'market', 'smithy', 'silver', 'village', 'estate', 'copper'];

export const getNextAIMove = (state: GameState): GameState | null => {
    const player = state.players[state.currentPlayer];

    if (state.turnPhase === 'ACTION') {
        const actionCards = player.hand.filter(c => c.types.includes('ACTION'));
        if (actionCards.length > 0 && state.actions > 0) {
            // Find best action based on priority
            for (const cardId of ACTION_PRIORITY) {
                const index = player.hand.findIndex(c => c.id === cardId);
                if (index !== -1) {
                    return playCard(state, index);
                }
            }
            // If none of priority actions, play first available
            const firstActionIndex = player.hand.findIndex(c => c.types.includes('ACTION'));
            return playCard(state, firstActionIndex);
        } else {
            return endPhase(state);
        }
    }

    if (state.turnPhase === 'BUY') {
        // Play all treasures first if any
        const hasTreasures = player.hand.some(c => c.types.includes('TREASURE'));
        if (hasTreasures) {
            return playAllTreasures(state);
        }

        // Try to buy based on priority
        if (state.buys > 0) {
            for (const cardId of BUY_PRIORITY) {
                const supplyPile = state.supply[cardId];
                if (supplyPile && supplyPile.length > 0) {
                    const card = supplyPile[0];
                    if (state.coins >= card.cost) {
                        return buyCard(state, cardId);
                    }
                }
            }
        }

        return endTurn(state);
    }

    return null;
};
