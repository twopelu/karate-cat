export const MOVES = Object.freeze({
  PUNCH: 'punch',
  KICK: 'kick',
  BLOCK: 'block',
  NONE: 'none'
});

export const GAME_STATES = Object.freeze({
  MENU: 'menu',
  ROUND_START: 'roundStart',
  COUNTDOWN: 'countdown',
  LOCK_CHOICES: 'lockChoices',
  RESOLVE_ACTIONS: 'resolveActions',
  SHOW_ROUND_RESULT: 'showRoundResult',
  CHECK_MATCH_END: 'checkMatchEnd',
  SHOW_MATCH_RESULT: 'showMatchResult'
});

export const MATCH_CONFIG = Object.freeze({
  roundsToWin: 2,
  countdownSeconds: 3,
  resolveDelayMs: 550,
  roundResultDelayMs: 1300
});
