import { useEffect, useRef, useState } from 'react';
import './ProcessSplit.css';

const steps = [
  {
    id: 1,
    num: '01',
    title: 'Conceptualización',
    subtitle: 'Definición de la idea de negocio y flujos.',
    description: 'Reuniones de inmersión para entender los objetivos comerciales de tu marca, el perfil de compra de tus clientes y la ergonomía operativa que requiere tu personal.',
    image: '/process_step1.png'
  },
  {
    id: 2,
    num: '02',
    title: 'Moodboards + Renders',
    subtitle: 'Estética, materialidad y previsualización.',
    description: 'Curamos paletas físicas de maderas, piedras y metales. Creamos renders tridimensionales foto-realistas para asegurar que la visión estética y funcional esté perfectamente al 100% alineada antes de cortar.',
    image: '/process_step2.png'
  },
  {
    id: 3,
    num: '03',
    title: 'Diseño Técnico',
    subtitle: 'Planos de taller y especificaciones.',
    description: 'Desarrollamos los planos ejecutivos completos: detalles constructivos de mobiliario, ingenierías de iluminación, instalaciones eléctricas y guías de acabados listas para obra.',
    image: '/process_step3.png'
  },
  {
    id: 4,
    num: '04',
    title: 'Fabricación',
    subtitle: 'Carpintería de alta costura.',
    description: 'Producimos bajo el mismo techo en la CDMX con maquinaria CNC de precisión y ebanistas artesanales. Al no subcontratar, controlamos la calidad de vetas, ensambles e ingletes.',
    image: '/process_step4.png'
  },
  {
    id: 5,
    num: '05',
    title: 'Instalación',
    subtitle: 'Obra civil y montaje integrado.',
    description: 'Nuestro equipo propio traslada e instala en sitio, coordinando carpintería, herrería pesada e iluminación. Evitamos las fricciones clásicas delegando todo a un único responsable.',
    image: '/process_step5.png'
  },
  {
    id: 6,
    num: '06',
    title: 'Entrega Final',
    subtitle: 'Llave en mano y puesta en marcha.',
    description: 'Realizamos el detallado final, limpieza profunda y la entrega de tu espacio comercial funcionando al 100%, listo para abrir puertas y empezar a facturar.',
    image: '/process_step6.png'
  }
];

