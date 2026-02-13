import { MOVES } from '../config/constants.js';
import { randomInt } from '../utils/random.js';

const CPU_MOVES = [MOVES.PUNCH, MOVES.KICK, MOVES.BLOCK];

export function pickCpuMove() {
  return CPU_MOVES[randomInt(0, CPU_MOVES.length - 1)];
}
