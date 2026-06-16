import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

export default function PageTransition() {
  const location = useLocation();
  const [displayPath, setDisplayPath] = useState(location.pathname);
  const [animating, setAnimating] = useState(false);
  const [phase, setPhase] = useState('idle'); // 'idle', 'entering', 'exiting'
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      // Route changed! Trigger page wipe animation
      prevPathRef.current = location.pathname;
      setAnimating(true);
      setPhase('entering');

      // Phase 1: Wipe covers the screen (450ms)
      const enterTimer = setTimeout(() => {
        setDisplayPath(location.pathname);
        setPhase('exiting');
      }, 500);

      // Phase 2: Wipe reveals the new page (500ms)
      const exitTimer = setTimeout(() => {
        setPhase('idle');
        setAnimating(false);
      }, 1000);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(exitTimer);
      };
    }
  }, [location.pathname]);

  if (phase === 'idle') return null;

  return (
    <div className={`page-transition-overlay ${phase}`}>
      <div className="wipe-panel primary-panel">
        <div className="panel-logo">CAB</div>
      </div>
      <div className="wipe-panel secondary-panel"></div>
    </div>
  );
}
