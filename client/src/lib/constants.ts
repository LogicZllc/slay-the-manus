import { Card, Character, Relic, Potion, Enemy, Intent } from '@/types/game';

// ============ GAME CONSTANTS ============
export const GAME_CONSTANTS = {
  STARTING_ENERGY: 3,
  STARTING_HAND_SIZE: 5,
  STARTING_MAX_HP: 80,
  STARTING_GOLD: 0,
  MAX_POTION_SLOTS: 3,
  BLOCK_EXPIRE_TURN: true, // Block expires at start of next turn
  HAND_DISCARD_ON_TURN_END: true,
  ENERGY_DRAIN_ON_TURN_END: true,
  ACTS: 3,
  MAP_WIDTH: 7,
  MAP_HEIGHT: 15,
  ELITE_RELIC_REWARD: 1,
  BOSS_RELIC_REWARD: 1,
  CARD_REWARD_CHOICES: 3,
  RELIC_REWARD_CHOICES: 3,
};

// ============ STARTER CARDS (IRONCLAD) ============
export const STARTER_CARDS: Record<string, Card[]> = {
  ironclad: [
    {
      id: 'strike',
      name: 'Strike',
      description: 'Deal 6 damage.',
      type: 'attack',
      cost: 1,
      baseCost: 1,
      rarity: 'common',
      character: 'ironclad',
      effects: [
        {
          type: 'damage',
          target: 'single_enemy',
          value: 6,
          description: 'Deal 6 damage',
        },
      ],
      upgrades: 0,
      maxUpgrades: 1,
      isExhaust: false,
    },
    {
      id: 'defend',
      name: 'Defend',
      description: 'Gain 5 block.',
      type: 'skill',
      cost: 1,
      baseCost: 1,
      rarity: 'common',
      character: 'ironclad',
      effects: [
        {
          type: 'block',
          target: 'self',
          value: 5,
          description: 'Gain 5 block',
        },
      ],
      upgrades: 0,
      maxUpgrades: 1,
      isExhaust: false,
    },
    {
      id: 'bash',
      name: 'Bash',
      description: 'Deal 8 damage. Apply 2 Vulnerable.',
      type: 'attack',
      cost: 1,
      baseCost: 1,
      rarity: 'common',
      character: 'ironclad',
      effects: [
        {
          type: 'damage',
          target: 'single_enemy',
          value: 8,
          description: 'Deal 8 damage',
        },
        {
          type: 'debuff',
          target: 'single_enemy',
          value: 2,
          condition: 'vulnerable',
          description: 'Apply 2 Vulnerable',
        },
      ],
      upgrades: 0,
      maxUpgrades: 1,
      isExhaust: false,
    },
    {
      id: 'strike',
      name: 'Strike',
      description: 'Deal 6 damage.',
      type: 'attack',
      cost: 1,
      baseCost: 1,
      rarity: 'common',
      character: 'ironclad',
      effects: [
        {
          type: 'damage',
          target: 'single_enemy',
          value: 6,
          description: 'Deal 6 damage',
        },
      ],
      upgrades: 0,
      maxUpgrades: 1,
      isExhaust: false,
    },
    {
      id: 'defend',
      name: 'Defend',
      description: 'Gain 5 block.',
      type: 'skill',
      cost: 1,
      baseCost: 1,
      rarity: 'common',
      character: 'ironclad',
      effects: [
        {
          type: 'block',
          target: 'self',
          value: 5,
          description: 'Gain 5 block',
        },
      ],
      upgrades: 0,
      maxUpgrades: 1,
      isExhaust: false,
    },
  ],
};

