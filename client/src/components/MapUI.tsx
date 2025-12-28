import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MapUI() {
  const { gameState, startCombat, resetGame } = useGame();

  if (!gameState) {
    return <div>No game state</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Act {gameState.currentAct}</h1>
            <p className="text-slate-400">Map Navigation</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">HP: <span className="text-green-400">{gameState.player.currentHp}/{gameState.player.maxHp}</span></p>
            <p className="text-xl text-yellow-400">Gold: {gameState.player.gold}</p>
          </div>
        </div>

        {/* Player Info */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Deck & Relics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-300 text-sm mb-2">Deck Size</p>
                <p className="text-white font-bold text-2xl">{gameState.player.deck.length} cards</p>
              </div>
              <div>
                <p className="text-slate-300 text-sm mb-2">Relics</p>
                <p className="text-white font-bold text-2xl">{gameState.player.relics.length}</p>
              </div>
            </div>

            {/* Relics List */}
            {gameState.player.relics.length > 0 && (
              <div className="mt-4">
                <p className="text-slate-300 text-sm mb-2">Active Relics:</p>
                <div className="space-y-1">
                  {gameState.player.relics.map((relic, idx) => (
                    <p key={idx} className="text-amber-300 text-sm">{relic.name}</p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Map</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 mb-4">Map generation coming soon...</p>
            <p className="text-slate-300 text-sm">For now, you can start a test combat:</p>
          </CardContent>
        </Card>

        {/* Test Combat Button */}
        <div className="flex gap-4">
          <Button
            onClick={() => startCombat(['cultist'])}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6"
          >
            Start Test Combat (Cultist)
          </Button>
          <Button
            onClick={() => startCombat(['jaw_worm'])}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6"
          >
            Start Test Combat (Jaw Worm)
          </Button>
          <Button
            onClick={resetGame}
            className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6"
          >
            Return to Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
