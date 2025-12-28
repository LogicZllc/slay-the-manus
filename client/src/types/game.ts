// Game Type Definitions for Slay the Manus

// ============ CARD SYSTEM ============
export type CardType = 'attack' | 'skill' | 'power' | 'status' | 'curse';
export type CardRarity = 'common' | 'uncommon' | 'rare';
export type EffectType = 'damage' | 'block' | 'buff' | 'debuff' | 'draw' | 'energy' | 'heal' | 'exhaust' | 'scry';
export type EffectTarget = 'self' | 'all_enemies' | 'single_enemy' | 'random_enemy';

export interface Effect {
  type: EffectType;
  target: EffectTarget;
  value: number;
  condition?: string;
  description: string;
}

export interface Card {
  id: string;
  name: string;
  description: string;
  type: CardType;
  cost: number;
  baseCost: number;
  rarity: CardRarity;
  character: string;
  effects: Effect[];
  upgrades: number;
  maxUpgrades: number;
  isExhaust: boolean;
}

// ============ STATUS EFFECTS ============
export type StatusEffectType =
  | 'vulnerable'
  | 'weak'
  | 'strength'
  | 'dexterity'
  | 'artifact'
  | 'thorns'
  | 'barricade'
  | 'metallicize'
  | 'plated_armor'
  | 'intangible'
  | 'regen'
  | 'frail'
  | 'entangled'
  | 'flex'
  | 'blur'
  | 'draw_reduction'
  | 'poison'
  | 'shackled'
  | 'minion';

export type StatusStackType = 'duration' | 'intensity' | 'none';

export interface StatusEffect {
  type: StatusEffectType;
  stacks: number;
  stackType: StatusStackType;
  description: string;
}

// ============ ENEMY SYSTEM ============
export type IntentAction = 'attack' | 'block' | 'buff' | 'debuff' | 'heal' | 'summon' | 'power' | 'multi_attack';

export interface Intent {
  action: IntentAction;
  value: number;
  description: string;
}

export interface Enemy {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  intents: Intent[];
  currentIntentIndex: number;
  powers: StatusEffect[];
  isMinion: boolean;
  nextIntentIndex?: number;
}

// ============ RELIC SYSTEM ============
export type RelicRarity = 'starter' | 'common' | 'uncommon' | 'rare' | 'curse';

export interface Relic {
  id: string;
  name: string;
  description: string;
  rarity: RelicRarity;
  character: string;
  effect: (gameState: any) => void;
  triggerOn?: 'card_play' | 'turn_start' | 'turn_end' | 'combat_start' | 'combat_end' | 'damage_taken' | 'damage_dealt';
}

// ============ POTION SYSTEM ============
export type PotionType = 'damage' | 'block' | 'buff' | 'debuff' | 'heal' | 'strength' | 'dexterity';

export interface Potion {
  id: string;
  name: string;
  description: string;
  type: PotionType;
  value: number;
  rarity: CardRarity;
}

// ============ PLAYER SYSTEM ============
export interface Player {
  maxHp: number;
  currentHp: number;
  gold: number;
  deck: Card[];
  hand: Card[];
  drawPile: Card[];
  discardPile: Card[];
  exhaustPile: Card[];
  relics: Relic[];
  potions: Potion[];
  powers: StatusEffect[];
  character: string;
  ascensionLevel: number;
}

// ============ COMBAT SYSTEM ============
export type CombatPhase = 'player_turn' | 'player_action' | 'enemy_turn' | 'combat_end';

export interface Combat {
  id: string;
  enemies: Enemy[];
  player: Player;
  currentPhase: CombatPhase;
  currentEnergy: number;
  turn: number;
  round: number;
  isPlayerTurn: boolean;
  history: CombatAction[];
}

export interface CombatAction {
  type: 'card_play' | 'potion_use' | 'end_turn' | 'enemy_action' | 'status_applied' | 'damage_dealt';
  actor: 'player' | 'enemy';
  details: any;
  timestamp: number;
}

// ============ MAP SYSTEM ============
export type NodeType = 'monster' | 'elite' | 'boss' | 'shop' | 'treasure' | 'rest' | 'event' | 'unknown';

export interface MapNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  visited: boolean;
  reward?: Reward;
  enemies?: Enemy[];
  connections: string[];
}

export interface Reward {
  type: 'card' | 'relic' | 'gold' | 'potion' | 'choice';
  options: (Card | Relic | Potion | number)[];
  selectedIndex?: number;
}

export interface GameMap {
  act: number;
  nodes: MapNode[];
  currentNodeId: string;
  seed: number;
}

// ============ RUN SYSTEM ============
export interface RunEvent {
  type: 'combat_start' | 'combat_end' | 'card_acquired' | 'card_removed' | 'relic_acquired' | 'potion_acquired' | 'gold_gained' | 'hp_lost';
  details: any;
  timestamp: number;
}

export interface GameState {
  currentAct: number;
  currentMap: GameMap;
  player: Player;
  currentCombat?: Combat;
  runHistory: RunEvent[];
  runStartTime: number;
  isRunActive: boolean;
}

// ============ CHARACTER SYSTEM ============
export interface Character {
  id: string;
  name: string;
  description: string;
  maxHp: number;
  startingDeck: Card[];
  starterRelic: Relic;
  exclusiveCards: Card[];
  exclusiveRelics: Relic[];
  artwork: string;
}

// ============ SHOP SYSTEM ============
export interface ShopItem {
  id: string;
  type: 'card' | 'relic' | 'potion' | 'removal';
  item: Card | Relic | Potion | null;
  cost: number;
  purchased: boolean;
}

export interface Shop {
  items: ShopItem[];
  gold: number;
  potionSlots: number;
  relicSlots: number;
}

// ============ DIFFICULTY SYSTEM ============
export interface AscensionModifier {
  level: number;
  enemyScaling: number;
  rewardScaling: number;
  modifiers: string[];
}
