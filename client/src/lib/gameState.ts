import { GameState, Player, Card, Combat, Enemy, CombatPhase, StatusEffect, Intent } from '@/types/game';
import { GAME_CONSTANTS, STARTER_CARDS, STARTER_RELICS, CHARACTERS, ENEMIES } from './constants';

// ============ GAME STATE INITIALIZATION ============

export function initializeGameState(characterId: string): GameState {
  const character = CHARACTERS[characterId];
  if (!character) throw new Error(`Character ${characterId} not found`);

  const player: Player = {
    maxHp: character.maxHp,
    currentHp: character.maxHp,
    gold: GAME_CONSTANTS.STARTING_GOLD,
    deck: [...character.startingDeck],
    hand: [],
    drawPile: [...character.startingDeck],
    discardPile: [],
    exhaustPile: [],
    relics: [character.starterRelic],
    potions: [],
    powers: [],
    character: characterId,
    ascensionLevel: 0,
  };

  return {
    currentAct: 1,
    currentMap: generateMap(1),
    player,
    runHistory: [],
    runStartTime: Date.now(),
    isRunActive: true,
  };
}

// ============ MAP GENERATION ============

export function generateMap(act: number) {
  const seed = Math.random();
  const nodes: any[] = [];

  // Simple map generation - creates a branching path
  for (let y = 0; y < GAME_CONSTANTS.MAP_HEIGHT; y++) {
    for (let x = 0; x < GAME_CONSTANTS.MAP_WIDTH; x++) {
      // Placeholder - full implementation in Phase 5
    }
  }

  return {
    act,
    nodes,
    currentNodeId: '',
    seed,
  };
}

// ============ COMBAT INITIALIZATION ============

export function initializeCombat(player: Player, enemies: Enemy[]): Combat {
  const freshEnemies = enemies.map(e => ({
    ...e,
    currentHp: e.maxHp,
    currentIntentIndex: 0,
  }));

  return {
    id: `combat_${Date.now()}`,
    enemies: freshEnemies,
    player: {
      ...player,
      hand: [],
      powers: [],
    },
    currentPhase: 'player_turn',
    currentEnergy: GAME_CONSTANTS.STARTING_ENERGY,
    turn: 1,
    round: 1,
    isPlayerTurn: true,
    history: [],
  };
}

// ============ TURN MANAGEMENT ============

export function startPlayerTurn(combat: Combat): Combat {
  const updated = { ...combat };

  // Draw cards
  updated.player.hand = drawCards(updated.player, GAME_CONSTANTS.STARTING_HAND_SIZE);

  // Reset energy
  updated.currentEnergy = GAME_CONSTANTS.STARTING_ENERGY;

  // Decrease duration-based status effects
  updated.player.powers = updated.player.powers.map(power => {
    if (power.stackType === 'duration' && power.stacks > 0) {
      return { ...power, stacks: power.stacks - 1 };
    }
    return power;
  });

  // Remove expired status effects
  updated.player.powers = updated.player.powers.filter(p => p.stacks > 0 || p.stackType !== 'duration');

  // Trigger turn start effects (relics, powers, etc.)
  updated.player.powers.forEach(power => {
    if (power.type === 'regen') {
      updated.player.currentHp = Math.min(updated.player.currentHp + power.stacks, updated.player.maxHp);
    }
  });

  updated.currentPhase = 'player_action';
  updated.isPlayerTurn = true;

  return updated;
}

export function endPlayerTurn(combat: Combat): Combat {
  const updated = { ...combat };

  // Discard remaining hand
  updated.player.discardPile.push(...updated.player.hand);
  updated.player.hand = [];

  // Drain remaining energy
  updated.currentEnergy = 0;

  // Decrease block (unless Barricade is active)
  const hasBarricade = updated.player.powers.some(p => p.type === 'barricade');
  if (!hasBarricade) {
    // Block is tracked separately in combat, reset here
  }

  // Move to enemy turn
  updated.currentPhase = 'enemy_turn';
  updated.isPlayerTurn = false;

  return updated;
}

