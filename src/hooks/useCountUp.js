import { useState, useEffect, useRef } from 'react';

/**
 * Animated counter hook that counts from 0 to a target number.
 * @param {number} target - Target number
 * @param {Object} options
 * @param {number} options.duration - Duration in ms (default 2000)
 * @param {boolean} options.startOnView - Start when element is in view
 * @param {string} options.suffix - Suffix to append (e.g., '+', 'm²')
 * @param {string} options.prefix - Prefix to prepend (e.g., '$')
 * @returns {[React.RefObject, string]} - [ref, displayValue]
 */
export function useCountUp(target, { duration = 2000, suffix = '', prefix = '' } = {}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const startTime = performance.now();
    let raf;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setValue(current);

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  const display = `${prefix}${value.toLocaleString()}${suffix}`;
  return [ref, display];
}
