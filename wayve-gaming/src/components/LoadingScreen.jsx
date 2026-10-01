import { useEffect, useRef, useState } from 'react';
import loadingImage from '../assets/loadingImage/wayweimage.png';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const targetRef = useRef(0);   // real target (0–90 during loading, 100 when done)
  const currentRef = useRef(0);  // displayed value (smoothly chases target)
  const doneRef = useRef(false);

  /* ---------- 1. Watch real asset loading ---------- */
  useEffect(() => {
    const assets = [];

    // every <img> on the page
    document.querySelectorAll('img').forEach((img) => {
      if (!img.complete) {
        assets.push(new Promise((res) => {
          img.addEventListener('load', res, { once: true });
          img.addEventListener('error', res, { once: true });
        }));
      }
    });

    // every <video> — wait for metadata at minimum
    document.querySelectorAll('video').forEach((v) => {
      if (v.readyState < 1) {
        assets.push(new Promise((res) => {
          v.addEventListener('loadedmetadata', res, { once: true });
          v.addEventListener('error', res, { once: true });
        }));
      }
    });

    // fonts
    if (document.fonts?.ready) {
      assets.push(document.fonts.ready);
    }

    // wait for all of it, then flag done
    Promise.all(assets).then(() => {
      doneRef.current = true;
    });
  }, []);

  /* ---------- 2. Animate displayed progress ---------- */
  useEffect(() => {
    let raf;
    const start = performance.now();
    const fakeDuration = 1800; // rough "feels loaded" time

    const tick = (now) => {
      // Build the real target:
      //   - while not done: ease toward 90% over fakeDuration
      //   - once done: jump to 100%
      if (doneRef.current) {
        targetRef.current = 100;
      } else {
        const t = Math.min((now - start) / fakeDuration, 1);
        const eased = 1 - Math.pow(1 - t, 3);   // ease-out cubic
        targetRef.current = eased * 90;         // cap at 90% until done
      }

      // Smoothly chase the target so it never jumps abruptly
      const diff = targetRef.current - currentRef.current;
      currentRef.current += diff * 0.08;
      if (Math.abs(diff) < 0.05) currentRef.current = targetRef.current;

      setProgress(currentRef.current);

      if (doneRef.current && currentRef.current >= 99.9) {
        // small pause so the user sees the full bar for a beat
        setTimeout(() => onComplete?.(), 300);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black">

      {/* LOGO — replace src with your own */}
      <img
        src={loadingImage}
        alt="Waywe Gaming"
        className="w-64 md:w-80 lg:w-96 h-auto select-none mb-6"
        draggable="false"
      />

      <p className="text-gray-300 text-xl md:text-2xl font-light tracking-wide mb-16">
        Good Games Ahead...
      </p>

      <div className="w-72 md:w-80 lg:w-[420px]">
        <div className="relative h-2 rounded-full border-2 border-orange-500/70 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-orange-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* optional % readout */}
        <p className="text-center text-xs text-gray-500 mt-3 tabular-nums">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}