import { MOVES } from '../config/constants.js';

const MOVE_CLASSES = ['move-punch', 'move-kick', 'move-block'];

function resetFighterClasses(node) {
  node.classList.remove('attack', 'hit', 'win', ...MOVE_CLASSES);
}

export function clearFighterAnimations(playerNode, cpuNode) {
  resetFighterClasses(playerNode);
  resetFighterClasses(cpuNode);
}

export function animateMoves(playerNode, cpuNode, playerMove, cpuMove) {
  clearFighterAnimations(playerNode, cpuNode);

  if (playerMove === MOVES.PUNCH) playerNode.classList.add('move-punch');
  if (playerMove === MOVES.KICK) playerNode.classList.add('move-kick');
  if (playerMove === MOVES.BLOCK) playerNode.classList.add('move-block');

  if (cpuMove === MOVES.PUNCH) cpuNode.classList.add('move-punch');
  if (cpuMove === MOVES.KICK) cpuNode.classList.add('move-kick');
  if (cpuMove === MOVES.BLOCK) cpuNode.classList.add('move-block');
}

export function animateResolve(playerNode, cpuNode, winner) {
  playerNode.classList.remove('hit', 'win');
  cpuNode.classList.remove('hit', 'win');

  playerNode.classList.add('attack');
  cpuNode.classList.add('attack');

  requestAnimationFrame(() => {
    if (winner === 'player') {
      playerNode.classList.add('win');
      cpuNode.classList.add('hit');
    } else if (winner === 'cpu') {
      cpuNode.classList.add('win');
      playerNode.classList.add('hit');
    }
  });
}
