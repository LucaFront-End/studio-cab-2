import { useState, useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => setIsClick(true);
    const handleMouseUp = () => setIsClick(false);
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    // Detect interactive elements
    const handleMouseOver = (e) => {
      const el = e.target.closest('a, button, [data-cursor]');
      if (el) {
        setIsHover(true);
        setLabel(el.getAttribute('data-cursor') || '');
      } else {
        setIsHover(false);
        setLabel('');
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Smooth follow animation
    let raf;
    const animate = () => {
      const lerp = 0.15;
      pos.current.x += (target.current.x - pos.current.x) * lerp;
      pos.current.y += (target.current.y - pos.current.y) * lerp;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.current.x}px, ${target.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className={`cursor-dot ${isHover ? 'hover' : ''} ${isClick ? 'click' : ''} ${isHidden ? 'hidden' : ''}`} />
      <div ref={ringRef} className={`cursor-ring ${isHover ? 'hover' : ''} ${isClick ? 'click' : ''} ${isHidden ? 'hidden' : ''}`}>
        {label && <span className="cursor-label">{label}</span>}
      </div>
    </>
  );
}
