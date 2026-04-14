/**
 * Piano-like audio engine — synchronous design for maximum mobile compatibility.
 *
 * Mobile audio unlock strategy:
 *   1. unlock() MUST be called synchronously inside every user-gesture handler.
 *   2. It plays a 1-sample silent buffer (old iOS trick) and calls ctx.resume()
 *      fire-and-forget — what matters is that resume() is CALLED within the gesture.
 *   3. All note scheduling (playNote/playWrong) is then synchronous.
 *      Oscillators scheduled while the context is briefly suspended will
 *      play automatically once resume() completes (usually < 1 ms later).
 *
 * Signal chain:
 *   Oscillators → master gain (ADSR) → dryBus (72%) → compressor → output
 *                                     → wetBus  (28%) → reverb    → compressor
 */

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private dryBus: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private wetBus: GainNode | null = null;
  private chainReady = false;

  // ── Unlock (call synchronously in every user-gesture handler) ────────────

  unlock(): void {
    // 1. Create context
    if (!this.ctx) {
      try {
        const Ctx =
          window.AudioContext ??
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).webkitAudioContext;
        this.ctx = new Ctx() as AudioContext;
      } catch {
        return; // AudioContext unavailable — bail silently
      }
    }

    const ctx = this.ctx;

    // 2. Build signal chain on first call
    if (!this.chainReady) {
      this.buildChain(ctx);
      this.chainReady = true;
    }

    // 3. iOS silent-buffer trick: playing any sound (even silence) forces
    //    the audio graph to activate on older Safari versions.
    try {
      const silence = ctx.createBuffer(1, 1, ctx.sampleRate);
      const src = ctx.createBufferSource();
      src.buffer = silence;
      src.connect(ctx.destination);
      src.start(0);
      src.stop(0.001);
    } catch { /* ignore */ }

    // 4. Resume if suspended — fire-and-forget.
    //    Being CALLED within a user gesture is what satisfies the browser policy.
    if (ctx.state !== 'running') {
      ctx.resume().catch(() => {});
    }
  }

  // ── Signal chain ─────────────────────────────────────────────────────────

  private buildChain(ctx: AudioContext): void {
    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-20, 0);
    this.compressor.knee.setValueAtTime(30, 0);
    this.compressor.ratio.setValueAtTime(10, 0);
    this.compressor.attack.setValueAtTime(0.003, 0);
    this.compressor.release.setValueAtTime(0.2, 0);
    this.compressor.connect(ctx.destination);

    this.dryBus = ctx.createGain();
    this.dryBus.gain.value = 0.72;
    this.dryBus.connect(this.compressor);

    this.reverb = this.buildReverb(ctx);
    this.wetBus = ctx.createGain();
    this.wetBus.gain.value = 0.28;
    this.wetBus.connect(this.reverb);
    this.reverb.connect(this.compressor);
  }

  private buildReverb(ctx: AudioContext): ConvolverNode {
    const conv = ctx.createConvolver();
    const length = Math.floor(ctx.sampleRate * 1.6);
    const buf = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.8);
      }
    }
    conv.buffer = buf;
    return conv;
  }

  // ── Note playback (fully synchronous) ────────────────────────────────────

  playNote(frequency: number): void {
    if (!this.ctx || !this.chainReady) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const partials: Array<{ ratio: number; gain: number; decay: number }> = [
      { ratio: 1, gain: 1.00, decay: 2.4 },
      { ratio: 2, gain: 0.52, decay: 1.6 },
      { ratio: 3, gain: 0.30, decay: 1.1 },
      { ratio: 4, gain: 0.18, decay: 0.8 },
      { ratio: 5, gain: 0.10, decay: 0.6 },
      { ratio: 6, gain: 0.06, decay: 0.45 },
      { ratio: 7, gain: 0.03, decay: 0.35 },
    ];

    const ATTACK = 0.003;
    const PEAK = 0.50;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(PEAK, now + ATTACK);
    master.connect(this.dryBus!);
    master.connect(this.wetBus!);

    partials.forEach(({ ratio, gain, decay }) => {
      const osc = ctx.createOscillator();
      const og = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = frequency * ratio;
      og.gain.setValueAtTime(PEAK * gain, now + ATTACK);
      og.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      osc.connect(og);
      og.connect(master);
      osc.start(now);
      osc.stop(now + decay + 0.05);
    });

    // Percussive hammer thump
    try {
      const bufLen = Math.floor(ctx.sampleRate * 0.06);
      const nb = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d = nb.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
      const ns = ctx.createBufferSource();
      ns.buffer = nb;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = frequency;
      bp.Q.value = 0.8;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.06, now);
      ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
      ns.connect(bp);
      bp.connect(ng);
      ng.connect(this.dryBus!);
      ns.start(now);
      ns.stop(now + 0.07);
    } catch { /* ignore */ }
  }

  playWrong(): void {
    if (!this.ctx || !this.chainReady) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.18, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.connect(g);
    g.connect(this.compressor ?? ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playFanfare(): void {
    const steps = [
      { freq: 261.63, delay: 0 },
      { freq: 329.63, delay: 130 },
      { freq: 392.00, delay: 260 },
      { freq: 523.25, delay: 390 },
    ];
    steps.forEach(({ freq, delay }) => {
      setTimeout(() => this.playNote(freq), delay);
    });
  }
}
