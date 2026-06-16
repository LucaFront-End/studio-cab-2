import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorType, setCursorType] = useState('default'); // 'default', 'view', 'drag', 'zoom', 'pointer'
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    // Check if pointer device is fine (desktop with mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsMobile(!mediaQuery.matches);

    const handleMediaChange = (e) => {
      setIsMobile(!e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isMobile]);

  // Trail interpolation (lerp) for the cursor ring
  useEffect(() => {
    if (isMobile) return;

    let animId;
    const updateTrail = () => {
      setTrail((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Adjust this factor for more/less lag (0.15 = smooth lag)
        const lerpFactor = 0.15; 
        return {
          x: prev.x + dx * lerpFactor,
          y: prev.y + dy * lerpFactor,
        };
      });
      animId = requestAnimationFrame(updateTrail);
    };

    animId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animId);
  }, [position, isMobile]);

  // Hover detection for interactive items
  useEffect(() => {
    if (isMobile) return;

    const handleMouseOver = (e) => {
      // Find closest interactive element
      const target = e.target;
      const clickable = target.closest('a, button, [role="button"], input, select, textarea, .clickable');
      const customCursorData = target.closest('[data-cursor]');

      if (customCursorData) {
        setIsHovered(true);
        setCursorType(customCursorData.getAttribute('data-cursor'));
      } else if (clickable) {
        setIsHovered(true);
        setCursorType('pointer');
      } else {
        setIsHovered(false);
        setCursorType('default');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isMobile]);

  if (isMobile || !isVisible) return null;

  return (
    <>
      <div
        className={`custom-cursor-dot ${isClicking ? 'clicking' : ''} type-${cursorType}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        ref={dotRef}
      />
      <div
        className={`custom-cursor-ring ${isClicking ? 'clicking' : ''} ${isHovered ? 'hovered' : ''} type-${cursorType}`}
        style={{ left: `${trail.x}px`, top: `${trail.y}px` }}
        ref={ringRef}
      >
        {cursorType === 'view' && <span className="cursor-text">VER</span>}
        {cursorType === 'drag' && <span className="cursor-text">ARRAS</span>}
        {cursorType === 'zoom' && <span className="cursor-text">LUPA</span>}
      </div>
    </>
  );
}
