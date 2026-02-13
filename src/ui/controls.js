import { MOVES } from '../config/constants.js';
import { t } from '../i18n/index.js';

const CONTROL_MOVES = [MOVES.PUNCH, MOVES.KICK, MOVES.BLOCK];

export function renderControls(container, selectedMove) {
  container.innerHTML = CONTROL_MOVES.map(
    (move) => `<button class="btn btn-move ${selectedMove === move ? 'selected' : ''}" data-move="${move}">${t(`actions.${move}`)}</button>`
  ).join('');
}
