import React, { useState, useEffect } from 'react';
import type { GameState } from '../engine/types';
import { initializeGame, playCard, buyCard, endTurn, endPhase, playAllTreasures } from '../engine/game';
import { Supply } from './Supply';
import { Hand } from './Hand';
import { Card } from './Card';

export const Game: React.FC = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);

    useEffect(() => {
        const initialState = initializeGame(['Player 1', 'Player 2']);
        setGameState(initialState);
    }, []);

    if (!gameState) return <div>Loading...</div>;

    const currentPlayer = gameState.players[gameState.currentPlayer];

    // Handlers
    const handlePlayCard = (index: number) => {
        const newState = playCard(gameState, index);
        setGameState(newState);
    };

    const handleBuyCard = (cardId: string) => {
        const newState = buyCard(gameState, cardId);
        setGameState(newState);
    };

    const handleEndPhase = () => {
        const newState = endPhase(gameState);
        setGameState(newState);
    };

    const handleEndTurn = () => {
        const newState = endTurn(gameState);
        setGameState(newState);
    };

    const handlePlayAllTreasures = () => {
        const newState = playAllTreasures(gameState);
        setGameState(newState);
    };

    // Checks
    const canPlay = (card: any) => {
        if (gameState.turnPhase === 'ACTION') return card.types.includes('ACTION') && gameState.actions > 0;
        if (gameState.turnPhase === 'BUY') return card.types.includes('TREASURE');
        return false;
    };

    const canBuy = (card: any) => {
        if (gameState.turnPhase !== 'BUY') return false;
        if (gameState.buys < 1) return false;
        if (gameState.coins < card.cost) return false;
        return true;
    };

    const hasTreasures = currentPlayer.hand.some(card => card.types.includes('TREASURE'));

    return (
        <div className="flex flex-col min-h-screen p-4 md:p-8">
            <header className="bg-slate-900/50 p-6 rounded-xl border border-secondary/20 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col items-center md:items-start">
                    <div className="text-secondary font-bold tracking-wider uppercase text-xs mb-1">Current Turn</div>
                    <div className="text-2xl font-black text-main underline decoration-accent decoration-4 underline-offset-4">{currentPlayer.name}</div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 p-4 bg-background/50 rounded-lg border border-secondary/10">
                    <div className="flex flex-col items-center px-4 border-r border-secondary/10 last:border-0">
                        <span className="text-[10px] uppercase font-bold text-secondary/60">Phase</span>
                        <span className="text-lg font-bold text-highlight uppercase tracking-tight">{gameState.turnPhase}</span>
                    </div>
                    <div className="flex flex-col items-center px-4 border-r border-secondary/10 last:border-0">
                        <span className="text-[10px] uppercase font-bold text-secondary/60">Actions</span>
                        <span className="text-lg font-bold text-main">{gameState.actions}</span>
                    </div>
                    <div className="flex flex-col items-center px-4 border-r border-secondary/10 last:border-0">
                        <span className="text-[10px] uppercase font-bold text-secondary/60">Buys</span>
                        <span className="text-lg font-bold text-main">{gameState.buys}</span>
                    </div>
                    <div className="flex flex-col items-center px-4 last:border-0">
                        <span className="text-[10px] uppercase font-bold text-secondary/60">Coins</span>
                        <span className="text-lg font-bold text-yellow-400">💰 {gameState.coins}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {gameState.turnPhase === 'ACTION' ? (
                        <button
                            onClick={handleEndPhase}
                            className="bg-secondary hover:bg-secondary/80 text-background px-6 py-3 rounded-full font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(65,234,212,0.3)] hover:scale-105 active:scale-95"
                        >
                            End Actions
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            {hasTreasures && (
                                <button
                                    onClick={handlePlayAllTreasures}
                                    className="bg-yellow-500 hover:bg-yellow-400 text-background px-6 py-3 rounded-full font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:scale-105 active:scale-95"
                                >
                                    💰 Play All
                                </button>
                            )}
                            <button
                                onClick={handleEndTurn}
                                className="bg-accent hover:bg-accent/80 text-main px-6 py-3 rounded-full font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(255,0,34,0.3)] hover:scale-105 active:scale-95"
                            >
                                End Buy
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 mb-40">
                <div className="lg:col-span-8 space-y-8">
                    <Supply
                        supply={gameState.supply}
                        onBuyCard={handleBuyCard}
                        canBuy={canBuy}
                    />
                </div>

                <div className="lg:col-span-4 bg-slate-900/30 rounded-2xl p-6 border border-secondary/10 overflow-hidden flex flex-col">
                    <h3 className="text-highlight font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                        <span className="w-2 h-4 bg-highlight rounded-full"></span>
                        Card Play Area
                    </h3>
                    <div className="flex-grow overflow-y-auto">
                        <div className="flex flex-wrap gap-2 perspective-1000">
                            {currentPlayer.playArea.map((card, i) => (
                                <div key={i} className="hover:z-10 transition-all">
                                    <div className="origin-top-left">
                                        <Card card={card} disabled />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {currentPlayer.playArea.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-main/20 italic text-sm">
                                <p>No cards played yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-gradient-to-t from-background via-background/95 to-transparent">
                <Hand
                    player={currentPlayer}
                    onPlayCard={handlePlayCard}
                    canPlay={canPlay}
                />
            </footer>
        </div>
    );
};