// ============ COMMON CARDS ============
export const COMMON_CARDS: Record<string, Card> = {
  heavy_slash: {
    id: 'heavy_slash',
    name: 'Heavy Slash',
    description: 'Deal 16 damage. Costs 1 less [E] for each card played this turn.',
    type: 'attack',
    cost: 3,
    baseCost: 3,
    rarity: 'common',
    character: 'ironclad',
    effects: [
      {
        type: 'damage',
        target: 'single_enemy',
        value: 16,
        description: 'Deal 16 damage',
      },
    ],
    upgrades: 0,
    maxUpgrades: 1,
    isExhaust: false,
  },
  pummel: {
    id: 'pummel',
    name: 'Pummel',
    description: 'Deal 4 damage 4 times.',
    type: 'attack',
    cost: 1,
    baseCost: 1,
    rarity: 'common',
    character: 'ironclad',
    effects: [
      {
        type: 'damage',
        target: 'single_enemy',
        value: 4,
        description: 'Deal 4 damage 4 times',
      },
    ],
    upgrades: 0,
    maxUpgrades: 1,
    isExhaust: false,
  },
  iron_wave: {
    id: 'iron_wave',
    name: 'Iron Wave',
    description: 'Deal 5 damage. Gain 5 block.',
    type: 'attack',
    cost: 1,
    baseCost: 1,
    rarity: 'common',
    character: 'ironclad',
    effects: [
      {
        type: 'damage',
        target: 'single_enemy',
        value: 5,
        description: 'Deal 5 damage',
      },
      {
        type: 'block',
        target: 'self',
        value: 5,
        description: 'Gain 5 block',
      },
    ],
    upgrades: 0,
    maxUpgrades: 1,
    isExhaust: false,
  },
  shrug_it_off: {
    id: 'shrug_it_off',
    name: 'Shrug It Off',
    description: 'Gain 8 block. Draw 1 card.',
    type: 'skill',
    cost: 1,
    baseCost: 1,
    rarity: 'common',
    character: 'ironclad',
    effects: [
      {
        type: 'block',
        target: 'self',
        value: 8,
        description: 'Gain 8 block',
      },
      {
        type: 'draw',
        target: 'self',
        value: 1,
        description: 'Draw 1 card',
      },
    ],
    upgrades: 0,
    maxUpgrades: 1,
    isExhaust: false,
  },
};

// ============ UNCOMMON CARDS ============
export const UNCOMMON_CARDS: Record<string, Card> = {
  bludgeon: {
    id: 'bludgeon',
    name: 'Bludgeon',
    description: 'Deal 32 damage.',
    type: 'attack',
    cost: 3,
    baseCost: 3,
    rarity: 'uncommon',
    character: 'ironclad',
    effects: [
      {
        type: 'damage',
        target: 'single_enemy',
        value: 32,
        description: 'Deal 32 damage',
      },
    ],
    upgrades: 0,
    maxUpgrades: 1,
    isExhaust: false,
  },
  power_through: {
    id: 'power_through',
    name: 'Power Through',
    description: 'Gain 15 block. Exhaust 1 card from your hand.',
    type: 'skill',
    cost: 1,
    baseCost: 1,
    rarity: 'uncommon',
    character: 'ironclad',
    effects: [
      {
        type: 'block',
        target: 'self',
        value: 15,
        description: 'Gain 15 block',
      },
      {
        type: 'exhaust',
        target: 'self',
        value: 1,
        description: 'Exhaust 1 card from your hand',
      },
    ],
    upgrades: 0,
    maxUpgrades: 1,
    isExhaust: false,
  },
  inflame: {
    id: 'inflame',
    name: 'Inflame',
    description: 'Apply 2 Strength.',
    type: 'power',
    cost: 1,
    baseCost: 1,
    rarity: 'uncommon',
    character: 'ironclad',
    effects: [
      {
        type: 'buff',
        target: 'self',
        value: 2,
        condition: 'strength',
        description: 'Apply 2 Strength',
      },
    ],
    upgrades: 0,
    maxUpgrades: 1,
    isExhaust: false,
  },
};

// ============ RARE CARDS ============
export const RARE_CARDS: Record<string, Card> = {
  pummel_strike: {
    id: 'pummel_strike',
    name: 'Pummel Strike',
    description: 'Deal 8 damage 3 times.',
    type: 'attack',
    cost: 4,
    baseCost: 4,
    rarity: 'rare',
    character: 'ironclad',
    effects: [
      {
        type: 'damage',
        target: 'single_enemy',
        value: 8,
        description: 'Deal 8 damage 3 times',
      },
    ],
    upgrades: 0,
    maxUpgrades: 1,
    isExhaust: false,
  },
  berserk: {
    id: 'berserk',
    name: 'Berserk',
    description: 'Apply 2 Strength. Gain 1 Vulnerable.',
    type: 'power',
    cost: 0,
    baseCost: 0,
    rarity: 'rare',
    character: 'ironclad',
    effects: [
      {
        type: 'buff',
        target: 'self',
        value: 2,
        condition: 'strength',
        description: 'Apply 2 Strength',
      },
      {
        type: 'debuff',
        target: 'self',
        value: 1,
        condition: 'vulnerable',
        description: 'Gain 1 Vulnerable',
      },
    ],
    upgrades: 0,
    maxUpgrades: 1,
    isExhaust: false,
  },
};

