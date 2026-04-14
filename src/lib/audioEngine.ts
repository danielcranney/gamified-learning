/**
 * Piano-like audio engine using Web Audio API.
 *
 * Signal chain:
 *   Oscillators (harmonics) → per-oscillator gains
 *     → master note gain (ADSR) → [dry 70%] → compressor → output
 *                                 [wet 30%] → reverb      → compressor → output
 *
 * Sound design:
 *   - 7 sine-wave partials (harmonics 1–7) to give a warm, piano-like timbre
 *   - Higher partials decay faster, mimicking struck string physics
 *   - Very fast 3 ms linear attack to avoid click artefacts
 *   - Exponential decay creates natural "piano roll-off"
 *   - Convolution reverb from exponentially-decaying noise impulse (1.6 s tail)
 *   - Dynamics compressor tames transient peaks and glues everything together
 */

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private reverb: ConvolverNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private reverbInput: GainNode | null = null;
  private dryBus: GainNode | null = null;

  /** Must be called inside a user-gesture handler to satisfy browser autoplay policy. */
  init(): void {
    if (this.ctx) {
      // Resume if suspended (iOS Safari suspends on page load)
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }

    this.ctx = new AudioContext();
    const ctx = this.ctx;

    // ── Output bus: compressor → destination ────────────────────────────────
    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-20, ctx.currentTime);
    this.compressor.knee.setValueAtTime(30, ctx.currentTime);
    this.compressor.ratio.setValueAtTime(10, ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, ctx.currentTime);
    this.compressor.release.setValueAtTime(0.2, ctx.currentTime);
    this.compressor.connect(ctx.destination);

    // ── Dry bus ─────────────────────────────────────────────────────────────
    this.dryBus = ctx.createGain();
    this.dryBus.gain.value = 0.72;
    this.dryBus.connect(this.compressor);

    // ── Reverb bus ──────────────────────────────────────────────────────────
    this.reverb = this.buildReverb(ctx);
    this.reverbInput = ctx.createGain();
    this.reverbInput.gain.value = 0.28;
    this.reverbInput.connect(this.reverb);
    this.reverb.connect(this.compressor);
  }

  // ── Impulse-response reverb (exponentially-decaying stereo noise) ────────
  private buildReverb(ctx: AudioContext): ConvolverNode {
    const conv = ctx.createConvolver();
    const duration = 1.6; // seconds
    const length = Math.floor(ctx.sampleRate * duration);
    const buf = ctx.createBuffer(2, length, ctx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        // Exponential decay envelope on white noise
        const decay = Math.pow(1 - i / length, 2.8);
        data[i] = (Math.random() * 2 - 1) * decay;
      }
    }
    conv.buffer = buf;
    return conv;
  }

  private getCtx(): AudioContext {
    if (!this.ctx) this.init();
    if (this.ctx!.state === 'suspended') this.ctx!.resume();
    return this.ctx!;
  }

  // ── Main note playback ───────────────────────────────────────────────────
  playNote(frequency: number): void {
    const ctx = this.getCtx();
    const now = ctx.currentTime;

    /**
     * Piano partial series.
     * Each entry: harmonic ratio, relative gain, and its own decay time.
     * Higher harmonics are quieter and decay much faster — this is the key
     * to a realistic struck-string timbre.
     */
    const partials: Array<{ ratio: number; gain: number; decay: number }> = [
      { ratio: 1,   gain: 1.00, decay: 2.4 },
      { ratio: 2,   gain: 0.52, decay: 1.6 },
      { ratio: 3,   gain: 0.30, decay: 1.1 },
      { ratio: 4,   gain: 0.18, decay: 0.8 },
      { ratio: 5,   gain: 0.10, decay: 0.6 },
      { ratio: 6,   gain: 0.06, decay: 0.45 },
      { ratio: 7,   gain: 0.03, decay: 0.35 },
    ];

    const ATTACK = 0.003; // 3 ms — fast but artefact-free
    const MASTER_PEAK = 0.48; // keep headroom for the compressor

    // Master ADSR gain node
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(MASTER_PEAK, now + ATTACK);
    // Let individual partial decays drive the natural tail instead of a hard release

    master.connect(this.dryBus!);
    master.connect(this.reverbInput!);

    partials.forEach(({ ratio, gain, decay }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = frequency * ratio;

      // Each partial: instant peak then exponential decay
      oscGain.gain.setValueAtTime(MASTER_PEAK * gain, now + ATTACK);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(oscGain);
      oscGain.connect(master);

      osc.start(now);
      osc.stop(now + decay + 0.05);
    });

    // Small percussive "hammer" thump — adds the attack transient that piano samples have
    this.playHammerNoise(ctx, now, frequency);
  }

  // ── Hammer strike transient (filtered noise burst) ───────────────────────
  private playHammerNoise(
    ctx: AudioContext,
    now: number,
    frequency: number,
  ): void {
    const bufLen = Math.floor(ctx.sampleRate * 0.06); // 60 ms
    const noiseBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;

    // Band-pass around the note frequency to colour the thump
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

  // ── Wrong-note indicator: gentle descending sine glide ───────────────────
  playWrong(): void {
    const ctx = this.getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);

    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.16, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(g);
    g.connect(this.compressor!);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // ── Completion fanfare: ascending C-major arpeggio ────────────────────────
  playFanfare(): void {
    // C4 – E4 – G4 – C5 with slight velocity increase on each note
    const steps = [
      { freq: 261.63, delay: 0,   vol: 0.8 },
      { freq: 329.63, delay: 130, vol: 0.85 },
      { freq: 392.00, delay: 260, vol: 0.9 },
      { freq: 523.25, delay: 390, vol: 1.0 },
    ];

    steps.forEach(({ freq, delay, vol }) => {
      setTimeout(() => {
        const ctx = this.getCtx();
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

  get ready(): boolean {
    return this.ctx !== null;
  }
}
