import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CombatUI() {
  const { gameState, playCardInCombat, endTurn } = useGame();
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  if (!gameState?.currentCombat) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">No active combat</div>;
  }

  const { currentCombat } = gameState;
  const { player, enemies, currentEnergy, turn } = currentCombat;

  const handleCardClick = (index: number) => {
    const card = player.hand[index];
    if (card.type === 'attack') {
      setSelectedCardIndex(index);
    } else {
      playCardInCombat(index);
      setSelectedCardIndex(null);
    }
  };

  const handleEnemyClick = (enemyId: string) => {
    if (selectedCardIndex !== null) {
      playCardInCombat(selectedCardIndex, enemyId);
      setSelectedCardIndex(null);
      setSelectedTargetId(null);
    }
  };

  const handleEndTurn = () => {
    setSelectedCardIndex(null);
    setSelectedTargetId(null);
    endTurn();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-amber-100">Combat</h1>
            <p className="text-slate-400">Turn {turn}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-2">
              Energy: <span className={`${currentEnergy > 0 ? 'text-blue-400' : 'text-slate-500'}`}>{currentEnergy}/3</span>
            </div>
          </div>
        </div>

        {/* Enemies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {enemies.map(enemy => (
            <Card
              key={enemy.id}
              onClick={() => handleEnemyClick(enemy.id)}
              className={`bg-gradient-to-br from-slate-800 to-slate-900 border-red-600/30 cursor-pointer transition-all duration-300 ${
                selectedCardIndex !== null ? 'hover:border-red-400/60 hover:shadow-lg hover:shadow-red-900/50' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl text-red-100">{enemy.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Enemy HP */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">HP</span>
                    <span className="font-bold text-red-400">{Math.max(0, enemy.currentHp)}/{enemy.maxHp}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded h-6 border border-slate-600 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-500 h-6 transition-all duration-300"
                      style={{ width: `${Math.max(0, (enemy.currentHp / enemy.maxHp) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Intent */}
                <div className="bg-slate-700/50 p-3 rounded border border-slate-600/50 mb-4">
                  <p className="text-sm text-slate-300 mb-1">Next Action:</p>
                  <p className="text-white font-bold text-lg">{enemy.intents[enemy.currentIntentIndex]?.description}</p>
                </div>

                {/* Powers */}
                {enemy.powers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-slate-300">Status Effects:</p>
                    {enemy.powers.map((power, idx) => (
                      <div key={idx} className="bg-amber-900/30 p-2 rounded border border-amber-700/50">
                        <p className="text-amber-300 text-sm font-semibold">{power.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Player Info */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-green-600/30 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-green-100">Player</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-slate-300 text-sm mb-2">HP</p>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-green-400">{player.currentHp}/{player.maxHp}</span>
                </div>
                <div className="w-full bg-slate-700 rounded h-8 border border-slate-600 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-600 to-green-500 h-8 transition-all duration-300"
                    style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-slate-300 text-sm mb-2">Gold</p>
                <p className="font-bold text-yellow-400 text-2xl">{player.gold}</p>
              </div>
            </div>

            {/* Player Powers */}
            {player.powers.length > 0 && (
              <div>
                <p className="text-slate-300 text-sm mb-3">Status Effects:</p>
                <div className="space-y-2">
                  {player.powers.map((power, idx) => (
                    <div key={idx} className="bg-blue-900/30 p-2 rounded border border-blue-700/50">
                      <p className="text-blue-300 text-sm font-semibold">{power.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hand */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-amber-100 mb-4">Hand ({player.hand.length} cards)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {player.hand.map((card, idx) => {
              const isSelected = selectedCardIndex === idx;
              const canPlay = currentEnergy >= card.cost;
              const cardTypeColor = {
                attack: 'border-red-600/60 bg-red-900/20',
                skill: 'border-blue-600/60 bg-blue-900/20',
                power: 'border-purple-600/60 bg-purple-900/20',
                status: 'border-gray-600/60 bg-gray-900/20',
                curse: 'border-black/60 bg-black/20',
              }[card.type];

              return (
                <Card
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isSelected ? 'ring-4 ring-amber-400 scale-110' : ''
                  } ${
                    canPlay ? 'hover:shadow-lg hover:shadow-amber-900/50' : 'opacity-50 cursor-not-allowed'
                  } ${cardTypeColor} border-2 bg-gradient-to-br from-slate-800 to-slate-900`}
                >
                  <CardContent className="p-3">
                    <p className="text-white font-bold text-sm mb-2 line-clamp-2">{card.name}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-bold text-lg ${currentEnergy >= card.cost ? 'text-blue-400' : 'text-slate-500'}`}>
                        {card.cost}
                      </span>
                      <span className="text-xs text-slate-400">{card.type}</span>
                    </div>
                    <p className="text-slate-300 text-xs line-clamp-3">{card.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleEndTurn}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3 px-8 text-lg transition-all duration-300"
          >
            End Turn
          </Button>
          {selectedCardIndex !== null && (
            <Button
              onClick={() => setSelectedCardIndex(null)}
              className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-8 text-lg"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
