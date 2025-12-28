import React, { useMemo } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAvailableNextNodes, moveToNode, getMapProgress } from '@/lib/mapGeneration';
import { MapNode } from '@/types/game';

export default function MapUI() {
  const { gameState, startCombat, resetGame } = useGame();

  if (!gameState) {
    return <div>No game state</div>;
  }

  const currentNode = gameState.currentMap.nodes.find(n => n.id === gameState.currentMap.currentNodeId);
  const availableNextNodes = useMemo(
    () => getAvailableNextNodes(gameState.currentMap, gameState.currentMap.currentNodeId),
    [gameState.currentMap]
  );
  const mapProgress = useMemo(() => getMapProgress(gameState.currentMap), [gameState.currentMap]);

  const handleNodeClick = (node: MapNode) => {
    if (node.type === 'monster' || node.type === 'elite' || node.type === 'boss') {
      startCombat([node.type === 'elite' ? 'cultist' : 'cultist']);
    } else if (node.type === 'shop') {
      // TODO: Implement shop
      console.log('Shop not yet implemented');
    } else if (node.type === 'rest') {
      // TODO: Implement rest site
      console.log('Rest site not yet implemented');
    } else if (node.type === 'treasure') {
      // TODO: Implement treasure room
      console.log('Treasure room not yet implemented');
    } else if (node.type === 'event') {
      // TODO: Implement event
      console.log('Event not yet implemented');
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'monster':
        return '⚔️';
      case 'elite':
        return '👹';
      case 'boss':
        return '👑';
      case 'shop':
        return '🏪';
      case 'rest':
        return '🏕️';
      case 'treasure':
        return '💎';
      case 'event':
        return '❓';
      default:
        return '•';
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'monster':
        return 'bg-red-900/40 border-red-700/60 hover:bg-red-800/60';
      case 'elite':
        return 'bg-orange-900/40 border-orange-700/60 hover:bg-orange-800/60';
      case 'boss':
        return 'bg-purple-900/60 border-purple-700/80 hover:bg-purple-800/80';
      case 'shop':
        return 'bg-blue-900/40 border-blue-700/60 hover:bg-blue-800/60';
      case 'rest':
        return 'bg-green-900/40 border-green-700/60 hover:bg-green-800/60';
      case 'treasure':
        return 'bg-yellow-900/40 border-yellow-700/60 hover:bg-yellow-800/60';
      case 'event':
        return 'bg-slate-700/40 border-slate-600/60 hover:bg-slate-700/60';
      default:
        return 'bg-slate-800/40 border-slate-700/60';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-black text-amber-100 mb-2">Act {gameState.currentAct}</h1>
            <p className="text-slate-400 text-lg">Progress: {Math.round(mapProgress)}%</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-2">
              HP: <span className="text-green-400">{gameState.player.currentHp}/{gameState.player.maxHp}</span>
            </div>
            <div className="text-2xl text-yellow-400">Gold: {gameState.player.gold}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-slate-800 rounded-full h-3 border border-slate-700">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${mapProgress}%` }}
            />
          </div>
        </div>

        {/* Current Node Info */}
        {currentNode && (
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-600/30 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-100">
                {getNodeIcon(currentNode.type)} {currentNode.type.charAt(0).toUpperCase() + currentNode.type.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">You are currently at this location. Choose your next destination:</p>
            </CardContent>
          </Card>
        )}

        {/* Map Visualization */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-600/30 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-amber-100">Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Display map rows from bottom to top */}
              {Array.from({ length: 15 }, (_, i) => 14 - i).map(y => {
                const nodesInRow = gameState.currentMap.nodes.filter(n => n.y === y);
                if (nodesInRow.length === 0) return null;

                return (
                  <div key={y} className="flex justify-center gap-8">
                    {nodesInRow.map(node => {
                      const isCurrentNode = node.id === gameState.currentMap.currentNodeId;
                      const isAvailable = availableNextNodes.some(n => n.id === node.id);
                      const isVisited = node.visited;

                      return (
                        <button
                          key={node.id}
                          onClick={() => {
                            if (isAvailable) {
                              handleNodeClick(node);
                            }
                          }}
                          disabled={!isAvailable && !isCurrentNode}
                          className={`
                            w-20 h-20 rounded-lg border-2 transition-all duration-300 flex items-center justify-center text-2xl font-bold
                            ${isCurrentNode ? 'ring-4 ring-amber-400 scale-110' : ''}
                            ${isAvailable ? 'cursor-pointer' : isVisited ? 'opacity-50 cursor-default' : 'opacity-30 cursor-not-allowed'}
                            ${getNodeColor(node.type)}
                          `}
                          title={`${node.type} (${node.visited ? 'visited' : 'unvisited'})`}
                        >
                          {getNodeIcon(node.type)}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Player Info */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-600/30 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-amber-100">Deck & Relics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <p className="text-slate-300 text-sm mb-1">Deck Size</p>
                <p className="text-white font-bold text-2xl">{gameState.player.deck.length}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <p className="text-slate-300 text-sm mb-1">Relics</p>
                <p className="text-white font-bold text-2xl">{gameState.player.relics.length}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <p className="text-slate-300 text-sm mb-1">Potions</p>
                <p className="text-white font-bold text-2xl">{gameState.player.potions.length}</p>
              </div>
            </div>

            {gameState.player.relics.length > 0 && (
              <div>
                <p className="text-slate-300 text-sm mb-3">Active Relics:</p>
                <div className="space-y-2">
                  {gameState.player.relics.map((relic, idx) => (
                    <div key={idx} className="bg-slate-900/50 p-3 rounded border border-amber-600/30">
                      <p className="text-amber-300 font-semibold">{relic.name}</p>
                      <p className="text-slate-400 text-sm">{relic.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={resetGame}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6"
          >
            Return to Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
