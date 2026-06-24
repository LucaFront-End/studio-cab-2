import { useEffect, useRef } from 'react';
import './Services.css';

const services = [
  {
    id: 'comercial',
    index: '01',
    title: 'Diseño Comercial',
    subtitle: 'Espacios que venden.',
    description:
      'Transformamos locales comerciales, restaurantes y oficinas en experiencias de marca estratégicas que atraen y convierten.',
    tag: 'Retail · Oficinas',
    image: '/diseno_comercial.png',
  },
  {
    id: 'residencial',
    index: '02',
    title: 'Interiorismo Residencial',
    subtitle: 'Tu hogar, tu identidad.',
    description:
      'Diseñamos espacios habitacionales sofisticados donde la precisión constructiva se funde con texturas de mármol y madera de nogal.',
    tag: 'Casas · Departamentos',
    image: '/interiorismo_residencial.png',
  },
  {
    id: 'carpinteria',
    index: '03',
    title: 'Carpintería sobre Diseño',
    subtitle: 'Mobiliario hecho a medida.',
    description:
      'Fabricamos cocinas, closets y elementos arquitectónicos de madera con acabados premium y diseño milimétrico.',
    tag: 'Muebles · Cocinas',
    image: '/carpinteria_diseno.png',
  },
  {
    id: 'produccion',
    index: '04',
    title: 'Producción e Instalación',
    subtitle: 'Del plano a la realidad.',
    description:
      'Gestionamos la fabricación, montaje e instalación de cada proyecto en CDMX y área metropolitana con altos estándares de calidad y atención al detalle.',
    tag: 'Obra · Acabados',
    image: '/produccion_instalacion.png',
  },
];

const Services = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const fillRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardRefs.current;
    if (!section || cards.length === 0) return;

    const handleScroll = () => {
      // Check if we are on mobile size (disable animation for smooth scroll on phone)
      if (window.innerWidth <= 1024) {
        cards.forEach((card) => {
          if (card) card.style.transform = 'none';
        });
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionHeight = sectionRect.height;
      const windowHeight = window.innerHeight;

      // Scrolled height inside sticky track
      const scrolled = Math.max(0, -sectionTop);
      const totalScrollable = sectionHeight - windowHeight;
      const progress = Math.min(1, scrolled / totalScrollable);

      // Update the progress line fill
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${progress})`;
      }

      // Timing for cards to rise sequential
      // Divide total range [0, 1] into 4 zones, one for each card
      const numCards = cards.length;
      const zoneSize = 1 / numCards;

      cards.forEach((card, index) => {
        if (!card) return;

        const startZone = index * zoneSize;
        // Local progress for this specific card
        const cardProgress = Math.max(0, Math.min(1, (progress - startZone) / zoneSize));

        // Animation: goes from translateY(110vh) down to translateY(0)
        // Using cubic-bezier representation via JS or smooth interpolation
        const easedP = Math.sin((cardProgress * Math.PI) / 2); // Sine ease-out
        const yOffset = (1 - easedP) * 110; // offset in vh/percentage

        card.style.transform = `translateY(${yOffset}vh)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initial trigger
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="services-section" ref={sectionRef} id="servicios">
      <div className="services-sticky-container">
        {/* Left column - Sticky */}
        <div className="services-left-column">
          <span className="services-eyebrow">Lo que hacemos</span>
          <h2 className="services-heading">
            Cuatro disciplinas,<br />
            <em>una sola visión</em><span className="services-dot">.</span>
          </h2>
          <p className="services-subheading">
            Studio CAB integra diseño de espacios comerciales y residenciales junto con taller propio de producción artesanal de carpintería metálica y de madera.
          </p>

          <div className="services-indicator">
            <span>PROGRESO</span>
            <div className="services-indicator-bar">
              <div className="services-indicator-fill" ref={fillRef} />
            </div>
          </div>
        </div>

        {/* Right column - Sliding Cards Container */}
        <div className="services-right-column">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className="service-card-wrapper"
              ref={(el) => (cardRefs.current[idx] = el)}
            >
              <div className="service-card light-theme">
                
                {/* Top Section */}
                <div className="service-card-top">
                  <span className="service-card-index">{service.index}</span>
                  <span className="service-card-tag">{service.tag}</span>
                </div>

                {/* Header */}
                <div className="service-card-header">
                  <h3 className="service-card-title">{service.title}</h3>
                  <p className="service-card-subtitle">{service.subtitle}</p>
                </div>

                {/* Expanding Image */}
                <div className="service-card-image-wrapper">
                  <img src={service.image} alt={service.title} className="service-card-image" />
                </div>

                {/* Body */}
                <div className="service-card-body">
                  <p className="service-card-desc">{service.description}</p>
                </div>

                {/* Bottom Section */}
                <div className="service-card-bottom">
                  <a href={`#contacto`} className="service-card-cta">
                    <span>Cotizar Proyecto</span>
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 1L11 5L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1 5H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