export function startEnemyTurn(combat: Combat): Combat {
  const updated = { ...combat };

  // Execute enemy intents
  updated.enemies.forEach(enemy => {
    const intent = enemy.intents[enemy.currentIntentIndex];
    if (!intent) return;

    switch (intent.action) {
      case 'attack':
        applyDamageToPlayer(updated, intent.value);
        break;
      case 'block':
        applyBlockToEnemy(updated, enemy.id, intent.value);
        break;
      case 'buff':
        applyBuffToEnemy(updated, enemy.id, 'strength', intent.value);
        break;
      case 'debuff':
        applyDebuffToPlayer(updated, 'vulnerable', intent.value);
        break;
      case 'heal':
        enemy.currentHp = Math.min(enemy.currentHp + intent.value, enemy.maxHp);
        break;
    }

    // Advance to next intent
    enemy.currentIntentIndex = (enemy.currentIntentIndex + 1) % enemy.intents.length;
  });

  // Decrease enemy duration effects
  updated.enemies.forEach(enemy => {
    enemy.powers = enemy.powers.map(power => {
      if (power.stackType === 'duration' && power.stacks > 0) {
        return { ...power, stacks: power.stacks - 1 };
      }
      return power;
    });
    enemy.powers = enemy.powers.filter(p => p.stacks > 0 || p.stackType !== 'duration');
  });

  // Check for combat end
  const allEnemiesDead = updated.enemies.every(e => e.currentHp <= 0);
  if (allEnemiesDead) {
    updated.currentPhase = 'combat_end';
  } else {
    updated.turn++;
    updated.round++;
    updated.currentPhase = 'player_turn';
  }

  return updated;
}

// ============ CARD MECHANICS ============

export function drawCards(player: Player, count: number): Card[] {
  const drawn: Card[] = [];

  for (let i = 0; i < count; i++) {
    if (player.drawPile.length === 0) {
      // Reshuffle discard pile
      if (player.discardPile.length === 0) break;
      player.drawPile = [...player.discardPile];
      player.discardPile = [];
      shuffleArray(player.drawPile);
    }

    if (player.drawPile.length > 0) {
      drawn.push(player.drawPile.pop()!);
    }
  }

  return drawn;
}

export function playCard(combat: Combat, cardIndex: number, targetEnemyId?: string): Combat {
  const card = combat.player.hand[cardIndex];
  if (!card) return combat;

  const updated = { ...combat };

  // Check energy
  if (updated.currentEnergy < card.cost) return updated;

  // Deduct energy
  updated.currentEnergy -= card.cost;

  // Apply card effects
  card.effects.forEach(effect => {
    switch (effect.type) {
      case 'damage':
        if (effect.target === 'single_enemy' && targetEnemyId) {
          applyDamageToEnemy(updated, targetEnemyId, effect.value);
        } else if (effect.target === 'all_enemies') {
          updated.enemies.forEach(e => applyDamageToEnemy(updated, e.id, effect.value));
        }
        break;
      case 'block':
        applyBlockToPlayer(updated, effect.value);
        break;
      case 'buff':
        if (effect.condition) {
          applyBuffToPlayer(updated, effect.condition as any, effect.value);
        }
        break;
      case 'debuff':
        if (effect.condition && targetEnemyId) {
          applyDebuffToEnemy(updated, targetEnemyId, effect.condition as any, effect.value);
        }
        break;
      case 'draw':
        updated.player.hand.push(...drawCards(updated.player, effect.value));
        break;
    }
  });

  // Move card to discard
  updated.player.hand.splice(cardIndex, 1);
  if (!card.isExhaust) {
    updated.player.discardPile.push(card);
  } else {
    updated.player.exhaustPile.push(card);
  }

  return updated;
}

// ============ DAMAGE CALCULATION ============

