import { t } from '../i18n/index.js';

export function renderHud(container, state) {
  container.innerHTML = `
    <div class="hud-item">${t('hud.round')}: ${state.round}</div>
    <div class="hud-item">${t('hud.score')}: ${t('hud.player')} ${state.score.player} - ${state.score.cpu} ${t('hud.cpu')}</div>
  `;
}
