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
    const leadOsc = this.ctx.createOscillator();
    const bassOsc = this.ctx.createOscillator();
    const leadGain = this.ctx.createGain();
    const bassGain = this.ctx.createGain();

    leadOsc.type = 'square';
    bassOsc.type = 'triangle';
    leadGain.gain.value = 0;
    bassGain.gain.value = 0;

    leadOsc.connect(leadGain);
    bassOsc.connect(bassGain);
    leadGain.connect(this.master);
    bassGain.connect(this.master);

    // Pentatonic / minor-flavored loop inspired by classic arcade fighters.
    const leadPattern = [
      523.25, 587.33, 659.25, 783.99,
      659.25, 587.33, 523.25, 493.88,
      523.25, 587.33, 659.25, 698.46,
      783.99, 659.25, 587.33, 523.25,
    ];
    const bassPattern = [
      130.81, 130.81, 146.83, 146.83,
      164.81, 164.81, 146.83, 146.83,
      130.81, 130.81, 146.83, 146.83,
      196.00, 196.00, 174.61, 174.61,
    ];

    const stepLength = 0.16;
    let step = 0;
    leadOsc.start();
    bassOsc.start();

    const tick = () => {
      if (!this.bgmOsc) return;

      const now = this.ctx.currentTime;
      const leadFreq = leadPattern[step % leadPattern.length];
      const bassFreq = bassPattern[step % bassPattern.length];

      leadOsc.frequency.setValueAtTime(leadFreq, now);
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      leadGain.gain.cancelScheduledValues(now);
      leadGain.gain.setValueAtTime(0.0001, now);
      leadGain.gain.linearRampToValueAtTime(0.05, now + 0.01);
      leadGain.gain.exponentialRampToValueAtTime(0.0001, now + stepLength * 0.9);

      bassGain.gain.cancelScheduledValues(now);
      bassGain.gain.setValueAtTime(0.0001, now);
      bassGain.gain.linearRampToValueAtTime(0.03, now + 0.01);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + stepLength * 0.95);

      step += 1;
    };

    tick();
    const interval = setInterval(tick, stepLength * 1000);
    this.bgmOsc = { leadOsc, bassOsc, leadGain, bassGain, interval };
  }

  stopBgm() {
    if (!this.bgmOsc) return;
    clearInterval(this.bgmOsc.interval);
    this.bgmOsc.leadOsc.stop();
    this.bgmOsc.bassOsc.stop();
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
