import React, { useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import CharacterSelect from '@/components/CharacterSelect';
import CombatUI from '@/components/CombatUI';
import MapUI from '@/components/MapUI';
import MainMenu from '@/components/MainMenu';

export default function Game() {
  const { gameState, isLoading, error, resetGame } = useGame();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={resetGame}>Return to Menu</Button>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return <MainMenu />;
  }

  if (gameState.currentCombat) {
    return <CombatUI />;
  }

  return <MapUI />;
}
