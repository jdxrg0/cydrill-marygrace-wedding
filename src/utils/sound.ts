import { weddingConfig } from '../config/weddingConfig';

/**
 * Wedding Music & Synced Lyrics Audio Manager
 * Plays "Goodness of God" (Piano & Cello Instrumental) (/audio/goodness-of-god-piano-cello.mp3)
 * with smooth volume fade-in, live playback timestamp tracking, and iOS gesture support.
 */

type TimeUpdateListener = (currentTime: number, duration: number) => void;

class WeddingMusicManager {
  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private fadeIntervalId: number | null = null;
  private syncIntervalId: number | null = null;
  private fallbackIntervalId: number | null = null;
  private step = 0;
  private fallbackStartTime = 0;
  private fallbackElapsed = 0;
  private listeners: Set<TimeUpdateListener> = new Set();

  // Fallback acoustic chord progression if audio file ever fails to load
  private chords = [
    [174.61, 220.0, 261.63, 329.63, 349.23, 440.0],
    [164.81, 196.0, 261.63, 329.63, 392.0, 523.25],
    [146.83, 220.0, 261.63, 293.66, 349.23, 440.0],
    [116.54, 174.61, 220.0, 293.66, 349.23, 440.0],
  ];
  private pattern = [0, 2, 3, 5, 4, 3, 2, 1];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    if (this.audio) return;
    try {
      const audioEl = new Audio(weddingConfig.music.audioUrl);
      audioEl.loop = true;
      audioEl.preload = 'auto';
      audioEl.volume = 0.85;
      audioEl.addEventListener('timeupdate', () => this.notifyListeners());
      audioEl.addEventListener('loadedmetadata', () => this.notifyListeners());
      this.audio = audioEl;
    } catch {
      this.audio = null;
    }
  }

  private notifyListeners() {
    const current = this.getCurrentTime();
    const duration = this.getDuration();
    this.listeners.forEach((cb) => cb(current, duration));
  }

  private startSyncLoop() {
    this.stopSyncLoop();
    this.syncIntervalId = window.setInterval(() => {
      if (this.isPlaying) {
        this.notifyListeners();
      }
    }, 150);
  }

  private stopSyncLoop() {
    if (this.syncIntervalId !== null) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
  }

  public subscribeTime(listener: TimeUpdateListener): () => void {
    this.listeners.add(listener);
    listener(this.getCurrentTime(), this.getDuration());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getCurrentTime(): number {
    if (this.audio && !Number.isNaN(this.audio.currentTime)) {
      return this.audio.currentTime;
    }
    if (this.fallbackStartTime > 0 && this.isPlaying) {
      return (this.fallbackElapsed + (Date.now() - this.fallbackStartTime) / 1000) % 222.35;
    }
    return this.fallbackElapsed % 222.35;
  }

  public getDuration(): number {
    if (
      this.audio &&
      !Number.isNaN(this.audio.duration) &&
      Number.isFinite(this.audio.duration) &&
      this.audio.duration > 0
    ) {
      return this.audio.duration;
    }
    return 222.35; // 03:42.35
  }

  public seek(seconds: number): void {
    const clamped = Math.max(0, Math.min(seconds, this.getDuration()));
    if (this.audio) {
      this.audio.currentTime = clamped;
    } else {
      this.fallbackElapsed = clamped;
      if (this.isPlaying) {
        this.fallbackStartTime = Date.now();
      }
    }
    this.notifyListeners();
  }

  public playEnvelopeChime() {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      // Celestial ascending arpeggio with delicate bell harmonics (C4, E4, G4, C5, E5, G5, C6)
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        this.triggerNote(freq, i * 0.08, 1.6, 0.038);
      });
    } catch {
      // Ignore if browser blocks chime
    }
  }

  public playStampSound() {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  public playCardSlideSound() {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const notes = [329.63, 392.0, 523.25, 659.25];
      notes.forEach((freq, i) => {
        this.triggerNote(freq, i * 0.05, 0.8, 0.025);
      });
    } catch {
      // Ignore
    }
  }

  public playFlipSound() {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(490, now + 0.18);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignore
    }
  }

  /**
   * Starts playing "I Prayed For You" by Clash bae.
   * Call this synchronously inside a user click/tap handler so mobile browsers
   * (especially iOS Safari) immediately grant audio playback permission.
   */
  public start(): boolean {
    try {
      this.initAudioElement();
      if (this.isPlaying) return true;

      if (this.audio) {
        this.clearFade();
        this.audio.volume = 0.18;
        const playPromise = this.audio.play();
        this.isPlaying = true;
        this.startSyncLoop();
        this.notifyListeners();

        // Smoothly swell the volume up to 0.85 over ~1.8 seconds as the envelope opens
        this.fadeIntervalId = window.setInterval(() => {
          if (!this.audio || !this.isPlaying) {
            this.clearFade();
            return;
          }
          if (this.audio.volume < 0.82) {
            this.audio.volume = Math.min(0.85, this.audio.volume + 0.06);
          } else {
            this.audio.volume = 0.85;
            this.clearFade();
          }
        }, 140);

        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.startFallbackSynth();
          });
        }

        return true;
      }

      return this.startFallbackSynth();
    } catch {
      this.isPlaying = false;
      return false;
    }
  }

  public stop(resetToBeginning = false): void {
    if (this.fallbackStartTime > 0 && this.isPlaying) {
      this.fallbackElapsed += (Date.now() - this.fallbackStartTime) / 1000;
      this.fallbackStartTime = 0;
    }
    if (resetToBeginning) {
      this.fallbackElapsed = 0;
    }

    this.isPlaying = false;
    this.clearFade();
    this.stopSyncLoop();

    if (this.audio) {
      this.audio.pause();
      if (resetToBeginning) {
        this.audio.currentTime = 0;
      }
    }

    if (this.fallbackIntervalId !== null) {
      clearInterval(this.fallbackIntervalId);
      this.fallbackIntervalId = null;
    }

    this.notifyListeners();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop(false);
      return false;
    } else {
      return this.start();
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  private clearFade() {
    if (this.fadeIntervalId !== null) {
      clearInterval(this.fadeIntervalId);
      this.fadeIntervalId = null;
    }
  }

  private startFallbackSynth(): boolean {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isPlaying = true;
      this.fallbackStartTime = Date.now();
      this.startSyncLoop();
      if (this.fallbackIntervalId !== null) {
        clearInterval(this.fallbackIntervalId);
      }
      this.fallbackIntervalId = window.setInterval(() => {
        if (!this.isPlaying || !this.ctx) return;
        const chordIndex = Math.floor(this.step / 8) % this.chords.length;
        const noteInPattern = this.pattern[this.step % this.pattern.length];
        const freq = this.chords[chordIndex][noteInPattern];
        this.triggerNote(freq, 0, 2.6, 0.045);
        this.step++;
      }, 460);
      return true;
    } catch {
      this.isPlaying = false;
      return false;
    }
  }

  private triggerNote(freq: number, delaySeconds: number, duration: number, maxGain: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + delaySeconds;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    subOsc.type = 'triangle';

    osc.frequency.setValueAtTime(freq, now);
    subOsc.frequency.setValueAtTime(freq * 0.5, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(maxGain, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration + 0.05);
    subOsc.stop(now + duration + 0.05);
  }
}

export const soundManager = new WeddingMusicManager();
