import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveRound } from '../src/game/rules.js';
import { MOVES } from '../src/config/constants.js';

test('punch beats kick', () => {
  assert.equal(resolveRound(MOVES.PUNCH, MOVES.KICK), 'player');
});

test('block beats punch', () => {
  assert.equal(resolveRound(MOVES.BLOCK, MOVES.PUNCH), 'player');
});

test('kick beats block', () => {
  assert.equal(resolveRound(MOVES.KICK, MOVES.BLOCK), 'player');
});

test('same moves draw', () => {
  assert.equal(resolveRound(MOVES.KICK, MOVES.KICK), 'draw');
});

test('player inactivity auto loses', () => {
  assert.equal(resolveRound(MOVES.NONE, MOVES.PUNCH), 'cpu');
});
