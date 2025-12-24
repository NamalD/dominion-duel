import React, { useState, useEffect } from 'react';
import type { GameState } from '../engine/types';
import { initializeGame, playCard, buyCard, endTurn, endPhase, playAllTreasures } from '../engine/game';
import { Supply } from './Supply';
import { Hand } from './Hand';
import { Card } from './Card';
import '../styles/game.css';

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
        <div className="game-screen">
            <header className="game-header">
                <div>Phase: {gameState.turnPhase}</div>
                <div>Turn: {currentPlayer.name}</div>
                <div className="stats">
                    <span>Actions: {gameState.actions}</span>
                    <span>Buys: {gameState.buys}</span>
                    <span>Coins: {gameState.coins}</span>
                </div>
                <div className="header-buttons">
                    {gameState.turnPhase === 'ACTION' ? (
                        <button onClick={handleEndPhase} className="phase-btn">Go to Buy Phase</button>
                    ) : (
                        <>
                            {hasTreasures && (
                                <button onClick={handlePlayAllTreasures} className="treasures-btn">Play All Treasures</button>
                            )}
                            <button onClick={handleEndTurn} className="end-turn-btn">End Turn</button>
                        </>
                    )}
                </div>
            </header>

            <div className="main-area">
                <Supply
                    supply={gameState.supply}
                    onBuyCard={handleBuyCard}
                    canBuy={canBuy}
                />

                <div className="play-area">
                    <h3>Played Cards</h3>
                    <div className="played-cards-list">
                        {currentPlayer.playArea.map((card, i) => (
                            <div key={i} className="played-card">
                                <Card card={card} disabled />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Hand
                player={currentPlayer}
                onPlayCard={handlePlayCard}
                canPlay={canPlay}
            />
        </div>
    );
};