function calculateDamage(baseDamage: number, attacker: 'player' | 'enemy', defender: Player | Enemy, combat: Combat): number {
  let damage = baseDamage;

  // Apply strength
  const strengthPower = (attacker === 'player' ? combat.player : (defender as Enemy)).powers.find(p => p.type === 'strength');
  if (strengthPower) {
    damage += strengthPower.stacks;
  }

  // Apply weakness
  const weakPower = (attacker === 'player' ? combat.player : (defender as Enemy)).powers.find(p => p.type === 'weak');
  if (weakPower) {
    damage = Math.floor(damage * 0.75);
  }

  // Apply vulnerability (defender takes more damage)
  const vulnerablePower = (defender as any).powers?.find((p: StatusEffect) => p.type === 'vulnerable');
  if (vulnerablePower) {
    damage = Math.floor(damage * 1.5);
  }

  // Apply intangible
  const intangiblePower = (defender as any).powers?.find((p: StatusEffect) => p.type === 'intangible');
  if (intangiblePower) {
    damage = Math.max(1, damage);
  }

  return Math.max(0, damage);
}

function applyDamageToPlayer(combat: Combat, baseDamage: number): void {
  const damage = calculateDamage(baseDamage, 'enemy', combat.player, combat);
  combat.player.currentHp -= damage;
}

function applyDamageToEnemy(combat: Combat, enemyId: string, baseDamage: number): void {
  const enemy = combat.enemies.find(e => e.id === enemyId);
  if (!enemy) return;

  const damage = calculateDamage(baseDamage, 'player', enemy, combat);
  enemy.currentHp -= damage;
}

// ============ BLOCK MECHANICS ============

function applyBlockToPlayer(combat: Combat, blockAmount: number): void {
  // Block is applied to player - implementation depends on UI state
  // For now, this is a placeholder
}

function applyBlockToEnemy(combat: Combat, enemyId: string, blockAmount: number): void {
  // Block is applied to enemy - implementation depends on UI state
  // For now, this is a placeholder
}

// ============ STATUS EFFECT APPLICATION ============

function applyBuffToPlayer(combat: Combat, buffType: string, stacks: number): void {
  const existingPower = combat.player.powers.find(p => p.type === buffType as any);
  if (existingPower) {
    existingPower.stacks += stacks;
  } else {
    combat.player.powers.push({
      type: buffType as any,
      stacks,
      stackType: 'intensity',
      description: `${buffType}: +${stacks}`,
    });
  }
}

function applyBuffToEnemy(combat: Combat, enemyId: string, buffType: string, stacks: number): void {
  const enemy = combat.enemies.find(e => e.id === enemyId);
  if (!enemy) return;

  const existingPower = enemy.powers.find(p => p.type === buffType as any);
  if (existingPower) {
    existingPower.stacks += stacks;
  } else {
    enemy.powers.push({
      type: buffType as any,
      stacks,
      stackType: 'intensity',
      description: `${buffType}: +${stacks}`,
    });
  }
}

function applyDebuffToPlayer(combat: Combat, debuffType: string, stacks: number): void {
  const existingPower = combat.player.powers.find(p => p.type === debuffType as any);
  if (existingPower) {
    existingPower.stacks += stacks;
  } else {
    combat.player.powers.push({
      type: debuffType as any,
      stacks,
      stackType: 'duration',
      description: `${debuffType}: ${stacks} turns`,
    });
  }
}

function applyDebuffToEnemy(combat: Combat, enemyId: string, debuffType: string, stacks: number): void {
  const enemy = combat.enemies.find(e => e.id === enemyId);
  if (!enemy) return;

  const existingPower = enemy.powers.find(p => p.type === debuffType as any);
  if (existingPower) {
    existingPower.stacks += stacks;
  } else {
    enemy.powers.push({
      type: debuffType as any,
      stacks,
      stackType: 'duration',
      description: `${debuffType}: ${stacks} turns`,
    });
  }
}

// ============ UTILITY FUNCTIONS ============

export function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function isCombatOver(combat: Combat): boolean {
  const allEnemiesDead = combat.enemies.every(e => e.currentHp <= 0);
  const playerDead = combat.player.currentHp <= 0;
  return allEnemiesDead || playerDead;
}

export function getCombatWinner(combat: Combat): 'player' | 'enemy' | null {
  if (combat.player.currentHp <= 0) return 'enemy';
  if (combat.enemies.every(e => e.currentHp <= 0)) return 'player';
  return null;
}
