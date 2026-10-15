import { useState, useEffect, useRef } from 'react';
import HeroFurniture3D from './HeroFurniture3D';
import './Hero.css';

const Hero = ({ topEyebrow, fraseCorta, excerptPgina, seoTitle }) => {
  const [loaded, setLoaded] = useState(false);
  const [animateContent, setAnimateContent] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const stickyRef = useRef(null);
  const titleWrapperRef = useRef(null);

  const titleLetters = ['S', 't', 'u', 'd', 'i', 'o', '\u00A0', 'C', 'A', 'B', '.'];
  const letterClasses = ['item-one', 'item-two', 'item-three', 'item-four', 'item-five', 'item-six', 'item-space', 'item-seven text-outline', 'item-eight text-outline', 'item-nine text-outline', 'item-dot text-orange'];

  useEffect(() => {
    // 1. Initial fade out of loader
    const loaderTimer = setTimeout(() => {
      setLoaded(true);
    }, 500);

    // Remove loader element from DOM after fade out completes
    const removeLoaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 1300);

    // 2. Start letters animation and skew elements entrance
    const contentTimer = setTimeout(() => {
      setAnimateContent(true);
    }, 600);

    return () => {
      clearTimeout(loaderTimer);
      clearTimeout(removeLoaderTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  // Sticky Scroll Progress Calculation (0 to 1 as user scrolls through the 300vh hero)
  useEffect(() => {
    const handleScroll = () => {
      if (!stickyRef.current) return;
      const rect = stickyRef.current.getBoundingClientRect();
      const totalScroll = stickyRef.current.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / totalScroll));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Step name indicator based on scroll progress
  let stepName = '01 / 04 // SOFÁ LOUNGE DE RECEPCIÓN — HAZ SCROLL ↓';
  let stepNum = 1;
  if (scrollProgress >= 0.92) {
    stepName = 'ESPACIO COMERCIAL COMPLETO // CONTINÚA EL SCROLL ↓';
    stepNum = 4;
  } else if (scrollProgress >= 0.68) {
    stepName = '04 / 04 // MESA DE CENTRO EN NOGAL Y LATÓN';
    stepNum = 4;
  } else if (scrollProgress >= 0.38) {
    stepName = '03 / 04 // CLOSET ARQUITECTÓNICO SOBRE DISEÑO';
    stepNum = 3;
  } else if (scrollProgress >= 0.08) {
    stepName = '02 / 04 // ESTANTE EXHIBIDOR RETAIL COMERCIAL';
    stepNum = 2;
  }

  return (
    <section className="home-hero-sticky-track" ref={stickyRef}>
      <div className="home-hero-sticky-viewport">
        {/* Blueprint Grid Background */}
        <div className="hero-blueprint-grid" />
        
        {/* Loader Overlay */}
        {showLoader && (
          <div className={`hero-loader ${loaded ? 'fade-out' : ''}`}></div>
        )}

        <div className="container-default hero-sticky-container">
          <div className="home-hero-wrapper">
            {/* Eyebrow Accent (Editorial details) */}
            <div className={`hero-top-eyebrow ${animateContent ? 'animate-in' : ''}`}>
              {topEyebrow ? (
                <span className="eyebrow-line">{topEyebrow.toUpperCase()}</span>
              ) : (
                <>
                  <span className="eyebrow-line">DISEÑO DE INTERIORES</span>
                  <span className="eyebrow-sep"> &amp; </span>
                  <span className="eyebrow-line">CARPINTERÍA ARQUITECTÓNICA</span>
                </>
              )}
            </div>

            {/* Parallax Title Header */}
            <div className="hero-title-wrapper" ref={titleWrapperRef}>
              <div className="home-hero-title-block">
                {titleLetters.map((letter, idx) => (
                  <span
                    key={idx}
                    className={`hero-title-char-outer ${letterClasses[idx]} ${animateContent ? 'animate-in' : ''}`}
                    style={{ transitionDelay: `${idx * 0.06}s` }}
                  >
                    <span className="hero-title-char-inner">
                      {letter}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* 3D Living Room Furniture Stage (Scroll-driven assembly) */}
            <div className={`hero-banner-outer-block ${animateContent ? 'animate-in' : ''}`}>
              <div className="hero-3d-living-room-stage">
                <HeroFurniture3D scrollProgress={scrollProgress} />

                <img 
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80"
                  alt={seoTitle || topEyebrow || "Carpintería y Muebles sobre Diseño en CDMX | Studio CAB"}
                  title={seoTitle || topEyebrow || "Carpintería y Muebles sobre Diseño en CDMX | Studio CAB"}
                  style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', pointerEvents: 'none' }}
                />

                {/* Subtle Living Room Progress Overlay */}
                <div className="hero-living-room-hud">
                  <div className="hero-hud-step-badge">
                    <span className="hero-hud-dot" />
                    <span>{stepName}</span>
                  </div>
                  <div className="hero-hud-dots">
                    {[1, 2, 3, 4].map((n) => (
                      <span
                        key={n}
                        className={`hero-dot-indicator ${stepNum >= n ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hero details text and CTA button */}
            <div className={`hero-content-block ${animateContent ? 'animate-in' : ''}`}>
              <div className="hero-content-left-block">
                <h2>{fraseCorta || "Diseñamos espacios que venden, conectan y generan experiencia."}</h2>
              </div>
              <div className="hero-content-right-block">
                <p className="button-top-text">
                  {excerptPgina || "Arquitectura interior y carpintería a la medida en CDMX. Materializamos espacios comerciales premium con precisión milimétrica."}
                </p>
                <a href="#cta-configurator" className="hero-cta-btn">
                  <div className="corner-cross top-left">+</div>
                  <div className="corner-cross top-right">+</div>
                  <div className="corner-cross bottom-left">+</div>
                  <div className="corner-cross bottom-right">+</div>

                  COTIZAR PROYECTO
                  <span className="cta-btn-coord">[CAB-HERO]</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
