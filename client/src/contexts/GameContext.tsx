import React, { createContext, useContext, useState, useCallback } from 'react';
import { GameState, Combat, Card } from '@/types/game';
import {
  initializeGameState,
  initializeCombat,
  startPlayerTurn,
  endPlayerTurn,
  startEnemyTurn,
  playCard,
  isCombatOver,
  getCombatWinner,
} from '@/lib/gameState';
import { ENEMIES } from '@/lib/constants';
import { generateMap } from '@/lib/mapGeneration';

interface GameContextType {
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  startNewRun: (characterId: string) => void;
  startCombat: (enemyIds: string[]) => void;
  playCardInCombat: (cardIndex: number, targetEnemyId?: string) => void;
  endTurn: () => void;
  usePotion: (potionIndex: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNewRun = useCallback((characterId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      let newGameState = initializeGameState(characterId);
      const seed = Math.random();
      newGameState.currentMap = generateMap(1, seed);
      setGameState(newGameState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start new run');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startCombat = useCallback((enemyIds: string[]) => {
    if (!gameState) return;

    try {
      const enemies = enemyIds.map(id => {
        const enemy = ENEMIES[id];
        if (!enemy) throw new Error(`Enemy ${id} not found`);
        return { ...enemy };
      });

      const combat = initializeCombat(gameState.player, enemies);
      const updatedGameState = { ...gameState, currentCombat: combat };
      setGameState(updatedGameState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start combat');
    }
  }, [gameState]);

  const playCardInCombat = useCallback((cardIndex: number, targetEnemyId?: string) => {
    if (!gameState?.currentCombat) return;

    try {
      const updatedCombat = playCard(gameState.currentCombat, cardIndex, targetEnemyId);
      const updatedGameState = { ...gameState, currentCombat: updatedCombat };
      setGameState(updatedGameState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to play card');
    }
  }, [gameState]);

  const endTurn = useCallback(() => {
    if (!gameState?.currentCombat) return;

    try {
      let updatedCombat = endPlayerTurn(gameState.currentCombat);

      // Check if combat is over
      if (isCombatOver(updatedCombat)) {
        const winner = getCombatWinner(updatedCombat);
        // Handle combat end
        const updatedGameState = { ...gameState, currentCombat: undefined };
        setGameState(updatedGameState);
        return;
      }

      // Start enemy turn
      updatedCombat = startEnemyTurn(updatedCombat);

      // Check if combat is over after enemy turn
      if (isCombatOver(updatedCombat)) {
        const winner = getCombatWinner(updatedCombat);
        // Handle combat end
        const updatedGameState = { ...gameState, currentCombat: undefined };
        setGameState(updatedGameState);
        return;
      }

      // Start next player turn
      updatedCombat = startPlayerTurn(updatedCombat);
      const updatedGameState = { ...gameState, currentCombat: updatedCombat };
      setGameState(updatedGameState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end turn');
    }
  }, [gameState]);

  const usePotion = useCallback((potionIndex: number) => {
    if (!gameState?.currentCombat) return;

    try {
      const potion = gameState.currentCombat.player.potions[potionIndex];
      if (!potion) return;

      // Apply potion effects
      const updatedCombat = { ...gameState.currentCombat };
      updatedCombat.player.potions.splice(potionIndex, 1);

      // Potion effects would be applied here based on type
      const updatedGameState = { ...gameState, currentCombat: updatedCombat };
      setGameState(updatedGameState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to use potion');
    }
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(null);
    setError(null);
  }, []);

  const value: GameContextType = {
    gameState,
    isLoading,
    error,
    startNewRun,
    startCombat,
    playCardInCombat,
    endTurn,
    usePotion,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
