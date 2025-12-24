import type { GameState, Player, Card } from './types';
import { KINGDOM_CARDS, Copper, Silver, Gold, Estate, Duchy, Province, Curse } from './cards';

const STARTING_HAND_SIZE = 5;

// Utils
export const shuffle = (cards: Card[]): Card[] => {
    return [...cards].sort(() => Math.random() - 0.5);
};

export const drawCards = (player: Player, count: number): Player => {
    const newPlayer = { ...player, deck: [...player.deck], hand: [...player.hand], discard: [...player.discard] };

    for (let i = 0; i < count; i++) {
        if (newPlayer.deck.length === 0) {
            if (newPlayer.discard.length === 0) break;
            newPlayer.deck = shuffle(newPlayer.discard);
            newPlayer.discard = [];
        }
        const card = newPlayer.deck.pop();
        if (card) {
            newPlayer.hand.push(card);
        }
    }
    return newPlayer;
};

export const createPlayer = (id: string, name: string): Player => {
    const deck: Card[] = [];
    for (let i = 0; i < 7; i++) deck.push(Copper);
    for (let i = 0; i < 3; i++) deck.push(Estate);

    const shuffledDeck = shuffle(deck);
    const hand: Card[] = [];
    const playerWithDeck = { id, name, deck: shuffledDeck, hand, discard: [], playArea: [] };

    return drawCards(playerWithDeck, STARTING_HAND_SIZE);
};

const checkAutoSkip = (state: GameState): GameState => {
    const player = state.players[state.currentPlayer];
    if (state.turnPhase === 'ACTION') {
        const hasActionCards = player.hand.some(card => card.types.includes('ACTION'));
        if (!hasActionCards || state.actions === 0) {
            state.turnPhase = 'BUY';
        }
    }
    return state;
};

export const initializeGame = (playerNames: string[]): GameState => {
    const players: Record<string, Player> = {};
    const turnOrder: string[] = [];

    playerNames.forEach((name, index) => {
        const id = `player-${index}`;
        players[id] = createPlayer(id, name);
        turnOrder.push(id);
    });

    // Initialize Supply
    const supply: Record<string, Card[]> = {};

    // Helper to fill supply
    const addToSupply = (card: Card, count: number) => {
        supply[card.id] = Array(count).fill(null).map(() => card);
    };

    addToSupply(Copper, 60);
    addToSupply(Silver, 40);
    addToSupply(Gold, 30);
    addToSupply(Estate, 8); // 2 player
    addToSupply(Duchy, 8);
    addToSupply(Province, 8);
    addToSupply(Curse, 10);

    // Kingdom cards
    KINGDOM_CARDS.forEach(card => {
        addToSupply(card, 10);
    });
    return checkAutoSkip({
        supply,
        players,
        turnOrder,
        currentPlayer: turnOrder[0],
        turnPhase: 'ACTION',
        actions: 1,
        buys: 1,
        coins: 0,
        trash: []
    });
};

// Card Effects
const applyCardEffect = (state: GameState, card: Card) => {
    const player = state.players[state.currentPlayer];

    if (card.id === 'village') {
        state.actions += 2;
        state.players[state.currentPlayer] = drawCards(player, 1);
    } else if (card.id === 'smithy') {
        state.players[state.currentPlayer] = drawCards(player, 3);
    } else if (card.id === 'market') {
        state.actions += 1;
        state.buys += 1;
        state.coins += 1;
        state.players[state.currentPlayer] = drawCards(player, 1);
    }
};

export const playCard = (state: GameState, cardIndex: number): GameState => {
    // strict copy for immutability recommended for react but for now direct mutation of clone
    const newState = JSON.parse(JSON.stringify(state)); // Deep copy simple way
    const player = newState.players[newState.currentPlayer];
    const card = player.hand[cardIndex];

    if (!card) return state;

    if (newState.turnPhase === 'ACTION') {
        if (!card.types.includes('ACTION')) return state;
        if (newState.actions < 1) return state;

        newState.actions -= 1;
        player.hand.splice(cardIndex, 1);
        player.playArea.push(card);

        applyCardEffect(newState, card);
        return checkAutoSkip(newState);
    } else if (newState.turnPhase === 'BUY') {
        // Playing treasures
        if (!card.types.includes('TREASURE')) return state;
        player.hand.splice(cardIndex, 1);
        player.playArea.push(card);
        newState.coins += (card.value || 0);
    }

    return newState;
};

export const playAllTreasures = (state: GameState): GameState => {
    let newState = JSON.parse(JSON.stringify(state));
    const player = newState.players[newState.currentPlayer];

    if (newState.turnPhase !== 'BUY') return state;

    // We iterate backwards to splice safely, or just filter and map
    const treasures = player.hand.filter((card: Card) => card.types.includes('TREASURE'));
    const nonTreasures = player.hand.filter((card: Card) => !card.types.includes('TREASURE'));

    treasures.forEach((card: Card) => {
        newState.coins += (card.value || 0);
        player.playArea.push(card);
    });

    player.hand = nonTreasures;

    return newState;
};

export const buyCard = (state: GameState, cardId: string): GameState => {
    const newState = JSON.parse(JSON.stringify(state));
    const player = newState.players[newState.currentPlayer];
    const supplyPile = newState.supply[cardId];

    if (newState.turnPhase !== 'BUY') return state;
    if (newState.buys < 1) return state;
    if (!supplyPile || supplyPile.length === 0) return state;

    const card = supplyPile[0];
    if (newState.coins < card.cost) return state;

    newState.coins -= card.cost;
    newState.buys -= 1;

    const boughtCard = supplyPile.pop();
    if (boughtCard) {
        player.discard.push(boughtCard);
    }

    if (newState.buys === 0) {
        return endTurn(newState);
    }

    return newState;
};

export const endPhase = (state: GameState): GameState => {
    const newState = JSON.parse(JSON.stringify(state));

    if (newState.turnPhase === 'ACTION') {
        newState.turnPhase = 'BUY';
    } else if (newState.turnPhase === 'BUY') {
        return endTurn(newState);
    }

    return newState;
};

export const endTurn = (state: GameState): GameState => {
    const newState = JSON.parse(JSON.stringify(state));
    const player = newState.players[newState.currentPlayer];

    // Cleanup
    // Move hand and playArea to discard
    player.discard.push(...player.hand);
    player.discard.push(...player.playArea);
    player.hand = [];
    player.playArea = [];

    // Draw 5
    newState.players[newState.currentPlayer] = drawCards(player, 5);

    // Next player
    const currentIdx = newState.turnOrder.indexOf(newState.currentPlayer);
    const nextIdx = (currentIdx + 1) % newState.turnOrder.length;
    newState.currentPlayer = newState.turnOrder[nextIdx];

    // Reset turn state
    newState.turnPhase = 'ACTION';
    newState.actions = 1;
    newState.buys = 1;
    newState.coins = 0;

    return checkAutoSkip(newState);
};
