export function animateResolve(playerNode, cpuNode, winner) {
  playerNode.classList.remove('attack', 'hit', 'win');
  cpuNode.classList.remove('attack', 'hit', 'win');

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
