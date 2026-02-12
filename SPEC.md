# SPEC — Karate Cat (Vanilla JS, Mobile Android Browser)

## 1) Objetivo del proyecto
Construir un juego web 2D ligero, en **vanilla JavaScript**, jugable en navegadores Android modernos (Chrome/Chromium), con estética retro 8-bit y mecánica inspirada en Piedra-Papel-Tijera.

- Tema: gatos karatekas.
- Movimientos: **Puño**, **Patada**, **Bloqueo**.
- Flujo: partidas al **mejor de 3 rondas**.
- Cada ronda: cuenta atrás de **3 segundos** para que el jugador elija movimiento.
- Requisitos UX: controles táctiles claros, feedback visual/sonoro inmediato, rendimiento estable en móviles de gama baja.

---

## 2) Mecánica de juego (reglas funcionales)

### 2.1 Relación de ventaja entre movimientos
Se define un ciclo fijo tipo RPS:
- **Puño vence a Patada**
- **Bloqueo vence a Puño**
- **Patada vence a Bloqueo**
- Mismo movimiento vs mismo movimiento = **Empate**

### 2.2 Estructura de partida
- La partida finaliza cuando uno de los jugadores gana **2 rondas**.
- Ronda:
  1. Estado `countdown` (3 → 2 → 1).
  2. El jugador puede seleccionar 1 de 3 movimientos (tap).
  3. Al terminar el tiempo, la IA confirma su elección.
  4. Estado `resolve`: animación de ejecución + cálculo de resultado.
  5. Estado `result`: mostrar ganador de ronda y marcador acumulado.
  6. Si no hay campeón, iniciar siguiente ronda.

### 2.3 Comportamiento por inacción
Si el jugador no pulsa ningún botón antes de llegar a 0:
- Se aplica **derrota automática de ronda** para el jugador.

---

## 3) Alcance (MVP)

### Incluido
- Pantalla de inicio (logo + botón “Jugar”).
- Pantalla de combate con:
  - HUD (ronda, marcador, contador).
  - Escenario retro estático o con animación mínima.
  - Dos personajes (jugador e IA) con animaciones simples por movimiento.
  - Botones táctiles (Puño/Patada/Bloqueo).
- Lógica completa de rondas y mejor de 3.
- Sonidos SFX (click, countdown, impacto, victoria/derrota).
- Música de fondo estilo 8-bit en bucle con control de mute.
- Pantalla de fin de partida + botón “Revancha”.

### Excluido (post-MVP)
- Modo multijugador online.
- Sistema de progreso/cosméticos.
- Rankings en backend.
- Localización multi-idioma completa (traducciones y selector de idioma en UI).
- **Sí incluido en MVP técnico:** base preparada para i18n mediante labels centralizados por clave.

---

## 4) Requisitos no funcionales

### 4.1 Rendimiento en Android gama baja
- Objetivo mínimo: sensación fluida en dispositivos 30 FPS+.
- Reducir trabajo por frame:
  - Animaciones simples (sprite swaps / CSS transform).
  - Evitar layouts/reflows innecesarios.
  - Uso moderado de partículas/efectos.
- Audio comprimido y de baja latencia.

### 4.2 Compatibilidad
- Navegadores objetivo: Chrome Android (últimas 2-3 versiones).
- Diseño responsive prioritario para orientación horizontal (landscape).
- Soporte portrait fuera de alcance del MVP inicial.

### 4.3 Accesibilidad básica
- Botones grandes (mín. ~48px táctiles).
- Contraste suficiente en HUD.
- Feedback visual adicional al sonoro (texto/iconos de resultado).

---

## 5) Arquitectura técnica propuesta

### 5.1 Stack
- HTML5 + CSS3 + JavaScript ES Modules (sin framework).
- Render principal recomendado: **DOM + CSS animations/transforms** para simplicidad.
  - Canvas puede evaluarse si la fase de animación escala mucho.
- Assets locales versionados en repo.

### 5.2 Estructura de carpetas
```text
/ (raíz)
  index.html
  /src
    main.js
    game/
      gameEngine.js
      gameState.js
      rules.js
      ai.js
      timer.js
    ui/
      screens.js
      hud.js
      controls.js
      animations.js
    audio/
      audioManager.js
    config/
      constants.js
    utils/
      random.js
      events.js
  /assets
    /sprites
      cat_player_*.png
      cat_enemy_*.png
      effects_*.png
    /audio
      bgm_8bit_loop.ogg
      sfx_click.ogg
      sfx_hit.ogg
      sfx_win.ogg
      sfx_lose.ogg
  /styles
    base.css
    game.css
    retro-theme.css
  SPEC.md
```

### 5.3 Módulos clave
- `gameState.js`: máquina de estados (`menu`, `countdown`, `resolve`, `roundResult`, `matchResult`).
- `rules.js`: reglas de victoria entre movimientos.
- `ai.js`: selección de movimiento de CPU (aleatoria en MVP, con pesos opcionales).
- `timer.js`: countdown robusto (setInterval + corrección por timestamp).
- `audioManager.js`: reproducción BGM/SFX, mute global, cumplimiento de restricciones autoplay móvil.
- `animations.js`: aplicación de clases CSS para animaciones por acción/resultado.

### 5.4 Preparación I18N (labels)
- Todo texto de UI debe consumirse desde un diccionario de labels por clave (sin strings hardcodeados en componentes).
- Estructura sugerida:
  - `src/i18n/labels/en-US.js` (idioma activo MVP)
  - `src/i18n/labels/es-ES.js` (placeholder opcional para validar estructura)
  - `src/i18n/index.js` con `t(key)` para resolver labels.
