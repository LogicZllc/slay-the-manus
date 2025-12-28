import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CombatUI() {
  const { gameState, playCardInCombat, endTurn } = useGame();

  if (!gameState?.currentCombat) {
    return <div>No active combat</div>;
  }

  const { currentCombat } = gameState;
  const { player, enemies, currentEnergy } = currentCombat;

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Combat</h1>
            <p className="text-slate-400">Turn {currentCombat.turn}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">Energy: <span className="text-blue-400">{currentEnergy}</span></p>
          </div>
        </div>

        {/* Enemies */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {enemies.map(enemy => (
            <Card key={enemy.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{enemy.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">HP</span>
                    <span className="font-bold text-red-400">{enemy.currentHp}/{enemy.maxHp}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded h-4">
                    <div
                      className="bg-red-500 h-4 rounded transition-all"
                      style={{ width: `${(enemy.currentHp / enemy.maxHp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Intent */}
                <div className="bg-slate-700 p-3 rounded">
                  <p className="text-sm text-slate-300">Next Action:</p>
                  <p className="text-white font-bold">{enemy.intents[enemy.currentIntentIndex]?.description}</p>
                </div>

                {/* Powers */}
                {enemy.powers.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {enemy.powers.map((power, idx) => (
                      <p key={idx} className="text-sm text-amber-300">{power.description}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Player Info */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Player</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-300 text-sm mb-2">HP</p>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-green-400">{player.currentHp}/{player.maxHp}</span>
                </div>
                <div className="w-full bg-slate-700 rounded h-6">
                  <div
                    className="bg-green-500 h-6 rounded transition-all"
                    style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-slate-300 text-sm mb-2">Gold</p>
                <p className="font-bold text-yellow-400 text-lg">{player.gold}</p>
              </div>
            </div>

            {/* Player Powers */}
            {player.powers.length > 0 && (
              <div className="mt-4 space-y-1">
                <p className="text-slate-300 text-sm mb-2">Status Effects:</p>
                {player.powers.map((power, idx) => (
                  <p key={idx} className="text-sm text-amber-300">{power.description}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hand */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Hand ({player.hand.length} cards)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {player.hand.map((card, idx) => (
              <Card
                key={idx}
                className="bg-slate-700 border-slate-600 hover:border-slate-500 cursor-pointer transition-colors"
                onClick={() => playCardInCombat(idx, enemies[0]?.id)}
              >
                <CardContent className="p-3">
                  <p className="text-white font-bold text-sm mb-2">{card.name}</p>
                  <p className="text-blue-400 font-bold text-lg">{card.cost}</p>
                  <p className="text-slate-300 text-xs mt-2">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={endTurn}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6"
          >
            End Turn
          </Button>
        </div>
      </div>
    </div>
  );
}
