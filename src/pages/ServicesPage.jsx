import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView, useStaggerInView } from '../hooks/useInView';
import CTAConfigurator from '../components/CTAConfigurator';
import './ServicesPage.css';

const servicesData = [
  { id: 'comercial', title: 'Diseño Comercial', subtitle: 'Espacios que venden', tag: 'Retail · Oficinas · Restaurantes', image: '/diseno_comercial.png', description: 'Transformamos locales comerciales en experiencias de marca que generan resultados medibles.' },
  { id: 'residencial', title: 'Interiorismo Residencial', subtitle: 'Tu hogar, tu identidad', tag: 'Casas · Departamentos · Penthouses', image: '/interiorismo_residencial.png', description: 'Diseñamos espacios habitacionales sofisticados con materiales nobles y acabados impecables.' },
  { id: 'carpinteria', title: 'Carpintería sobre Diseño', subtitle: 'Mobiliario hecho a medida', tag: 'Muebles · Cocinas · Closets', image: '/carpinteria_diseno.png', description: 'Fabricamos con maquinaria CNC y mano artesanal, cocinas, closets y mobiliario premium.' },
  { id: 'produccion', title: 'Producción e Instalación', subtitle: 'Del plano a la realidad', tag: 'Obra · Acabados · Supervisión', image: '/produccion_instalacion.png', description: 'Gestionamos la fabricación, montaje e instalación de cada proyecto en CDMX y área metropolitana con altos estándares de calidad y atención al detalle.' },
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

const servicesFAQs = [
  { q: '¿Qué incluye la consulta inicial?', a: 'Incluye una reunión para entender tu idea, levantamiento fotográfico y de medidas con láser, y un análisis preliminar de viabilidad del proyecto.' },
  { q: '¿Los renders 3D tienen costo adicional?', a: 'No, los renders fotorrealistas están incluidos en el costo del proyecto de diseño conceptual.' },
  { q: '¿Puedo contratar solo la fabricación de carpintería?', a: 'Sí, trabajamos con planos ejecutivos provistos por tu arquitecto o diseñador independiente, fabricando a medida en nuestro taller.' },
  { q: '¿Cómo se manejan los tiempos y plazos de entrega?', a: 'Todos nuestros contratos especifican fechas exactas de entrega por etapas. Si hay demoras no justificadas por cambios de obra, asumimos penalizaciones contractuales.' }
];

export default function ServicesPage() {
  /* Section 1: Hero & Marquees */
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
  const [activeStep, setActiveStep] = useState(0);
  const [processRef, processVis] = useInView({ threshold: 0.1 });

  /* Section 4: Comparison */
  const [compRef, compVis] = useInView({ threshold: 0.2 });
  const [compRefs, compRowVis] = useStaggerInView(comparisons.length, { staggerDelay: 120 });

  /* Section 5: FAQ Section (NUEVA) */
  const [faqRef, faqVis] = useInView({ threshold: 0.1 });
  const [openFAQ, setOpenFAQ] = useState(-1);



  return (
    <div className="services-page page-enter">

      {/* ═══ SECTION 1: HERO DOUBLE MARQUEE ═══ */}
      <section className="sp-hero" ref={heroRef}>
        <div className="sp-hero-bg" />
        <div className="sp-hero-content">
          <span className={`sp-hero-eyebrow ${heroVis ? 'in-view' : ''}`}>Nuestros Servicios</span>
          <h1 className={`sp-hero-title ${heroVis ? 'in-view' : ''}`}>
            Lo que hacemos<span className="sp-dot">.</span>
          </h1>
        </div>
        
        <div className="sp-marquee-wrapper double">
          <div className="sp-marquee-track ltr">
            {[...servicesData, ...servicesData, ...servicesData].map((s, i) => (
              <span key={`ltr-${i}`} className="sp-marquee-item">
                {s.title} <span className="sp-marquee-sep">✦</span>
              </span>
            ))}
          </div>
          <div className="sp-marquee-track rtl">
            {[...servicesData, ...servicesData, ...servicesData].map((s, i) => (
              <span key={`rtl-${i}`} className="sp-marquee-item italic">
                {s.subtitle} <span className="sp-marquee-sep">✦</span>
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

      {/* ═══ SECTION 3: INTERACTIVE PROCESS ═══ */}
      <section className="sp-process-section" ref={processRef}>
        <div className="container-default">
          <span className={`section-eyebrow ${processVis ? 'in-view' : ''}`}>Nuestro Proceso</span>
          <h2 className={`section-heading ${processVis ? 'in-view' : ''}`}>
            Cinco pasos hacia tu espacio <em>ideal</em>.
          </h2>

          <div className={`sp-interactive-process ${processVis ? 'in-view' : ''}`}>
            <div className="sp-process-tabs">
              {processSteps.map((step, i) => (
                <button
                  key={i}
                  className={`sp-process-tab-btn ${i === activeStep ? 'active' : ''}`}
                  onClick={() => setActiveStep(i)}
                >
                  <span className="sp-tab-num">{step.num}</span>
                  <span className="sp-tab-title">{step.title}</span>
                </button>
              ))}
            </div>
            
            <div className="sp-process-display">
              <div className="sp-display-card">
                <span className="sp-display-num">{processSteps[activeStep].num}</span>
                <h3 className="sp-display-title">{processSteps[activeStep].title}</h3>
                <p className="sp-display-text">{processSteps[activeStep].text}</p>
                <div className="sp-display-accent" />
              </div>
            </div>
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

      {/* ═══ SECTION 5: SERVICES FAQ (NUEVA) ═══ */}
      <section className="sp-faq-section" ref={faqRef}>
        <div className="container-default">
          <span className={`section-eyebrow ${faqVis ? 'in-view' : ''}`}>FAQ de Servicios</span>
          <h2 className={`section-heading ${faqVis ? 'in-view' : ''}`}>
            Dudas comunes sobre <em>diseño y obra</em>.
          </h2>

          <div className="sp-faq-list">
            {servicesFAQs.map((faq, i) => (
              <div key={i} className={`sp-faq-item ${openFAQ === i ? 'open' : ''}`}>
                <button className="sp-faq-question" onClick={() => setOpenFAQ(openFAQ === i ? -1 : i)}>
                  <span>{faq.q}</span>
                  <span className="sp-faq-icon">{openFAQ === i ? '−' : '+'}</span>
                </button>
                <div className="sp-faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6: CONFIGURATOR FROM HOME ═══ */}
      <CTAConfigurator source="Servicios" />
    </div>
  );
}
