import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook that uses IntersectionObserver to detect when an element enters the viewport.
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Root margin
 * @param {boolean} options.triggerOnce - If true, only triggers once
 * @returns {[React.RefObject, boolean]} - [ref, isInView]
 */
export function useInView({ threshold = 0.15, rootMargin = '0px', triggerOnce = true } = {}) {
  const [element, setElement] = useState(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, threshold, rootMargin, triggerOnce]);

  return [setElement, isInView];
}

/**
 * Variant that returns multiple refs for staggered animations.
 * @param {number} count - Number of items
 * @param {Object} options - IntersectionObserver options
 * @returns {[React.RefObject[], boolean[]]}
 */
export function useStaggerInView(count, { threshold = 0.1, rootMargin = '0px 0px -50px 0px', staggerDelay = 120 } = {}) {
  const refs = useRef([]);
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    setVisibleItems(new Array(count).fill(false));
  }, [count]);

  useEffect(() => {
    const observers = [];
    refs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleItems(prev => {
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }, index * staggerDelay);
            observer.unobserve(el);
          }
        },
        { threshold, rootMargin }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [count, threshold, rootMargin, staggerDelay]);

  return [refs, visibleItems];
}
