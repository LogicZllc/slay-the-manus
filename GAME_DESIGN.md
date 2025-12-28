# Slay the Manus - Game Design Document

## Core Game Loop

The game follows a roguelike deckbuilding structure with three main phases:

1. **Map Exploration**: Navigate a procedurally-generated map with branching paths
2. **Combat**: Turn-based card battles against enemies
3. **Progression**: Gain cards, relics, and gold between encounters

## Game Systems

### 1. Combat System

#### Turn Structure
- **Player Turn**: Player draws 5 cards, gains 3 energy, plays cards to attack/defend
- **Enemy Turn**: Enemies execute their predetermined intent (attack, block, debuff)
- **End Condition**: Combat ends when player or all enemies reach 0 HP

#### Energy & Cards
- Energy resets each turn (default 3)
- Each card has an energy cost
- Unplayed cards are discarded at end of turn
- Cards are drawn from a shuffled deck; when deck is empty, discard pile is reshuffled

#### Card Types
- **Attack**: Deals damage to enemies
- **Skill**: Provides block, buffs, or utility effects
- **Power**: Grants a permanent buff for the rest of combat
- **Status/Curse**: Detrimental cards that clog the deck

#### Block & Damage
- Block reduces incoming damage and expires at the start of the next player turn
- Damage is calculated: `(base_damage + strength_modifier) * vulnerability_multiplier / weakness_multiplier`
- Unblocked damage reduces player HP

### 2. Combat Conditions (Status Effects)

#### General Conditions (Player & Enemy)
- **Vulnerable**: Take 50% more damage (duration-based)
- **Weak**: Deal 25% less damage (duration-based)
- **Strength**: Deal X additional damage (intensity-based, can be negative)
- **Dexterity**: Gain X additional block (intensity-based, can be negative)
- **Artifact**: Negate X incoming debuffs (intensity-based)
- **Thorns**: Deal X damage to attackers (intensity-based)
- **Barricade**: Block persists to next turn instead of expiring
- **Metallicize**: Gain X block at end of turn (intensity-based)
- **Plated Armor**: Gain X block at end of turn, loses 1 stack when taking unblocked damage
- **Intangible**: All damage reduced to 1 (duration-based)
- **Regen**: Gain X HP at start of turn (intensity-based)

#### Player-Only Conditions
- **Frail**: Apply 25% less block with cards (duration-based)
- **Entangled**: Cannot play Attack cards (duration-based)
- **Flex**: Lose X strength at end of turn (intensity-based)
- **Blur**: Block is not removed at start of next X turns (duration-based)
- **Draw Reduction**: Draw 1 less card at start of next X turns (duration-based)

#### Enemy-Only Conditions
- **Poison**: Lose X HP at start of turn (intensity-based)
- **Shackled**: Regain X strength at end of turn (intensity-based)
- **Minion**: Abandon combat if only minions remain

### 3. Map System

#### Map Structure
- 7x15 grid (width x height)
- Player starts at bottom, progresses upward
- Branching paths allow multiple routes to the boss
- 3 Acts total, each with unique enemies and rewards

#### Node Types
- **Monster**: Standard combat, rewards gold and cards
- **Elite**: Harder combat, rewards relic + gold + cards
- **Boss**: End of act, rewards rare card + boss relic
- **Shop**: Buy/sell cards, remove cards, buy relics and potions
- **Treasure Room**: Free relic and gold
- **Rest Site**: Heal 30% max HP or upgrade a card
- **Event**: Random encounter (narrative choice, combat, or reward)

#### Map Generation
- Random starting position at bottom (7 choices)
- Nodes branch into 2-3 paths per row
- Guaranteed shops and rest sites at specific intervals
- Boss always at top

### 4. Deck Building

#### Starting Deck
- 10 basic cards (mix of attacks and skills)
- Character-specific starter cards

#### Card Acquisition
- Reward choices after combat (pick 1 of 3 cards)
- Shop purchases (costs gold)
- Treasure room rewards
- Event rewards

#### Deck Modification
- Remove cards at shop (costs gold)
- Upgrade cards at rest site (improves stats)
- Cards can be upgraded multiple times

