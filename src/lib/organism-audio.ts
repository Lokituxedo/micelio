import type { Voice } from "@/lib/mycelium";

type AudioCtor = typeof AudioContext;

function audioCtor(): AudioCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & { webkitAudioContext?: AudioCtor };
  return window.AudioContext ?? w.webkitAudioContext ?? null;
}

export class OrganismAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private oscs: OscillatorNode[] = [];
  private amps: GainNode[] = [];
  private running = false;
  private volume = 0.7;
  private generation = 0;

  unlock() {
    const ctx = this.ensure();
    if (ctx && ctx.state === "suspended") void ctx.resume();
  }

  isRunning() {
    return this.running;
  }

  private ensure() {
    if (this.ctx) return this.ctx;
    const AC = audioCtor();
    if (!AC) return null;
    const ctx = new AC({ latencyHint: "interactive" });
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.65;
    filter.connect(master);
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.3;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 130;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.ctx = ctx;
    this.master = master;
    this.filter = filter;
    this.lfo = lfo;
    return ctx;
  }

  private teardownOsc() {
    for (const osc of this.oscs) {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
      osc.disconnect();
    }
    for (const amp of this.amps) amp.disconnect();
    this.oscs = [];
    this.amps = [];
    this.running = false;
  }

  private targetGain() {
    return this.volume * this.volume * 0.28;
  }

  start(voice: Voice, volume: number) {
    const ctx = this.ensure();
    if (!ctx || !this.filter || !this.master) return;
    this.unlock();
    this.volume = volume;
    this.generation += 1;
    this.teardownOsc();
    const voices: Array<[OscillatorType, number, number, number]> = [
      ["sine", voice.hz / 2, 0.2, 0],
      ["sine", voice.hz, 0.36, 0],
      ["sine", voice.hz * voice.ratio, 0.16, voice.detune],
      ["triangle", voice.hz * 2, voice.partial, 0],
    ];
    for (const [type, freq, gain, detune] of voices) {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = detune;
      amp.gain.value = gain;
      osc.connect(amp);
      amp.connect(this.filter);
      osc.start();
      this.oscs.push(osc);
      this.amps.push(amp);
    }
    this.applyVoice(voice);
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setValueAtTime(Math.max(0, this.master.gain.value), ctx.currentTime);
    this.master.gain.setTargetAtTime(this.targetGain(), ctx.currentTime, 0.45);
    this.running = true;
  }

  retune(voice: Voice) {
    if (!this.running || !this.ctx) return;
    this.applyVoice(voice);
    const freqs = [voice.hz / 2, voice.hz, voice.hz * voice.ratio, voice.hz * 2];
    const t = this.ctx.currentTime;
    this.oscs.forEach((osc, i) => {
      const freq = freqs[i];
      if (freq === undefined) return;
      osc.frequency.setTargetAtTime(freq, t, 0.08);
    });
    if (this.oscs[2]) this.oscs[2].detune.setTargetAtTime(voice.detune, t, 0.08);
    if (this.amps[3]) this.amps[3].gain.setTargetAtTime(voice.partial, t, 0.08);
  }

  private applyVoice(voice: Voice) {
    if (!this.ctx || !this.filter || !this.lfo) return;
    const t = this.ctx.currentTime;
    this.filter.frequency.setTargetAtTime(voice.cutoff, t, 0.12);
    this.lfo.frequency.setTargetAtTime(voice.pulseHz, t, 0.12);
  }

  setVolume(volume: number) {
    this.volume = volume;
    if (!this.running || !this.ctx || !this.master) return;
    this.master.gain.setTargetAtTime(this.targetGain(), this.ctx.currentTime, 0.06);
  }

  stop() {
    if (!this.ctx || !this.master) {
      this.teardownOsc();
      return;
    }
    const gen = ++this.generation;
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.06);
    window.setTimeout(() => {
      if (this.generation !== gen) return;
      this.teardownOsc();
    }, 220);
  }
}