// ============ STARTER RELICS ============
export const STARTER_RELICS: Record<string, Relic> = {
  burning_blood: {
    id: 'burning_blood',
    name: 'Burning Blood',
    description: 'At the end of combat, heal 6 HP.',
    rarity: 'starter',
    character: 'ironclad',
    effect: () => {},
    triggerOn: 'combat_end',
  },
};

// ============ COMMON RELICS ============
export const COMMON_RELICS: Record<string, Relic> = {
  akabeko: {
    id: 'akabeko',
    name: 'Akabeko',
    description: 'Whenever you play a Power card, deal 1 damage to a random enemy.',
    rarity: 'common',
    character: 'ironclad',
    effect: () => {},
    triggerOn: 'card_play',
  },
  anchor: {
    id: 'anchor',
    name: 'Anchor',
    description: 'Reduce the effect of Vulnerable applied to you by 1.',
    rarity: 'common',
    character: 'ironclad',
    effect: () => {},
  },
};

// ============ POTIONS ============
export const POTIONS: Record<string, Potion> = {
  strength_potion: {
    id: 'strength_potion',
    name: 'Strength Potion',
    description: 'Apply 2 Strength.',
    type: 'strength',
    value: 2,
    rarity: 'common',
  },
  block_potion: {
    id: 'block_potion',
    name: 'Block Potion',
    description: 'Gain 12 block.',
    type: 'block',
    value: 12,
    rarity: 'common',
  },
  damage_potion: {
    id: 'damage_potion',
    name: 'Damage Potion',
    description: 'Deal 20 damage to a random enemy.',
    type: 'damage',
    value: 20,
    rarity: 'common',
  },
};

// ============ ENEMIES ============
export const ENEMIES: Record<string, Enemy> = {
  cultist: {
    id: 'cultist',
    name: 'Cultist',
    maxHp: 48,
    currentHp: 48,
    intents: [
      {
        action: 'attack',
        value: 6,
        description: 'Attack for 6 damage',
      },
      {
        action: 'buff',
        value: 2,
        description: 'Apply 2 Strength',
      },
    ],
    currentIntentIndex: 0,
    powers: [],
    isMinion: false,
  },
  jaw_worm: {
    id: 'jaw_worm',
    name: 'Jaw Worm',
    maxHp: 40,
    currentHp: 40,
    intents: [
      {
        action: 'attack',
        value: 5,
        description: 'Attack for 5 damage',
      },
      {
        action: 'block',
        value: 5,
        description: 'Gain 5 block',
      },
    ],
    currentIntentIndex: 0,
    powers: [],
    isMinion: false,
  },
  louse_red: {
    id: 'louse_red',
    name: 'Red Louse',
    maxHp: 13,
    currentHp: 13,
    intents: [
      {
        action: 'attack',
        value: 4,
        description: 'Attack for 4 damage',
      },
      {
        action: 'buff',
        value: 1,
        description: 'Apply 1 Strength',
      },
    ],
    currentIntentIndex: 0,
    powers: [],
    isMinion: false,
  },
};

// ============ CHARACTERS ============
export const CHARACTERS: Record<string, Character> = {
  ironclad: {
    id: 'ironclad',
    name: 'Ironclad',
    description: 'A veteran warrior with a focus on strength and defense.',
    maxHp: 80,
    startingDeck: STARTER_CARDS.ironclad,
    starterRelic: STARTER_RELICS.burning_blood,
    exclusiveCards: [RARE_CARDS.berserk],
    exclusiveRelics: [STARTER_RELICS.burning_blood],
    artwork: '/characters/ironclad.png',
  },
};
