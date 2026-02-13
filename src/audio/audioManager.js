const MUTE_KEY = 'karate-cat-muted';

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.bgmOsc = null;
    this.muted = sessionStorage.getItem(MUTE_KEY) === '1';
    this.isReady = false;
  }

  init() {
    if (this.isReady) return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.15;
    this.master.connect(this.ctx.destination);
    this.isReady = true;
  }

  setMuted(muted) {
    this.muted = muted;
    sessionStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    if (this.master) {
      this.master.gain.value = muted ? 0 : 0.15;
    }
  }

  toggleMuted() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  ensureReady() {
    if (!this.isReady) {
      this.init();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(frequency, duration = 0.12, type = 'square', gain = 0.07) {
    if (!this.isReady || this.muted) return;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    env.gain.value = gain;
    osc.connect(env);
    env.connect(this.master);
    const now = this.ctx.currentTime;
    env.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  }

  startBgm() {
    if (!this.isReady || this.bgmOsc) return;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const bgmGain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 180;
    lfo.type = 'triangle';
    lfo.frequency.value = 2;
    lfoGain.gain.value = 12;
    bgmGain.gain.value = 0.05;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(bgmGain);
    bgmGain.connect(this.master);
    osc.start();
    lfo.start();
    this.bgmOsc = { osc, lfo, bgmGain };
  }

  stopBgm() {
    if (!this.bgmOsc) return;
    this.bgmOsc.osc.stop();
    this.bgmOsc.lfo.stop();
    this.bgmOsc = null;
  }

  sfxClick() {
    this.playTone(520, 0.06, 'square', 0.05);
  }

  sfxCountdown() {
    this.playTone(260, 0.09, 'square', 0.06);
  }

  sfxHit() {
    this.playTone(120, 0.15, 'sawtooth', 0.08);
  }

  sfxWin() {
    this.playTone(660, 0.12, 'triangle', 0.08);
    setTimeout(() => this.playTone(880, 0.12, 'triangle', 0.08), 70);
  }

  sfxLose() {
    this.playTone(220, 0.18, 'sawtooth', 0.07);
  }
}