### 5. Relics System

#### Relic Types
- **Starter Relic**: Given at game start
- **Common Relics**: Found in treasure rooms and elite rewards
- **Uncommon Relics**: Rarer drops
- **Rare Relics**: Boss rewards
- **Curse Relics**: Negative effects (usually from events)

#### Relic Effects
- Passive effects that persist throughout the run
- Can modify card costs, damage, block, or trigger special effects
- Stack multiplicatively or additively depending on effect

### 6. Potions

#### Potion Types
- **Damage Potions**: Deal X damage
- **Block Potions**: Gain X block
- **Buff Potions**: Apply temporary buffs
- **Debuff Potions**: Apply debuffs to enemies
- **Healing Potions**: Restore HP

#### Potion Mechanics
- Limited inventory (typically 3-5 slots)
- Can be used during combat at no energy cost
- Found in shops and as rewards

### 7. Character Classes

Each character has unique:
- Starting deck composition
- Starter relic
- Exclusive cards
- Exclusive relics

#### Example Characters (to be implemented)
- **Ironclad**: Heavy armor focus, strength scaling
- **Silent**: Poison and weak focus, evasion
- **Defect**: Powers and orbs, scaling effects
- **Watcher**: Stance switching, meditation

### 8. Run Progression

#### Metrics
- **Current HP**: Player health (persists between combats)
- **Max HP**: Can be increased by relics and events
- **Gold**: Currency for shops
- **Deck**: Current collection of cards
- **Relics**: Passive effects
- **Potions**: One-time use items
- **Ascension Level**: Difficulty modifier (0-20)

#### Win/Loss Conditions
- **Win**: Defeat all 3 act bosses
- **Loss**: Player HP reaches 0

## Data Structures

### Card
```
{
  id: string
  name: string
  description: string
  type: 'attack' | 'skill' | 'power' | 'status' | 'curse'
  cost: number
  rarity: 'common' | 'uncommon' | 'rare'
  character: string
  effects: Effect[]
  upgrades: number
}
```

### Effect
```
{
  type: 'damage' | 'block' | 'buff' | 'debuff' | 'draw' | 'energy' | 'heal'
  target: 'self' | 'all_enemies' | 'single_enemy'
  value: number
  condition?: string
}
```

### Enemy
```
{
  id: string
  name: string
  maxHp: number
  currentHp: number
  intents: Intent[]
  currentIntentIndex: number
  powers: Power[]
  relics?: Relic[]
}
```

### Intent
```
{
  action: 'attack' | 'block' | 'buff' | 'debuff' | 'heal' | 'summon'
  value: number
  description: string
}
```

### Player
```
{
  maxHp: number
  currentHp: number
  gold: number
  deck: Card[]
  hand: Card[]
  drawPile: Card[]
  discardPile: Card[]
  exhaustPile: Card[]
  relics: Relic[]
  potions: Potion[]
  powers: Power[]
  character: string
  ascensionLevel: number
}
```

### MapNode
```
{
  id: string
  type: 'monster' | 'elite' | 'boss' | 'shop' | 'treasure' | 'rest' | 'event'
  x: number
  y: number
  visited: boolean
  reward?: Reward
  enemies?: Enemy[]
}
```

### GameState
```
{
  currentAct: number
  currentMap: MapNode[]
  currentPosition: MapNode
  player: Player
  currentCombat?: Combat
  runHistory: RunEvent[]
}
```

## Implementation Phases

### Phase 1: Core Combat
- Card system and effects
- Turn-based combat loop
- Enemy AI and intents
- Status effects and conditions
- Damage calculation

### Phase 2: Deck & Progression
- Card acquisition and removal
- Deck management UI
- Card upgrades
- Relics system
- Potions system

### Phase 3: Map & Navigation
- Procedural map generation
- Node types and rewards
- Map UI and navigation
- Run progression tracking

### Phase 4: Characters & Balance
- Character classes
- Character-specific cards
- Balance tuning
- Difficulty scaling

### Phase 5: Polish & Features
- Visual effects and animations
- Sound design
- Accessibility features
- Save/load system
- Statistics tracking
