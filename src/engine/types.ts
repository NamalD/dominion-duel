export type CardType = 'ACTION' | 'TREASURE' | 'VICTORY' | 'REACTION' | 'ATTACK' | 'CURSE';


export interface Card {
    id: string;
    name: string;
    types: CardType[];
    cost: number;
    description: string;
    value?: number; // For Treasure
    points?: number; // For Victory
}

export interface Player {
    id: string;
    name: string;
    deck: Card[];
    hand: Card[];
    discard: Card[];
    playArea: Card[];
}

export interface GameState {
    supply: Record<string, Card[]>;
    players: Record<string, Player>;
    turnOrder: string[];
    currentPlayer: string;
    turnPhase: 'ACTION' | 'BUY' | 'CLEANUP';
    actions: number;
    buys: number;
    coins: number;
    trash: Card[];
}
