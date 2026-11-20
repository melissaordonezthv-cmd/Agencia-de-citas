let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextCtor) {
      audioCtx = new AudioContextCtor();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  gainPeak = 0.08,
  delay = 0
) {
  const ctx = getCtx();
  if (!ctx) return;

  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainPeak, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export const sfx = {
  click(enabled: boolean) {
    if (!enabled) return;
    playTone(540, 0.06, "triangle", 0.05);
  },
  heart(enabled: boolean) {
    if (!enabled) return;
    playTone(587.33, 0.11, "sine", 0.07, 0);
    playTone(783.99, 0.14, "sine", 0.08, 0.07);
    playTone(987.77, 0.2, "sine", 0.07, 0.14);
  },
  gift(enabled: boolean) {
    if (!enabled) return;
    playTone(523.25, 0.09, "triangle", 0.07, 0);
    playTone(659.25, 0.09, "triangle", 0.07, 0.07);
    playTone(783.99, 0.12, "triangle", 0.08, 0.14);
    playTone(1046.5, 0.24, "sine", 0.08, 0.21);
  },
  message(enabled: boolean) {
    if (!enabled) return;
    playTone(880, 0.08, "sine", 0.06, 0);
    playTone(1174.66, 0.14, "sine", 0.06, 0.06);
  },
  shutter(enabled: boolean) {
    if (!enabled) return;
    playTone(1200, 0.04, "square", 0.04, 0);
    playTone(420, 0.07, "triangle", 0.05, 0.04);
  },
  breakup(enabled: boolean) {
    if (!enabled) return;
    playTone(349.23, 0.18, "sawtooth", 0.05, 0);
    playTone(293.66, 0.22, "sawtooth", 0.05, 0.16);
    playTone(220, 0.35, "sine", 0.06, 0.34);
  },
  conquest(enabled: boolean) {
    if (!enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((n, idx) => playTone(n, 0.24, "sine", 0.08, idx * 0.09));
  },
};
