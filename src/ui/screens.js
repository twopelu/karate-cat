import { t } from '../i18n/index.js';

export function renderLayout(root) {
  root.innerHTML = `
    <section class="screen menu-screen" data-screen="menu">
      <h1 class="logo">${t('menu.title')}</h1>
      <p class="tagline">${t('menu.subtitle')}</p>
      <button class="btn btn-primary" data-action="play">${t('menu.play')}</button>
    </section>

    <section class="screen game-screen hidden" data-screen="game">
      <header class="hud"></header>
      <main class="arena">
        <div class="fighter fighter-player" data-fighter="player">
          <div class="cat cat-player"></div>
          <p class="move-label" data-move-label="player"></p>
        </div>
        <div class="overlay">
          <div class="countdown" data-countdown></div>
          <div class="status" data-status></div>
        </div>
        <div class="fighter fighter-cpu" data-fighter="cpu">
          <div class="cat cat-cpu"></div>
          <p class="move-label" data-move-label="cpu"></p>
        </div>
      </main>
      <footer class="controls"></footer>
    </section>

    <section class="screen result-screen hidden" data-screen="result">
      <h2 data-result-title></h2>
      <p data-result-score></p>
      <div class="actions">
        <button class="btn btn-primary" data-action="rematch">${t('result.rematch')}</button>
        <button class="btn" data-action="back-menu">${t('result.backMenu')}</button>
      </div>
    </section>

    <button class="btn btn-sound" data-action="toggle-sound">${t('menu.sound')}</button>
  `;
}

export function switchScreen(root, screenName) {
  const screens = root.querySelectorAll('[data-screen]');
  screens.forEach((screen) => {
    screen.classList.toggle('hidden', screen.dataset.screen !== screenName);
  });
}
