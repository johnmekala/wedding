import { useEffect, useState } from "react";

const AUDIO_SRC = "/audio/wedding-song.mp3";
const TARGET_VOLUME = 0.25; // 25% default volume

// Singleton Audio Instance
let globalAudio: HTMLAudioElement | null = null;
let fadeInterval: number | null = null;
const listeners = new Set<(playing: boolean) => void>();

function getAudio(): HTMLAudioElement {
  if (typeof window === "undefined") {
    return {} as HTMLAudioElement;
  }
  if (!globalAudio) {
    globalAudio = new Audio(AUDIO_SRC);
    globalAudio.loop = true;
    globalAudio.volume = 0;
    globalAudio.preload = "auto";

    // Handle play/pause events
    globalAudio.addEventListener("play", () => notifyListeners(true));
    globalAudio.addEventListener("pause", () => {
      if (globalAudio && globalAudio.volume === 0) {
        notifyListeners(false);
      }
    });
  }
  return globalAudio;
}

function notifyListeners(playing: boolean) {
  listeners.forEach((listener) => listener(playing));
}

function clearFade() {
  if (fadeInterval !== null) {
    window.clearInterval(fadeInterval);
    fadeInterval = null;
  }
}

/** Smoothly fade audio volume in to target (default 0.25) */
export function fadeInAudio(targetVol = TARGET_VOLUME, durationMs = 1500): Promise<void> {
  const audio = getAudio();
  clearFade();

  return new Promise((resolve) => {
    // If paused, trigger play (directly from user gesture)
    const playPromise = audio.paused ? audio.play() : Promise.resolve();

    playPromise
      .then(() => {
        notifyListeners(true);
        const steps = 25;
        const intervalTime = durationMs / steps;
        const volStep = (targetVol - Math.max(0, audio.volume)) / steps;

        fadeInterval = window.setInterval(() => {
          if (!globalAudio) return;
          const newVol = globalAudio.volume + volStep;
          if ((volStep > 0 && newVol >= targetVol) || (volStep < 0 && newVol <= targetVol)) {
            globalAudio.volume = targetVol;
            clearFade();
            resolve();
          } else {
            globalAudio.volume = Math.max(0, Math.min(1, newVol));
          }
        }, intervalTime);
      })
      .catch((error) => {
        console.error("Wedding background music playback error:", error);
        notifyListeners(false);
        resolve();
      });
  });
}

/** Smoothly fade audio volume out to 0 and pause */
export function fadeOutAudio(durationMs = 1000): Promise<void> {
  const audio = getAudio();
  if (audio.paused) return Promise.resolve();
  clearFade();

  return new Promise((resolve) => {
    const steps = 20;
    const intervalTime = durationMs / steps;
    const volStep = audio.volume / steps;

    fadeInterval = window.setInterval(() => {
      if (!globalAudio) return;
      const newVol = globalAudio.volume - volStep;
      if (newVol <= 0) {
        globalAudio.volume = 0;
        globalAudio.pause();
        clearFade();
        notifyListeners(false);
        resolve();
      } else {
        globalAudio.volume = Math.max(0, newVol);
      }
    }, intervalTime);
  });
}

/** Triggered when user clicks "Enter Our Celebration" */
export function startMusicOnEntry() {
  fadeInAudio(TARGET_VOLUME, 2000);
}

/** Toggle music state (Resume from same timestamp if off, fade out if on) */
export function toggleWeddingMusic() {
  const audio = getAudio();
  if (audio.paused || audio.volume === 0) {
    fadeInAudio(TARGET_VOLUME, 1000);
  } else {
    fadeOutAudio(800);
  }
}

/** Fallback listener for first user interaction anywhere on the document */
if (typeof window !== "undefined") {
  const handleFirstInteraction = () => {
    const audio = getAudio();
    if (audio.paused) {
      audio.play().then(() => {
        fadeInAudio(TARGET_VOLUME, 2000);
      }).catch((err) => {
        console.warn("First interaction music start prevented:", err);
      });
    }
  };

  window.addEventListener("click", handleFirstInteraction, { once: true });
  window.addEventListener("touchstart", handleFirstInteraction, { once: true });
  window.addEventListener("keydown", handleFirstInteraction, { once: true });
}

/** React Hook for components to subscribe to audio playing state */
export function useWeddingAudio() {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const audio = getAudio();
    return !audio.paused && audio.volume > 0;
  });

  useEffect(() => {
    const listener = (playing: boolean) => setIsPlaying(playing);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    isPlaying,
    toggleMusic: toggleWeddingMusic,
    startMusicOnEntry,
  };
}
