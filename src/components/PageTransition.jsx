/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('idle');
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip transition on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('exit');
      
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('enter');
        
        const enterTimer = setTimeout(() => {
          setTransitionStage('idle');
        }, 600);

        return () => clearTimeout(enterTimer);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <>
      {/* Wipe overlay */}
      <div className={`page-transition-overlay ${transitionStage}`}>
        <div className="pt-wipe" />
        <div className="pt-wipe-accent" />
      </div>

      {/* Content */}
      <div className={`page-transition-content ${transitionStage}`}>
        {children}
      </div>
    </>
  );
}
