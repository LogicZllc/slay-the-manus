import React, { useEffect, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CHARACTERS } from '@/lib/constants';

export default function MainMenu() {
  const { startNewRun } = useGame();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartGame = (characterId: string) => {
    setIsLoading(true);
    startNewRun(characterId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Title Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 mb-4 drop-shadow-lg">
            Slay the Manus
          </h1>
          <p className="text-2xl text-amber-100/80 font-light tracking-widest">A Roguelike Deckbuilding Adventure</p>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Character Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">
          {Object.values(CHARACTERS).map((character, idx) => (
            <Card
              key={character.id}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-600/30 hover:border-amber-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/50 transform hover:scale-105 cursor-pointer group"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl text-amber-100 group-hover:text-amber-50 transition-colors">
                  {character.name}
                </CardTitle>
                <CardDescription className="text-slate-400 group-hover:text-slate-300 transition-colors">
                  {character.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Character Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700/50">
                    <span className="text-slate-300 text-sm font-medium">Max HP</span>
                    <span className="font-bold text-red-400 text-lg">{character.maxHp}</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700/50">
                    <span className="text-slate-300 text-sm font-medium">Starting Relic</span>
                    <span className="font-bold text-amber-300 text-sm">{character.starterRelic.name}</span>
                  </div>
                </div>

                {/* Play Button */}
                <Button
                  onClick={() => handleStartGame(character.id)}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold py-3 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? 'Starting...' : `Play as ${character.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Text */}
        <div className="text-center text-slate-400 text-sm max-w-2xl mx-auto">
          <p className="leading-relaxed">
            Choose your character and embark on a perilous journey through the Spire. Build your deck, collect powerful relics, and defeat the boss to claim victory!
          </p>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
