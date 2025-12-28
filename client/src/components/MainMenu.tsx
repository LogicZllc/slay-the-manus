import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CHARACTERS } from '@/lib/constants';

export default function MainMenu() {
  const { startNewRun } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-white mb-2">Slay the Manus</h1>
        <p className="text-xl text-slate-300">A Roguelike Deckbuilding Adventure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {Object.values(CHARACTERS).map(character => (
          <Card key={character.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
            <CardHeader>
              <CardTitle className="text-white">{character.name}</CardTitle>
              <CardDescription className="text-slate-400">{character.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-slate-300 mb-2">Max HP: <span className="font-bold text-red-400">{character.maxHp}</span></p>
                <p className="text-sm text-slate-300">Starting Relic: <span className="font-bold text-amber-400">{character.starterRelic.name}</span></p>
              </div>
              <Button
                onClick={() => startNewRun(character.id)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Play as {character.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center text-slate-400 text-sm max-w-2xl">
        <p>Choose your character and embark on a journey through the Spire. Build your deck, collect relics, and defeat the boss!</p>
      </div>
    </div>
  );
}
