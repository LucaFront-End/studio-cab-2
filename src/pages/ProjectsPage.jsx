import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView, useStaggerInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import './ProjectsPage.css';

import { useWixCMSData } from '../hooks/useWixCMS';
import { resolveWixImage } from '../lib/wixCMS';

const filters = ['Todos', 'Comercial', 'Residencial', 'Carpintería'];

const rawMapHotspots = [
  { lat: '35%', lng: '45%' },
  { lat: '45%', lng: '35%' },
  { lat: '25%', lng: '25%' },
  { lat: '65%', lng: '15%' },
  { lat: '20%', lng: '55%' },
  { lat: '85%', lng: '60%' },
  { lat: '30%', lng: '40%' },
  { lat: '60%', lng: '50%' },
];

export default function ProjectsPage() {
  const { proyectos } = useWixCMSData();
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [heroRef, heroVis] = useInView({ threshold: 0.1 });

  const projectsData = (proyectos || []).map(p => {
    let cat = 'comercial';
    if (p.servicioPrincipal === '8e5d5551-a1fa-4272-958e-1a01eacdb7ff') cat = 'residencial';
    else if (p.servicioPrincipal === '06a2037c-149b-4fd6-844f-b9814340f9b8') cat = 'carpinteria';
    else if (p.servicioPrincipal === 'f9aa307d-3523-4a2c-a202-826a5889ea3d') cat = 'produccion';
    
    let tag = cat === 'comercial' ? 'Proyecto Comercial' : cat === 'residencial' ? 'Proyecto Residencial' : 'Producción Especializada';

    return {
      id: p._id,
      title: p.title || 'Proyecto CAB',
      category: cat,
      location: p.zonaDelProyecto || 'CDMX',
      tag: tag,
      image: resolveWixImage(p.imagenPrincipal, 800) || '',
      featured: p.apareceEnProyecto === 'Sí'
    };
  });

  const filteredProjects = activeFilter === 'Todos'
    ? projectsData
    : projectsData.filter(p => p.category === activeFilter.toLowerCase().replace('í', 'i'));

  const [gridRefs, gridVis] = useStaggerInView(projectsData.length, { staggerDelay: 100 });
  const [featRef, featVis] = useInView({ threshold: 0.15 });

  /* Map State (NUEVA) */
  const mapHotspots = projectsData.slice(0, 8).map((p, i) => ({
    ...p,
    name: p.title,
    zone: p.location,
    lat: rawMapHotspots[i % rawMapHotspots.length].lat,
    lng: rawMapHotspots[i % rawMapHotspots.length].lng,
  }));

  const [activeHotspot, setActiveHotspot] = useState(mapHotspots[0] || null);
  const [mapRef, mapVis] = useInView({ threshold: 0.15 });

  const [c1Ref, c1] = useCountUp(150, { suffix: '+' });
  const [c2Ref, c2] = useCountUp(12000, { suffix: '' });
  const [c3Ref, c3] = useCountUp(98, { suffix: '%' });

  const [ctaRef, ctaVis] = useInView({ threshold: 0.2 });

  const featuredProject = projectsData.find(p => p.featured);

  return (
    <div className="projects-page page-enter">

      {/* ═══ SECTION 1: HERO + FILTERS ═══ */}
      <section className="pp-hero" ref={heroRef}>
        <div className="container-default">
          <span className={`pp-hero-eyebrow ${heroVis ? 'in-view' : ''}`}>Portafolio</span>
          <h1 className={`pp-hero-title ${heroVis ? 'in-view' : ''}`}>
            Nuestros Proyectos<span className="sp-dot">.</span>
          </h1>
          <div className={`pp-filters ${heroVis ? 'in-view' : ''}`}>
            {filters.map(f => (
              <button
                key={f}
                className={`pp-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: MASONRY GRID ═══ */}
      <section className="pp-grid-section">
        <div className="container-default">
          <div className="pp-masonry">
            {filteredProjects.map((project, i) => (
              <Link
                to={`/proyectos/${project.id}`}
                key={project.id}
                ref={el => gridRefs.current[i] = el}
                className={`pp-project-card ${gridVis[i] ? 'in-view' : ''}`}
              >
                <div className="pp-card-image-wrapper">
                  <img src={project.image} alt={project.title} className="pp-card-image" />
                  <div className="pp-card-overlay">
                    <span className="pp-card-tag">{project.tag}</span>
                    <h3 className="pp-card-title">{project.title}</h3>
                    <span className="pp-card-location">{project.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: FEATURED PROJECT ═══ */}
      {featuredProject && (
        <section className="pp-featured" ref={featRef}>
          <div className={`pp-featured-inner ${featVis ? 'in-view' : ''}`}>
            <div className="pp-featured-image-wrapper">
              <img src={featuredProject.image.replace('w=600', 'w=1400')} alt={featuredProject.title} className="pp-featured-image" />
              <div className="pp-featured-overlay" />
            </div>
            <div className="pp-featured-content">
              <span className="pp-featured-eyebrow">Proyecto Destacado</span>
              <h2 className="pp-featured-title">{featuredProject.title}</h2>
              <p className="pp-featured-location">{featuredProject.location} · {featuredProject.tag}</p>
              <Link to={`/proyectos/${featuredProject.id}`} className="pp-featured-cta">
                Ver Proyecto Completo
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ SECTION 4: CDMX PROJECTS MAP (NUEVA) ═══ */}
      <section className="pp-map-section" ref={mapRef}>
        <div className="container-default">
          <span className={`section-eyebrow ${mapVis ? 'in-view' : ''}`}>Ubicaciones</span>
          <h2 className={`section-heading ${mapVis ? 'in-view' : ''}`}>Proyectos en la <em>Ciudad de México</em>.</h2>
          
          <div className={`pp-map-container ${mapVis ? 'in-view' : ''}`}>
            <div className="pp-map-visual">
              {/* Styled background grid representing the map */}
              <div className="pp-map-grid-overlay" />
              
              {/* Hotspots */}
              {mapHotspots.map(spot => (
                <button
                  key={spot.id}
                  className={`pp-map-pin ${activeHotspot?.id === spot.id ? 'active' : ''}`}
                  style={{ top: spot.lat, left: spot.lng }}
                  onClick={() => setActiveHotspot(spot)}
                  onMouseEnter={() => setActiveHotspot(spot)}
                >
                  <span className="pp-pin-dot" />
                  <span className="pp-pin-pulse" />
                </button>
              ))}

              {/* Tooltip detail card */}
              {activeHotspot && (
                <div className="pp-map-tooltip" style={{ top: `calc(${activeHotspot.lat} - 10px)`, left: activeHotspot.lng }}>
                  <span className="pp-tooltip-zone">{activeHotspot.zone}</span>
                  <h4 className="pp-tooltip-name">{activeHotspot.name}</h4>
                  <span className="pp-tooltip-tag">{activeHotspot.tag}</span>
                  <Link to={`/proyectos/${activeHotspot.id}`} className="pp-tooltip-link">Ver Detalle →</Link>
                  <button className="pp-tooltip-close" onClick={() => setActiveHotspot(null)}>✕</button>
                </div>
              )}
            </div>
            
            <div className="pp-map-info">
              <h3 className="pp-map-info-title">Huella de Autor</h3>
              <p className="pp-map-info-text">
                Hemos desarrollado proyectos de interiorismo comercial, residencial y carpintería fina en las zonas más emblemáticas de la CDMX, consolidando a Studio CAB como referente de diseño local.
              </p>
              <div className="pp-map-stats-mini">
                <div className="pp-map-stat-mini">
                  <span className="pp-mini-val">08</span>
                  <span className="pp-mini-lbl">Corredores Clave</span>
                </div>
                <div className="pp-map-stat-mini">
                  <span className="pp-mini-val">65+</span>
                  <span className="pp-mini-lbl">Obras Entregadas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: STATS ═══ */}
      <section className="pp-stats">
        <div className="container-default">
          <div className="pp-stats-grid">
            <div className="pp-stat" ref={c1Ref}>
              <span className="pp-stat-value">{c1}</span>
              <span className="pp-stat-label">Proyectos Entregados</span>
            </div>
            <div className="pp-stat" ref={c2Ref}>
              <span className="pp-stat-value">{c2}</span>
              <span className="pp-stat-unit">m²</span>
              <span className="pp-stat-label">Construidos</span>
            </div>
            <div className="pp-stat" ref={c3Ref}>
              <span className="pp-stat-value">{c3}</span>
              <span className="pp-stat-label">Clientes Satisfechos</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6: CTA ═══ */}
      <section className="pp-cta" ref={ctaRef}>
        <div className={`container-default pp-cta-inner ${ctaVis ? 'in-view' : ''}`}>
          <h2 className="pp-cta-title">¿Tienes un proyecto en mente?</h2>
          <p className="pp-cta-text">Hablemos de cómo transformar tu espacio.</p>
          <Link to="/contacto" className="pp-cta-btn">Contactar</Link>
        </div>
      </section>
    </div>
  );
}
