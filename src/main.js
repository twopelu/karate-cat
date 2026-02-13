import { GameEngine } from './game/gameEngine.js';
import { AudioManager } from './audio/audioManager.js';
import { renderLayout } from './ui/screens.js';

const app = document.getElementById('app');

if (app) {
  renderLayout(app);
  const audio = new AudioManager();
  const game = new GameEngine(app, audio);
  game.bindEvents();
  game.toMenu();
}
