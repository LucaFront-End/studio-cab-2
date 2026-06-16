import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView, useStaggerInView } from '../hooks/useInView';
import './ServicesPage.css';

const servicesData = [
  { id: 'comercial', title: 'Diseño Comercial', subtitle: 'Espacios que venden', tag: 'Retail · Oficinas · Restaurantes', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', description: 'Transformamos locales comerciales en experiencias de marca que generan resultados medibles.' },
  { id: 'residencial', title: 'Interiorismo Residencial', subtitle: 'Tu hogar, tu identidad', tag: 'Casas · Departamentos · Penthouses', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80', description: 'Diseñamos espacios habitacionales sofisticados con materiales nobles y acabados impecables.' },
  { id: 'carpinteria', title: 'Carpintería sobre Diseño', subtitle: 'Mobiliario hecho a medida', tag: 'Muebles · Cocinas · Closets', image: 'https://images.unsplash.com/photo-1595526051245-4506e0005bd0?w=600&q=80', description: 'Fabricamos con maquinaria CNC y mano artesanal, cocinas, closets y mobiliario premium.' },
  { id: 'produccion', title: 'Producción e Instalación', subtitle: 'Del plano a la realidad', tag: 'Obra · Acabados · Supervisión', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', description: 'Ejecución y supervisión total del proceso constructivo con estándares de alta costura.' },
];

const processSteps = [
  { num: '01', title: 'Consulta Inicial', text: 'Reunión para entender tu visión, necesidades y presupuesto. Levantamiento técnico del espacio.' },
  { num: '02', title: 'Concepto de Diseño', text: 'Propuesta creativa con renders 3D fotorrealistas, paleta de materiales y planimetría detallada.' },
  { num: '03', title: 'Ingeniería & Planos', text: 'Planos ejecutivos de instalaciones, carpintería y acabados listos para producción.' },
  { num: '04', title: 'Fabricación en Taller', text: 'Producción de mobiliario y elementos en nuestro taller con control de calidad en cada pieza.' },
  { num: '05', title: 'Instalación & Entrega', text: 'Montaje en sitio, supervisión de obra y entrega llave en mano con garantía completa.' },
];

const comparisons = [
  { feature: 'Diseño + fabricación integrada', us: true, others: false },
  { feature: 'Taller propio con CNC', us: true, others: false },
  { feature: 'Un solo responsable del proyecto', us: true, others: false },
  { feature: 'Renders 3D fotorrealistas', us: true, others: true },
  { feature: 'Garantía post-entrega', us: true, others: false },
  { feature: 'Plazos contractuales', us: true, others: false },
  { feature: 'Materiales certificados', us: true, others: false },
];

export default function ServicesPage() {
  /* Section 1: Marquee */
  const [heroRef, heroVis] = useInView({ threshold: 0.1 });

  /* Section 2: Service Cards with magnetic hover */
  const [cardsRefs, cardsVis] = useStaggerInView(servicesData.length, { staggerDelay: 150 });
  const cardContainerRefs = useRef([]);

  const handleMouseMove = (e, index) => {
    const card = cardContainerRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.02)`;
  };

  const handleMouseLeave = (index) => {
    const card = cardContainerRefs.current[index];
    if (card) card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
  };

  /* Section 3: Process Steps */
  const [stepsRefs, stepsVis] = useStaggerInView(processSteps.length, { staggerDelay: 200 });

  /* Section 4: Comparison */
  const [compRef, compVis] = useInView({ threshold: 0.2 });
  const [compRefs, compRowVis] = useStaggerInView(comparisons.length, { staggerDelay: 120 });

  /* Section 5: CTA */
  const [ctaRef, ctaVis] = useInView({ threshold: 0.2 });
  const ctaBgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ctaBgRef.current) {
        const rect = ctaBgRef.current.getBoundingClientRect();
        const offset = (rect.top / window.innerHeight) * 30;
        ctaBgRef.current.style.backgroundPositionY = `${offset}%`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="services-page page-enter">

      {/* ═══ SECTION 1: HERO MARQUEE ═══ */}
      <section className="sp-hero" ref={heroRef}>
        <div className="sp-hero-bg" />
        <div className="sp-hero-content">
          <span className={`sp-hero-eyebrow ${heroVis ? 'in-view' : ''}`}>Nuestros Servicios</span>
          <h1 className={`sp-hero-title ${heroVis ? 'in-view' : ''}`}>
            Lo que hacemos<span className="sp-dot">.</span>
          </h1>
        </div>
        <div className="sp-marquee-wrapper">
          <div className="sp-marquee-track">
            {[...servicesData, ...servicesData, ...servicesData].map((s, i) => (
              <span key={i} className="sp-marquee-item">
                {s.title} <span className="sp-marquee-sep">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: SERVICES GRID ═══ */}
      <section className="sp-grid-section">
        <div className="container-default">
          <div className="sp-service-grid">
            {servicesData.map((service, i) => (
              <Link to={`/servicios/${service.id}`} key={service.id} className="sp-card-link">
                <div
                  ref={el => { cardsRefs.current[i] = el; cardContainerRefs.current[i] = el; }}
                  className={`sp-service-card ${cardsVis[i] ? 'in-view' : ''}`}
                  onMouseMove={(e) => handleMouseMove(e, i)}
                  onMouseLeave={() => handleMouseLeave(i)}
                >
                  <div className="sp-card-image-wrapper">
                    <img src={service.image} alt={service.title} className="sp-card-image" />
                    <div className="sp-card-image-overlay" />
                  </div>
                  <div className="sp-card-content">
                    <span className="sp-card-tag">{service.tag}</span>
                    <h3 className="sp-card-title">{service.title}</h3>
                    <p className="sp-card-subtitle">{service.subtitle}</p>
                    <p className="sp-card-desc">{service.description}</p>
                    <span className="sp-card-cta">
                      Ver Servicio
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: PROCESS STEPS ═══ */}
      <section className="sp-process-section">
        <div className="container-default">
          <span className="section-eyebrow anim-fade-up in-view">Nuestro Proceso</span>
          <h2 className="section-heading anim-fade-up in-view">
            Cinco pasos hacia tu espacio <em>ideal</em>.
          </h2>

          <div className="sp-process-timeline">
            {processSteps.map((step, i) => (
              <div
                key={i}
                ref={el => stepsRefs.current[i] = el}
                className={`sp-process-step ${stepsVis[i] ? 'in-view' : ''}`}
              >
                <div className="sp-step-line">
                  <span className="sp-step-dot" />
                  {i < processSteps.length - 1 && <div className="sp-step-connector" />}
                </div>
                <div className="sp-step-content">
                  <span className="sp-step-num">{step.num}</span>
                  <h3 className="sp-step-title">{step.title}</h3>
                  <p className="sp-step-text">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: COMPARISON TABLE ═══ */}
      <section className="sp-comparison" ref={compRef}>
        <div className="container-default">
          <span className={`section-eyebrow ${compVis ? 'in-view' : ''}`}>¿Por Qué Nosotros?</span>
          <h2 className={`section-heading ${compVis ? 'in-view' : ''}`}>
            La diferencia <em>Studio CAB</em>.
          </h2>

          <div className="sp-comp-table">
            <div className="sp-comp-header">
              <span className="sp-comp-feature-label">Característica</span>
              <span className="sp-comp-us">Studio CAB</span>
              <span className="sp-comp-others">Otros Estudios</span>
            </div>
            {comparisons.map((row, i) => (
              <div
                key={i}
                ref={el => compRefs.current[i] = el}
                className={`sp-comp-row ${compRowVis[i] ? 'in-view' : ''}`}
              >
                <span className="sp-comp-feature">{row.feature}</span>
                <span className={`sp-comp-check ${row.us ? 'yes' : 'no'}`}>
                  {row.us ? '✓' : '✗'}
                </span>
                <span className={`sp-comp-check ${row.others ? 'yes' : 'no'}`}>
                  {row.others ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: CTA FULLWIDTH ═══ */}
      <section className="sp-cta" ref={ctaRef}>
        <div className="sp-cta-bg" ref={ctaBgRef} />
        <div className="sp-cta-overlay" />
        <div className={`sp-cta-content ${ctaVis ? 'in-view' : ''}`}>
          <span className="sp-cta-eyebrow">¿Listo para empezar?</span>
          <h2 className="sp-cta-title">Transformemos tu espacio.</h2>
          <p className="sp-cta-sub">Contanos tu idea y te ayudamos a hacerla realidad.</p>
          <Link to="/contacto" className="sp-cta-btn">
            Contactar Ahora
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
