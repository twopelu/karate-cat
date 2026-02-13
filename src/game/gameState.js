import { GAME_STATES, MATCH_CONFIG, MOVES } from '../config/constants.js';

export function initialState() {
  return {
    gameState: GAME_STATES.MENU,
    round: 1,
    score: { player: 0, cpu: 0 },
    countdown: MATCH_CONFIG.countdownSeconds,
    playerMove: MOVES.NONE,
    cpuMove: MOVES.NONE,
    roundWinner: null,
    matchWinner: null,
    messageKey: 'status.pickMove',
    muted: false
  };
}

export function resetRound(runtimeState) {
  runtimeState.countdown = MATCH_CONFIG.countdownSeconds;
  runtimeState.playerMove = MOVES.NONE;
  runtimeState.cpuMove = MOVES.NONE;
  runtimeState.roundWinner = null;
  runtimeState.messageKey = 'status.pickMove';
}

export function resetMatch(runtimeState) {
  const state = initialState();
  Object.assign(runtimeState, state);
}