const ProcessSplit = () => {
  const sectionRef = useRef(null);
  const leftShutterRef = useRef(null);
  const rightShutterRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);
  const shuttersWrapperRef = useRef(null);
  const timelineRef = useRef(null);

  const [hoveredSide, setHoveredSide] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 1024) return;

      const section = sectionRef.current;
      if (!section) return;

      const sectionRect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // How far the section top has scrolled past the viewport top (0 = just arrived, 80vh = shutter fully open)
      const sectionScrolled = -sectionRect.top;
      const shutterPhase = 80 / 100; // 80vh to fully open
      const shutterProgress = Math.max(0, Math.min(1, sectionScrolled / (vh * shutterPhase)));

      const isScrolling = shutterProgress > 0.02;
      isScrollingRef.current = isScrolling;

      // Animate shutters splitting open
      if (leftShutterRef.current) {
        leftShutterRef.current.style.transform = `translateX(${-shutterProgress * 102}%)`;
        leftShutterRef.current.style.pointerEvents = isScrolling ? 'none' : 'auto';
        if (isScrolling) {
          leftShutterRef.current.style.width = '50%';
          leftShutterRef.current.style.transition = 'transform 0.1s ease-out';
        } else {
          leftShutterRef.current.style.width = '';
          leftShutterRef.current.style.transition = '';
        }
      }
      if (rightShutterRef.current) {
        rightShutterRef.current.style.transform = `translateX(${shutterProgress * 102}%)`;
        rightShutterRef.current.style.pointerEvents = isScrolling ? 'none' : 'auto';
        if (isScrolling) {
          rightShutterRef.current.style.width = '50%';
          rightShutterRef.current.style.transition = 'transform 0.1s ease-out';
        } else {
          rightShutterRef.current.style.width = '';
          rightShutterRef.current.style.transition = '';
        }
      }

      // Fade shutter text out quickly
      const textOpacity = Math.max(0, 1 - shutterProgress * 2.5);
      if (leftContentRef.current) leftContentRef.current.style.opacity = textOpacity.toString();
      if (rightContentRef.current) rightContentRef.current.style.opacity = textOpacity.toString();

      // Disable shutter wrapper pointer events once fully open
      if (shuttersWrapperRef.current) {
        shuttersWrapperRef.current.style.pointerEvents = shutterProgress > 0.95 ? 'none' : 'auto';
      }

      // Track active timeline card based on viewport center
      const timeline = timelineRef.current;
      if (timeline && shutterProgress > 0.5) {
        const cards = timeline.querySelectorAll('.process-step-card');
        const viewportCenter = vh / 2;
        let activeIdx = 0;
        let minDiff = Infinity;
        cards.forEach((card, idx) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.top + cardRect.height / 2;
          const diff = Math.abs(cardCenter - viewportCenter);
          if (diff < minDiff) {
            minDiff = diff;
            activeIdx = idx;
          }
        });
        setActiveStep(activeIdx);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="process-split-section" ref={sectionRef} id="proceso">

      {/* LAYER 1: Shutters — position:sticky, stays pinned while scrolling */}
      <div className="process-shutters-wrapper" ref={shuttersWrapperRef}>
        {/* Left Shutter */}
        <div
          className={`process-shutter shutter-left ${hoveredSide === 'left' ? 'hover-left' : ''} ${hoveredSide === 'right' ? 'shrink' : ''}`}
          ref={leftShutterRef}
          onMouseEnter={() => { if (!isScrollingRef.current) setHoveredSide('left'); }}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div className="shutter-bg-wrapper">
            <div className="shutter-bg design-bg"></div>
          </div>
          <div className="shutter-overlay"></div>
          <div className="shutter-border-frame">
            <span className="cross-hair top-left">+</span>
            <span className="cross-hair top-right">+</span>
            <span className="cross-hair bottom-left">+</span>
            <span className="cross-hair bottom-right">+</span>
            <span className="tech-coord">CDMX.CAB.01</span>
          </div>
          <div className="shutter-content" ref={leftContentRef}>
            <div className="shutter-num-bg">01</div>
            <span className="shutter-eyebrow">FASE 01</span>
            <h2 className="shutter-title">Pensar &amp; Diseñar</h2>
            <p className="shutter-description">
              Inmersión comercial de flujos y renders fotorrealistas antes de cortar madera.
            </p>
            <div className="shutter-indicator">
              <span>EXPLORAR</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Shutter */}
        <div
          className={`process-shutter shutter-right ${hoveredSide === 'right' ? 'hover-right' : ''} ${hoveredSide === 'left' ? 'shrink' : ''}`}
          ref={rightShutterRef}
          onMouseEnter={() => { if (!isScrollingRef.current) setHoveredSide('right'); }}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div className="shutter-bg-wrapper">
            <div className="shutter-bg fabrication-bg"></div>
          </div>
          <div className="shutter-overlay"></div>
          <div className="shutter-border-frame">
            <span className="cross-hair top-left">+</span>
            <span className="cross-hair top-right">+</span>
            <span className="cross-hair bottom-left">+</span>
            <span className="cross-hair bottom-right">+</span>
            <span className="tech-coord">CDMX.CAB.02</span>
          </div>
          <div className="shutter-content" ref={rightContentRef}>
            <div className="shutter-num-bg">02</div>
            <span className="shutter-eyebrow">FASE 02</span>
            <h2 className="shutter-title">Fabricar &amp; Instalar</h2>
            <p className="shutter-description">
              Mano de obra artesanal, producción CNC propia e instalación llave en mano sin fricciones.
            </p>
            <div className="shutter-indicator">
              <span>EXPLORAR</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 2: Timeline — negative margin pulls it up to overlap with shutters */}
      <div className="timeline-split-wrapper" ref={timelineRef}>

        {/* Left Column: Scrolls naturally */}
        <div className="timeline-left-col">
          {/* Top spacer so content starts below the shutter viewport */}
          <div className="timeline-top-spacer" />

          <div className="process-text-intro">
            <span className="process-eyebrow">Metodología</span>
            <h2 className="process-title-main">
              El Camino del Plano <br />
              al Espacio Llave en Mano
            </h2>
            <p className="process-desc-main">
              Un flujo de trabajo integrado donde el diseño estratégico, la fabricación propia y la instalación final son coordinados por un solo equipo.
            </p>
          </div>

          <div className="process-steps-list">
            {steps.map((step, idx) => (
              <div
                className={`process-step-card ${activeStep === idx ? 'active' : ''}`}
                key={step.id}
                data-index={idx}
              >
                <div className="step-card-header">
                  <span className="step-card-num">{step.num}</span>
                  <h3 className="step-card-title">{step.title}</h3>
                </div>
                <p className="step-card-subtitle">{step.subtitle}</p>
                <p className="step-card-desc">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="timeline-bottom-spacer" />
        </div>

        {/* Right Column: Native CSS sticky image frame */}
        <div className="timeline-right-col">
          <div className="timeline-image-viewport">
            {steps.map((step, idx) => (
              <img
                key={step.id}
                src={step.image}
                alt={step.title}
                className={`timeline-reveal-img ${activeStep === idx ? 'active' : ''}`}
              />
            ))}
            <div className="frame-tech-lines">
              <span className="tech-cross top-left">+</span>
              <span className="tech-cross top-right">+</span>
              <span className="tech-cross bottom-left">+</span>
              <span className="tech-cross bottom-right">+</span>
              <span className="frame-scale">DETALLE DE PROCESO | ESCALA 1:1</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProcessSplit;
