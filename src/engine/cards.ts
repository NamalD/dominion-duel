import type { Card } from './types';

export const Copper: Card = {
    id: 'copper',
    name: 'Copper',
    types: ['TREASURE'],
    cost: 0,
    value: 1,
    description: '+1 Coin'
};

export const Silver: Card = {
    id: 'silver',
    name: 'Silver',
    types: ['TREASURE'],
    cost: 3,
    value: 2,
    description: '+2 Coins'
};

export const Gold: Card = {
    id: 'gold',
    name: 'Gold',
    types: ['TREASURE'],
    cost: 6,
    value: 3,
    description: '+3 Coins'
};

export const Estate: Card = {
    id: 'estate',
    name: 'Estate',
    types: ['VICTORY'],
    cost: 2,
    points: 1,
    description: '1 Victory Point'
};

export const Duchy: Card = {
    id: 'duchy',
    name: 'Duchy',
    types: ['VICTORY'],
    cost: 5,
    points: 3,
    description: '3 Victory Points'
};

export const Province: Card = {
    id: 'province',
    name: 'Province',
    types: ['VICTORY'],
    cost: 8,
    points: 6,
    description: '6 Victory Points'
};

export const Curse: Card = {
    id: 'curse',
    name: 'Curse',
    types: ['CURSE'],
    cost: 0,
    points: -1,
    description: '-1 Victory Point'
};

// Actions
export const Village: Card = {
    id: 'village',
    name: 'Village',
    types: ['ACTION'],
    cost: 3,
    description: '+1 Card, +2 Actions'
};

export const Smithy: Card = {
    id: 'smithy',
    name: 'Smithy',
    types: ['ACTION'],
    cost: 4,
    description: '+3 Cards'
};

export const Market: Card = {
    id: 'market',
    name: 'Market',
    types: ['ACTION'],
    cost: 5,
    description: '+1 Card, +1 Action, +1 Buy, +1 Coin'
};

export const BASE_CARDS = [Copper, Silver, Gold, Estate, Duchy, Province, Curse];
export const KINGDOM_CARDS = [Village, Smithy, Market]; 
