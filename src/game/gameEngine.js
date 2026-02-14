import { GAME_STATES, MATCH_CONFIG, MOVES } from '../config/constants.js';
import { pickCpuMove } from './ai.js';
import { initialState, resetMatch, resetRound } from './gameState.js';
import { resolveRound } from './rules.js';
import { createCountdown } from './timer.js';
import { renderHud } from '../ui/hud.js';
import { renderControls } from '../ui/controls.js';
import { animateMoves, animateResolve, clearFighterAnimations } from '../ui/animations.js';
import { switchScreen } from '../ui/screens.js';
import { t } from '../i18n/index.js';

export class GameEngine {
  constructor(root, audio) {
    this.root = root;
    this.audio = audio;
    this.state = initialState();
    this.stopCountdown = null;

    this.hudEl = root.querySelector('.hud');
    this.controlsEl = root.querySelector('.controls');
    this.countdownEl = root.querySelector('[data-countdown]');
    this.statusEl = root.querySelector('[data-status]');
    this.playerLabelEl = root.querySelector('[data-move-label="player"]');
    this.cpuLabelEl = root.querySelector('[data-move-label="cpu"]');
    this.playerFighterEl = root.querySelector('[data-fighter="player"]');
    this.cpuFighterEl = root.querySelector('[data-fighter="cpu"]');
    this.resultTitleEl = root.querySelector('[data-result-title]');
    this.resultScoreEl = root.querySelector('[data-result-score]');
  }

  bindEvents() {
    this.root.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.dataset.action === 'play') {
        this.audio.ensureReady();
        this.audio.sfxClick();
        this.audio.startBgm();
        this.startMatch();
      }

      if (target.dataset.action === 'toggle-sound') {
        this.audio.ensureReady();
        const muted = this.audio.toggleMuted();
        this.state.muted = muted;
        target.classList.toggle('is-muted', muted);
      }

      if (target.dataset.action === 'rematch') {
        this.audio.sfxClick();
        this.startMatch();
      }

      if (target.dataset.action === 'back-menu') {
        this.audio.sfxClick();
        this.toMenu();
      }

      const move = target.dataset.move;
      if (move && this.state.gameState === GAME_STATES.COUNTDOWN) {
        this.selectMove(move);
      }
    });
  }

  render() {
    renderHud(this.hudEl, this.state);
    renderControls(this.controlsEl, this.state.playerMove);

    this.countdownEl.textContent = this.state.gameState === GAME_STATES.COUNTDOWN ? `${this.state.countdown}` : '';
    this.statusEl.textContent = t(this.state.messageKey);
    this.playerLabelEl.textContent = this.state.playerMove === MOVES.NONE ? '' : t(`actions.${this.state.playerMove}`);
    this.cpuLabelEl.textContent = this.state.cpuMove === MOVES.NONE ? '' : t(`actions.${this.state.cpuMove}`);

    const soundButton = this.root.querySelector('[data-action="toggle-sound"]');
    soundButton?.classList.toggle('is-muted', this.state.muted);
  }

  toMenu() {
    if (this.stopCountdown) this.stopCountdown();
    resetMatch(this.state);
    this.state.muted = this.audio.muted;
    switchScreen(this.root, 'menu');
    clearFighterAnimations(this.playerFighterEl, this.cpuFighterEl);
    this.render();
  }

  startMatch() {
    if (this.stopCountdown) this.stopCountdown();
    resetMatch(this.state);
    this.state.muted = this.audio.muted;
    this.state.gameState = GAME_STATES.ROUND_START;
    switchScreen(this.root, 'game');
    this.startRound();
  }

  startRound() {
    resetRound(this.state);
    this.state.gameState = GAME_STATES.COUNTDOWN;
    clearFighterAnimations(this.playerFighterEl, this.cpuFighterEl);
    this.render();

    this.stopCountdown = createCountdown(
      MATCH_CONFIG.countdownSeconds,
      (remaining) => {
        this.state.countdown = remaining;
        this.audio.sfxCountdown();
        this.render();
      },
      () => this.lockChoices()
    );
  }

  selectMove(move) {
    this.audio.sfxClick();
    this.state.playerMove = move;
    this.render();
  }

  lockChoices() {
    this.state.gameState = GAME_STATES.LOCK_CHOICES;
    this.state.cpuMove = pickCpuMove();
    if (this.state.playerMove === MOVES.NONE) {
      this.state.messageKey = 'status.autoLose';
    } else {
      this.state.messageKey = 'status.locked';
    }
    this.render();
    animateMoves(this.playerFighterEl, this.cpuFighterEl, this.state.playerMove, this.state.cpuMove);
    setTimeout(() => this.resolveActions(), 180);
  }

  resolveActions() {
    this.state.gameState = GAME_STATES.RESOLVE_ACTIONS;
    const winner = resolveRound(this.state.playerMove, this.state.cpuMove);
    this.state.roundWinner = winner;

    animateResolve(this.playerFighterEl, this.cpuFighterEl, winner);

    if (winner === 'player') {
      this.state.score.player += 1;
      this.state.messageKey = 'result.winRound';
      this.audio.sfxHit();
      this.audio.sfxWin();
    } else if (winner === 'cpu') {
      this.state.score.cpu += 1;
      this.state.messageKey = 'result.loseRound';
      this.audio.sfxHit();
      this.audio.sfxLose();
    } else {
      this.state.messageKey = 'result.draw';
      this.audio.sfxClick();
    }

    this.render();
    setTimeout(() => this.afterRound(), MATCH_CONFIG.resolveDelayMs + MATCH_CONFIG.roundResultDelayMs);
  }

  afterRound() {
    this.state.gameState = GAME_STATES.CHECK_MATCH_END;
    if (this.state.score.player >= MATCH_CONFIG.roundsToWin) {
      this.finishMatch('player');
      return;
    }
    if (this.state.score.cpu >= MATCH_CONFIG.roundsToWin) {
      this.finishMatch('cpu');
      return;
    }
    this.state.round += 1;
    this.startRound();
  }

  finishMatch(winner) {
    this.state.gameState = GAME_STATES.SHOW_MATCH_RESULT;
    this.state.matchWinner = winner;
    this.resultTitleEl.textContent = winner === 'player' ? t('result.playerChampion') : t('result.cpuChampion');
    this.resultScoreEl.textContent = `${t('hud.player')} ${this.state.score.player} - ${this.state.score.cpu} ${t('hud.cpu')}`;
    switchScreen(this.root, 'result');
  }
}
