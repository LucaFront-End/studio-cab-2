import { useState, useEffect, useRef } from 'react';
import { useInView, useStaggerInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import './AboutPage.css';

const timelineData = [
  { year: '2016', title: 'Fundación', text: 'Nace Studio CAB en la Ciudad de México con la visión de unir diseño arquitectónico y carpintería artesanal bajo un mismo techo.' },
  { year: '2018', title: 'Primer Taller Propio', text: 'Inauguramos nuestro taller de carpintería en Polanco, equipado con maquinaria CNC de última generación.' },
  { year: '2019', title: 'Expansión Comercial', text: 'Completamos nuestros primeros 20 proyectos comerciales, consolidando nuestra presencia en el sector gastronómico y retail de CDMX.' },
  { year: '2021', title: 'Herrería de Diseño', text: 'Incorporamos una línea de herrería arquitectónica, permitiendo soluciones integrales de metal, madera y piedra.' },
  { year: '2023', title: 'Reconocimiento Nacional', text: 'Studio CAB es reconocido entre los estudios de interiorismo comercial más innovadores de México.' },
  { year: '2025', title: 'Internacionalización', text: 'Primeros proyectos internacionales y lanzamiento de nuestra línea de mobiliario de autor.' },
];

const teamMembers = [
  { name: 'Carlos A. Bravo', role: 'Director Creativo & Fundador', specialty: 'Arquitectura de interiores comerciales', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Ana Beltrán', role: 'Directora de Proyectos', specialty: 'Gestión integral y producción en sitio', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { name: 'Diego Fuentes', role: 'Jefe de Taller', specialty: 'Carpintería fina y CNC avanzado', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
  { name: 'Mariana Torres', role: 'Diseñadora Senior', specialty: 'Interiorismo residencial de alta gama', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
];

const workshopImages = [
  { src: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&q=80', alt: 'Taller CNC', caption: 'Maquinaria CNC de precisión' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', alt: 'Carpintería artesanal', caption: 'Acabados artesanales a mano' },
  { src: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80', alt: 'Herrería', caption: 'Herrería arquitectónica' },
  { src: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=600&q=80', alt: 'Materiales', caption: 'Selección de materiales premium' },
  { src: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&q=80', alt: 'Proceso', caption: 'Control de calidad riguroso' },
  { src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80', alt: 'Showroom', caption: 'Showroom en Polanco' },
];

export default function AboutPage() {
  /* ── Section 1: Hero Counters ── */
  const [heroRef, heroVisible] = useInView({ threshold: 0.2 });
  const [countRef1, count1] = useCountUp(150, { suffix: '+' });
  const [countRef2, count2] = useCountUp(12000, { suffix: ' m²' });
  const [countRef3, count3] = useCountUp(9, { suffix: ' años' });

  /* ── Section 2: Timeline ── */
  const [timelineRef, timelineVisible] = useInView({ threshold: 0.1 });
  const [activeTimeline, setActiveTimeline] = useState(0);
  const timelineTrackRef = useRef(null);

  /* ── Section 3: Philosophy ── */
  const [philRef, philVisible] = useInView({ threshold: 0.2 });

  /* ── Section 4: Team ── */
  const [teamRefs, teamVisible] = useStaggerInView(teamMembers.length, { staggerDelay: 150 });
  const [flippedCards, setFlippedCards] = useState(new Set());

  const toggleFlip = (index) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  /* ── Section 5: Workshop Gallery ── */
  const [galleryRefs, galleryVisible] = useStaggerInView(workshopImages.length, { staggerDelay: 100 });
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  /* ── Section 6: Values ── */
  const [valRef, valVisible] = useInView({ threshold: 0.2 });

  /* ── Parallax for hero image ── */
  const heroImageRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (heroImageRef.current && window.scrollY < 1200) {
        heroImageRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0) scale(1.1)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="about-page page-enter">

      {/* ═══════════════════════════════════════════
          SECTION 1: HERO CINEMATIC
          ═══════════════════════════════════════════ */}
      <section className="about-hero" ref={heroRef}>
        <div className="about-hero-bg">
          <img
            ref={heroImageRef}
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80"
            alt="Studio CAB Interior"
            className="about-hero-bg-img"
          />
          <div className="about-hero-overlay" />
        </div>

        <div className="about-hero-content">
          <span className={`about-hero-eyebrow ${heroVisible ? 'in-view' : ''}`}>Quiénes Somos</span>
          <h1 className={`about-hero-title ${heroVisible ? 'in-view' : ''}`}>
            {'Somos Studio CAB.'.split('').map((char, i) => (
              <span key={i} className="about-hero-letter" style={{ animationDelay: `${0.6 + i * 0.04}s` }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
          <p className={`about-hero-sub ${heroVisible ? 'in-view' : ''}`}>
            Diseño interior de alto nivel & carpintería artesanal en CDMX
          </p>

          <div className={`about-hero-counters ${heroVisible ? 'in-view' : ''}`}>
            <div className="about-counter" ref={countRef1}>
              <span className="about-counter-value">{count1}</span>
              <span className="about-counter-label">Proyectos Completados</span>
            </div>
            <div className="about-counter" ref={countRef2}>
              <span className="about-counter-value">{count2}</span>
              <span className="about-counter-label">Diseñados</span>
            </div>
            <div className="about-counter" ref={countRef3}>
              <span className="about-counter-value">{count3}</span>
              <span className="about-counter-label">De Experiencia</span>
            </div>
          </div>
        </div>

        <div className="about-hero-scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2: TIMELINE
          ═══════════════════════════════════════════ */}
      <section className="about-timeline" ref={timelineRef}>
        <div className="container-default">
          <span className={`section-eyebrow ${timelineVisible ? 'in-view' : ''}`}>Nuestra Historia</span>
          <h2 className={`section-heading ${timelineVisible ? 'in-view' : ''}`}>
            Un camino de <em>precisión</em> y <em>pasión</em>.
          </h2>

          <div className="timeline-track" ref={timelineTrackRef}>
            <div className="timeline-line">
              <div className="timeline-line-fill" style={{ width: `${((activeTimeline + 1) / timelineData.length) * 100}%` }} />
            </div>
            <div className="timeline-dots">
              {timelineData.map((item, i) => (
                <button
                  key={i}
                  className={`timeline-dot ${i === activeTimeline ? 'active' : ''} ${i <= activeTimeline ? 'past' : ''}`}
                  onClick={() => setActiveTimeline(i)}
                >
                  <span className="timeline-dot-year">{item.year}</span>
                  <span className="timeline-dot-circle" />
                </button>
              ))}
            </div>
          </div>

          <div className="timeline-content-area">
            {timelineData.map((item, i) => (
              <div key={i} className={`timeline-card ${i === activeTimeline ? 'active' : ''}`}>
                <span className="timeline-card-year">{item.year}</span>
                <h3 className="timeline-card-title">{item.title}</h3>
                <p className="timeline-card-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3: PHILOSOPHY
          ═══════════════════════════════════════════ */}
      <section className="about-philosophy" ref={philRef}>
        <div className="container-default">
          <div className="phil-grid">
            <div className={`phil-image-col ${philVisible ? 'in-view' : ''}`}>
              <div className="phil-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=80"
                  alt="Diseño interior premium"
                  className="phil-image"
                />
                <div className="phil-image-accent" />
              </div>
            </div>
            <div className={`phil-text-col ${philVisible ? 'in-view' : ''}`}>
              <span className="section-eyebrow">Filosofía</span>
              <h2 className="section-heading">
                Donde la <em>ingeniería</em> se encuentra con el <em>arte</em>.
              </h2>
              <p className="phil-text">
                En Studio CAB creemos que cada espacio cuenta una historia. Nuestra filosofía se fundamenta en tres pilares: la precisión técnica de la ingeniería, la sensibilidad estética del diseño y la honestidad de los materiales nobles.
              </p>
              <p className="phil-text">
                No decoramos espacios — los transformamos. Cada proyecto es una sinfonía de madera, metal y luz, orquestada con la precisión de un reloj suizo y la calidez de un hogar mexicano.
              </p>
              <div className="phil-values-mini">
                <div className="phil-value">
                  <span className="phil-value-num">01</span>
                  <span className="phil-value-text">Precisión Constructiva</span>
                </div>
                <div className="phil-value">
                  <span className="phil-value-num">02</span>
                  <span className="phil-value-text">Materiales Nobles</span>
                </div>
                <div className="phil-value">
                  <span className="phil-value-num">03</span>
                  <span className="phil-value-text">Diseño Funcional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4: TEAM
          ═══════════════════════════════════════════ */}
      <section className="about-team">
        <div className="container-default">
          <span className="section-eyebrow anim-fade-up in-view">El Equipo</span>
          <h2 className="section-heading anim-fade-up in-view">
            Las mentes detrás de cada <em>trazo</em>.
          </h2>

          <div className="team-grid">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                ref={el => teamRefs.current[i] = el}
                className={`team-card-wrapper ${teamVisible[i] ? 'in-view' : ''}`}
                onClick={() => toggleFlip(i)}
              >
                <div className={`team-card ${flippedCards.has(i) ? 'flipped' : ''}`}>
                  <div className="team-card-front">
                    <div className="team-card-image-wrapper">
                      <img src={member.image} alt={member.name} className="team-card-image" />
                      <div className="team-card-image-overlay" />
                    </div>
                    <div className="team-card-info">
                      <h3 className="team-card-name">{member.name}</h3>
                      <p className="team-card-role">{member.role}</p>
                    </div>
                    <span className="team-card-flip-hint">Click para más</span>
                  </div>
                  <div className="team-card-back">
                    <span className="team-back-index">0{i + 1}</span>
                    <h3 className="team-back-name">{member.name}</h3>
                    <p className="team-back-role">{member.role}</p>
                    <div className="team-back-divider" />
                    <p className="team-back-specialty">
                      <span className="team-back-label">Especialidad</span>
                      {member.specialty}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5: WORKSHOP GALLERY
          ═══════════════════════════════════════════ */}
      <section className="about-workshop">
        <div className="container-default">
          <span className="section-eyebrow anim-fade-up in-view">Nuestro Taller</span>
          <h2 className="section-heading anim-fade-up in-view">
            Donde las ideas toman <em>forma</em>.
          </h2>

          <div className="workshop-masonry">
            {workshopImages.map((img, i) => (
              <div
                key={i}
                ref={el => galleryRefs.current[i] = el}
                className={`workshop-item ${galleryVisible[i] ? 'in-view' : ''}`}
                onClick={() => setLightboxIndex(i)}
              >
                <img src={img.src} alt={img.alt} className="workshop-image" />
                <div className="workshop-item-overlay">
                  <span className="workshop-item-caption">{img.caption}</span>
                  <span className="workshop-item-zoom">+</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {lightboxIndex >= 0 && (
          <div className="workshop-lightbox" onClick={() => setLightboxIndex(-1)}>
            <div className="lightbox-content" onClick={e => e.stopPropagation()}>
              <img src={workshopImages[lightboxIndex].src.replace('w=600', 'w=1200')} alt={workshopImages[lightboxIndex].alt} />
              <p className="lightbox-caption">{workshopImages[lightboxIndex].caption}</p>
              <button className="lightbox-close" onClick={() => setLightboxIndex(-1)}>✕</button>
              {lightboxIndex > 0 && (
                <button className="lightbox-prev" onClick={() => setLightboxIndex(lightboxIndex - 1)}>‹</button>
              )}
              {lightboxIndex < workshopImages.length - 1 && (
                <button className="lightbox-next" onClick={() => setLightboxIndex(lightboxIndex + 1)}>›</button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6: VALUES & STATS
          ═══════════════════════════════════════════ */}
      <section className="about-values" ref={valRef}>
        <div className="container-default">
          <div className={`values-grid ${valVisible ? 'in-view' : ''}`}>
            {[
              { icon: '◇', title: 'Excelencia', text: 'Cada detalle importa. Revisamos tres veces antes de entregar.' },
              { icon: '△', title: 'Innovación', text: 'Tecnología CNC + mano artesanal = precisión sin precedentes.' },
              { icon: '○', title: 'Integridad', text: 'Un solo equipo responsable de principio a fin, sin excusas.' },
              { icon: '□', title: 'Sustentabilidad', text: 'Maderas certificadas y procesos de bajo impacto ambiental.' },
            ].map((value, i) => (
              <div key={i} className="value-card" style={{ transitionDelay: `${i * 0.15}s` }}>
                <span className="value-icon">{value.icon}</span>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-text">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
