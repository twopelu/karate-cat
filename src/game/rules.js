import { MOVES } from '../config/constants.js';

const WINS_AGAINST = Object.freeze({
  [MOVES.PUNCH]: MOVES.KICK,
  [MOVES.KICK]: MOVES.BLOCK,
  [MOVES.BLOCK]: MOVES.PUNCH
});

export function resolveRound(playerMove, cpuMove) {
  if (playerMove === MOVES.NONE) {
    return 'cpu';
  }

  if (playerMove === cpuMove) {
    return 'draw';
  }

  return WINS_AGAINST[playerMove] === cpuMove ? 'player' : 'cpu';
}

export function getWinningMove(move) {
  return WINS_AGAINST[move] ?? null;
}