- En MVP, el idioma activo será `en-US`, pero la arquitectura debe permitir añadir nuevos idiomas sin tocar lógica de juego.
- Claves recomendadas: `menu.play`, `hud.round`, `hud.score`, `result.winRound`, `result.loseRound`, `result.draw`, `actions.punch`, `actions.kick`, `actions.block`.

---

## 6) Diseño de estados y flujo

### 6.1 Máquina de estados
1. `menu`
2. `roundStart`
3. `countdown`
4. `lockChoices`
5. `resolveActions`
6. `showRoundResult`
7. `checkMatchEnd`
8. `showMatchResult`
9. `restart`

### 6.2 Eventos de dominio
- `PLAYER_MOVE_SELECTED`
- `COUNTDOWN_TICK`
- `COUNTDOWN_END`
- `ROUND_RESOLVED`
- `MATCH_FINISHED`
- `RESTART_REQUESTED`

Estos eventos desacoplan lógica de juego y UI para facilitar mantenimiento.

---

## 7) UI/UX retro (rendimiento-first)

### 7.1 Dirección artística
- Paleta limitada (inspiración 8/16-bit).
- Tipografía pixel para títulos/HUD.
- Sprites pequeños y nítidos (`image-rendering: pixelated`).
- Animaciones cortas (120–300ms) en ciclos simples.

### 7.2 Pantallas
- **Inicio**: logo, botón jugar, toggle sonido.
- **Combate**:
  - Parte superior: marcador (Jugador vs CPU), ronda actual.
  - Centro: personajes y efecto de impacto.
  - Inferior: botones táctiles grandes.
  - Overlay: cuenta atrás visible.
- **Resultado**: mensaje final + revancha + volver a inicio.

### 7.3 Feedback
- Visual: highlight del movimiento elegido.
- Sonoro: confirmación al elegir, impacto al resolver.
- Resultado textual breve: “¡Ganaste la ronda!”, “Empate”, etc.

---

## 8) Audio y música 8-bit

### 8.1 Estrategia
- Usar `HTMLAudioElement` para MVP (simple y suficiente).
- Inicializar audio tras primera interacción del usuario (restricción móvil).
- BGM en loop con volumen bajo por defecto.
- SFX cortos (<500ms ideal).

### 8.2 Recomendaciones de formato
- Preferencia: `.ogg` con fallback `.mp3` si se requiere.
- Normalización de volumen para evitar saltos bruscos.

---

## 9) Plan de implementación por fases

### Fase 1 — Base jugable
1. Setup estructura y módulos.
2. Implementar máquina de estados.
3. Reglas de combate + marcador mejor de 3.
4. UI mínima funcional (sin arte final).

### Fase 2 — Presentación y controles
1. Estilado retro base.
2. Botones táctiles optimizados.
3. Animaciones simples de movimiento e impacto.
4. Countdown con feedback claro.

### Fase 3 — Audio y pulido
1. Integrar BGM + SFX.
2. Mute persistente en sesión local.
3. Ajustes de timings (entrada/animación/resultados).
4. Mejoras de legibilidad y contraste.

### Fase 4 — QA móvil
1. Pruebas en viewport Android común (360x800, 412x915).
2. Verificación de interacción táctil y latencia.
3. Ajustes de rendimiento y tamaño de assets.

---

## 10) Estrategia de testing

### 10.1 Manual funcional
- Validar todas las transiciones de estado.
- Verificar reglas de victoria para todas las combinaciones.
- Confirmar finalización correcta al mejor de 3.
- Comprobar comportamiento sin input de jugador.

### 10.2 Checks técnicos
- Sin errores en consola.
- Medición simple de frame pacing en dispositivos objetivo.
- Verificación de reproducción de audio tras interacción inicial.

### 10.3 Regresión mínima
- Script simple de pruebas unitarias para `rules.js` (opcional pero recomendado).

---

## 11) Riesgos y mitigaciones
- **Riesgo:** animaciones pesadas degradan FPS.  
  **Mitigación:** reducir frames/sprites y usar transforms.
- **Riesgo:** autoplay audio bloqueado en móvil.  
  **Mitigación:** inicializar audio al primer tap.
- **Riesgo:** hitboxes táctiles pequeñas.  
  **Mitigación:** botones grandes y separación suficiente.

---

## 12) Criterios de aceptación (MVP)
1. El juego corre en navegador Android sin instalación adicional.
2. El usuario puede jugar una partida completa al mejor de 3.
3. Cada ronda incluye countdown de 3 segundos funcional.
4. Reglas de Puño/Patada/Bloqueo se aplican correctamente.
5. Existen sonidos de efectos y música 8-bit con opción de mute.
6. La interfaz es usable en pantalla móvil y mantiene estética retro.

---

## 13) Decisiones cerradas antes de implementación
1. **Regla por inacción:** derrota automática de ronda para el jugador.
2. **Estilo visual MVP:** sprites propios minimalistas.
3. **Audio de desarrollo:** uso de assets libres temporales.
4. **Orientación oficial:** modo horizontal (landscape) únicamente.
5. **Idioma UI:** inglés (USA) en esta primera versión.

---

## 14) Próximo paso
Iniciar la implementación incremental del MVP respetando esta arquitectura y las decisiones cerradas anteriores.
