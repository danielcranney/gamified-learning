/**
 * Piano-like audio engine using Web Audio API.
 *
 * Mobile fix: AudioContext can start in 'suspended' on iOS/Android.
 * Every public method calls ensureRunning() which awaits ctx.resume()
 * before scheduling any audio events, guaranteeing the context is live.
 *
 * Signal chain:
 *   Oscillators → master gain (ADSR) → dryBus (0.72) → compressor → output
 *                                    → reverbInput (0.28) → reverb → compressor
 */

type AnyAudioContext = typeof AudioContext;

function createNativeContext(): AudioContext {
  const Ctx: AnyAudioContext =
    window.AudioContext ?? (window as unknown as { webkitAudioContext: AnyAudioContext }).webkitAudioContext;
  return new Ctx();
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private reverb: ConvolverNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private reverbInput: GainNode | null = null;
  private dryBus: GainNode | null = null;
  private chainReady = false;

  // ── Context lifecycle ────────────────────────────────────────────────────

  /**
   * Creates the AudioContext (if needed) and waits until it is 'running'.
   * Must be called — directly or transitively — inside a user-gesture handler.
   */
  private async ensureRunning(): Promise<AudioContext> {
    if (!this.ctx) {
      this.ctx = createNativeContext();
    }

    if (this.ctx.state !== 'running') {
      try {
        await this.ctx.resume();
      } catch {
        // Ignore — best-effort resume
      }
    }

    // Build the signal chain once the context is alive
    if (!this.chainReady) {
      this.buildChain(this.ctx);
      this.chainReady = true;
    }

    return this.ctx;
  }

  /** Optional: call inside a pointer-down handler to pre-warm the context. */
  init(): void {
    void this.ensureRunning();
  }

  // ── Signal chain setup ───────────────────────────────────────────────────

  private buildChain(ctx: AudioContext): void {
    // Output compressor
    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-20, ctx.currentTime);
    this.compressor.knee.setValueAtTime(30, ctx.currentTime);
    this.compressor.ratio.setValueAtTime(10, ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, ctx.currentTime);
    this.compressor.release.setValueAtTime(0.2, ctx.currentTime);
    this.compressor.connect(ctx.destination);

    // Dry bus (70 %)
    this.dryBus = ctx.createGain();
    this.dryBus.gain.value = 0.72;
    this.dryBus.connect(this.compressor);

    // Reverb bus (30 %)
    this.reverb = this.buildReverb(ctx);
    this.reverbInput = ctx.createGain();
    this.reverbInput.gain.value = 0.28;
    this.reverbInput.connect(this.reverb);
    this.reverb.connect(this.compressor);
  }

  private buildReverb(ctx: AudioContext): ConvolverNode {
    const conv = ctx.createConvolver();
    const duration = 1.6;
    const length = Math.floor(ctx.sampleRate * duration);
    const buf = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.8);
      }
    }
    conv.buffer = buf;
    return conv;
  }

  // ── Note playback ────────────────────────────────────────────────────────

  async playNote(frequency: number): Promise<void> {
    const ctx = await this.ensureRunning();
    const now = ctx.currentTime;

    /**
     * Partial series: sine waves at harmonics 1–7 with decreasing amplitude
     * and faster decay for higher harmonics — mimics struck-string physics.
     */
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
    master.connect(this.reverbInput!);

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

    // Short percussive noise burst for the "hammer" attack transient
    this.scheduleHammerNoise(ctx, now, frequency);
  }

  private scheduleHammerNoise(
    ctx: AudioContext,
    now: number,
    frequency: number,
  ): void {
    const bufLen = Math.floor(ctx.sampleRate * 0.06);
    const noiseBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = frequency;
    bp.Q.value = 0.8;

    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.06, now);
    ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    noise.connect(bp);
    bp.connect(ng);
    ng.connect(this.dryBus!);

    noise.start(now);
    noise.stop(now + 0.07);
  }

  // ── Error / fanfare sounds ────────────────────────────────────────────────

  async playWrong(): Promise<void> {
    const ctx = await this.ensureRunning();
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
      { freq: 261.63, delay: 0,   vol: 0.80 },
      { freq: 329.63, delay: 130, vol: 0.85 },
      { freq: 392.00, delay: 260, vol: 0.90 },
      { freq: 523.25, delay: 390, vol: 1.00 },
    ];

    steps.forEach(({ freq, delay, vol }) => {
      setTimeout(async () => {
        const ctx = await this.ensureRunning();
        const now = ctx.currentTime;

        const partials = [
          { ratio: 1, gain: 1.00, decay: 1.8 },
          { ratio: 2, gain: 0.45, decay: 1.2 },
          { ratio: 3, gain: 0.22, decay: 0.8 },
          { ratio: 4, gain: 0.10, decay: 0.55 },
        ];

        const master = ctx.createGain();
        master.gain.setValueAtTime(0, now);
        master.gain.linearRampToValueAtTime(0.52 * vol, now + 0.003);
        master.connect(this.dryBus!);
        master.connect(this.reverbInput!);

        partials.forEach(({ ratio, gain, decay }) => {
          const osc = ctx.createOscillator();
          const og = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq * ratio;
          og.gain.setValueAtTime(0.52 * vol * gain, now + 0.003);
          og.gain.exponentialRampToValueAtTime(0.0001, now + decay);
          osc.connect(og);
          og.connect(master);
          osc.start(now);
          osc.stop(now + decay + 0.05);
        });
      }, delay);
    });
  }
}
