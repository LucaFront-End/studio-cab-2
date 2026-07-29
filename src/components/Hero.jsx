import { useState, useEffect, useRef } from 'react';
import './Hero.css';

const Hero = ({ topEyebrow, fraseCorta, excerptPgina }) => {
  const [loaded, setLoaded] = useState(false);
  const [animateContent, setAnimateContent] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  // Refs for scroll parallax effect
  const titleWrapperRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);

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

  // Performance-optimized scroll listener for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Only perform transforms if section is within view
      if (scrollY < 1200) {
        if (titleWrapperRef.current) {
          titleWrapperRef.current.style.transform = `translate3d(0px, ${scrollY * 0.25}px, 0px)`;
        }
        if (imageWrapperRef.current) {
          imageWrapperRef.current.style.transform = `translate3d(0px, ${-100 + scrollY * 0.15}px, 0px)`;
        }
        if (imageRef.current) {
          imageRef.current.style.transform = `translate3d(0px, ${50 - scrollY * 0.1}px, 0px) scale3d(1.2, 1.2, 1)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize the transforms on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="home-hero-section">
      {/* Blueprint Grid Background */}
      <div className="hero-blueprint-grid" />
      
      {/* Loader Overlay */}
      {showLoader && (
        <div className={`hero-loader ${loaded ? 'fade-out' : ''}`}></div>
      )}

      <div className="container-default">
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

          {/* Parallax Wrapper for Title */}
          <div className="hero-title-wrapper" ref={titleWrapperRef}>
            {/* Title block with solid typography */}
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

          {/* Banner container containing the autoplaying architectural video */}
          <div className={`hero-banner-outer-block ${animateContent ? 'animate-in' : ''}`}>
            <div className="hero-banner-image-wrapper" ref={imageWrapperRef}>
              {/* Technical indicators on video frame */}
              <div className="hero-video-cross top-left">+</div>
              <div className="hero-video-cross top-right">+</div>
              <div className="hero-video-cross bottom-left">+</div>
              <div className="hero-video-cross bottom-right">+</div>
              <div className="hero-video-label top-left">[REC // PERSPECTIVE-01]</div>
              <div className="hero-video-label bottom-right">[SCALE 21:9 // CDMX 2026]</div>

              <video
                ref={imageRef}
                autoPlay
                loop
                muted
                playsInline
                className="hero-banner-video"
              >
                <source
                  src="/hero-video.mp4"
                  type="video/mp4"
                />
              </video>
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
                {/* corner crosshair decorations */}
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
    </section>
  );
};

export default Hero;
