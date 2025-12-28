import { MapNode, GameMap, NodeType } from '@/types/game';
import { GAME_CONSTANTS } from './constants';

/**
 * Procedural map generation for Slay the Manus
 * Based on Slay the Spire's map generation algorithm
 * 
 * Map Structure:
 * - 7 columns (width) x 15 rows (height)
 * - Player starts at bottom, progresses upward
 * - Branching paths with guaranteed shops and rest sites
 * - Boss at the top
 */

export function generateMap(act: number, seed: number): GameMap {
  const nodes: MapNode[] = [];
  const nodeConnections: Map<string, string[]> = new Map();
  
  // Set random seed for reproducibility
  const rng = createSeededRandom(seed);
  
  // Generate nodes for each row
  for (let y = 0; y < GAME_CONSTANTS.MAP_HEIGHT; y++) {
    const nodesInRow = generateNodesForRow(y, act, rng);
    nodes.push(...nodesInRow);
  }
  
  // Create connections between rows
  connectNodes(nodes, rng);
  
  // Determine starting node (random from bottom row)
  const bottomNodes = nodes.filter(n => n.y === GAME_CONSTANTS.MAP_HEIGHT - 1);
  const startingNode = bottomNodes[Math.floor(rng() * bottomNodes.length)];
  
  return {
    act,
    nodes,
    currentNodeId: startingNode.id,
    seed,
  };
}

function generateNodesForRow(y: number, act: number, rng: () => number): MapNode[] {
  const nodes: MapNode[] = [];
  
  // Boss at the top
  if (y === 0) {
    const bossNode: MapNode = {
      id: `node_${y}_0`,
      type: 'boss',
      x: 3, // Center
      y,
      visited: false,
      connections: [],
      enemies: [], // Placeholder - would vary by act
    };
    return [bossNode];
  }
  
  // Determine number of nodes in this row (2-3 typically)
  const nodeCount = rng() < 0.5 ? 2 : 3;
  const positions = distributeNodesAcrossRow(nodeCount);
  
  for (let i = 0; i < nodeCount; i++) {
    const nodeType = determineNodeType(y, act, rng);
    const node: MapNode = {
      id: `node_${y}_${i}`,
      type: nodeType,
      x: positions[i],
      y,
      visited: false,
      connections: [],
      enemies: [], // Placeholder - would vary by act
    };
    nodes.push(node);
  }
  
  return nodes;
}

function determineNodeType(y: number, act: number, rng: () => number): NodeType {
  // Guarantee certain node types at specific intervals
  const rowFromTop = GAME_CONSTANTS.MAP_HEIGHT - 1 - y;
  
  // Shop appears roughly every 4-5 rows
  if (rowFromTop % 5 === 0 && rowFromTop > 0) {
    return 'shop';
  }
  
  // Rest site appears roughly every 3-4 rows
  if (rowFromTop % 4 === 0 && rowFromTop > 0) {
    return 'rest';
  }
  
  // Treasure rooms scattered throughout
  if (rng() < 0.1) {
    return 'treasure';
  }
  
  // Events scattered throughout
  if (rng() < 0.15) {
    return 'event';
  }
  
  // Elite encounters (about 20% of remaining)
  if (rng() < 0.2) {
    return 'elite';
  }
  
  // Default to monster
  return 'monster' as NodeType;
}

function distributeNodesAcrossRow(count: number): number[] {
  const positions: number[] = [];
  const spacing = GAME_CONSTANTS.MAP_WIDTH / (count + 1);
  
  for (let i = 0; i < count; i++) {
    positions.push(Math.floor((i + 1) * spacing));
  }
  
  return positions;
}

function connectNodes(nodes: MapNode[], rng: () => number): void {
  // Group nodes by row
  const nodesByRow: Map<number, MapNode[]> = new Map();
  
  for (const node of nodes) {
    if (!nodesByRow.has(node.y)) {
      nodesByRow.set(node.y, []);
    }
    nodesByRow.get(node.y)!.push(node);
  }
  
  // Connect each row to the next
  for (let y = GAME_CONSTANTS.MAP_HEIGHT - 1; y > 0; y--) {
    const currentRow = nodesByRow.get(y) || [];
    const nextRow = nodesByRow.get(y - 1) || [];
    
    if (currentRow.length === 0 || nextRow.length === 0) continue;
    
    // Each node in current row connects to 1-2 nodes in next row
    for (const currentNode of currentRow) {
      const connectCount = nextRow.length === 1 ? 1 : rng() < 0.6 ? 1 : 2;
      
      // Find closest nodes in next row
      const sortedNextRow = [...nextRow].sort((a, b) => {
        return Math.abs(a.x - currentNode.x) - Math.abs(b.x - currentNode.x);
      });
      
      for (let i = 0; i < connectCount && i < sortedNextRow.length; i++) {
        const nextNode = sortedNextRow[i];
        currentNode.connections.push(nextNode.id);
      }
    }
  }
}

function createSeededRandom(seed: number): () => number {
  let value = seed;
  
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

/**
 * Get available next nodes from current position
 */
export function getAvailableNextNodes(map: GameMap, currentNodeId: string): MapNode[] {
  const currentNode = map.nodes.find(n => n.id === currentNodeId);
  if (!currentNode) return [];
  
  return map.nodes.filter(n => currentNode.connections.includes(n.id));
}

/**
 * Move to next node
 */
export function moveToNode(map: GameMap, nodeId: string): GameMap {
  const node = map.nodes.find(n => n.id === nodeId);
  if (!node) return map;
  
  return {
    ...map,
    currentNodeId: nodeId,
    nodes: map.nodes.map(n => 
      n.id === nodeId ? { ...n, visited: true } : n
    ),
  };
}

/**
 * Check if player has reached the boss
 */
export function hasReachedBoss(map: GameMap): boolean {
  const currentNode = map.nodes.find(n => n.id === map.currentNodeId);
  return currentNode?.type === 'boss';
}

/**
 * Get map progress percentage
 */
export function getMapProgress(map: GameMap): number {
  const currentNode = map.nodes.find(n => n.id === map.currentNodeId);
  if (!currentNode) return 0;
  
  // Progress is based on y position (0 = boss, 14 = start)
  const maxDistance = GAME_CONSTANTS.MAP_HEIGHT - 1;
  const currentDistance = GAME_CONSTANTS.MAP_HEIGHT - 1 - currentNode.y;
  
  return (currentDistance / maxDistance) * 100;
}
