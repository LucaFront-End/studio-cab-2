import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView, useStaggerInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import './ProjectsPage.css';

const projectsData = [
  { id: 'basilio', title: 'Basilio Roma', category: 'comercial', location: 'Roma Norte, CDMX', tag: 'Restaurante & Bar', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80', featured: true },
  { id: 'condesa', title: 'Casa Condesa', category: 'residencial', location: 'Condesa, CDMX', tag: 'Interiorismo Residencial', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80' },
  { id: 'polanco', title: 'Boutique Polanco', category: 'comercial', location: 'Polanco, CDMX', tag: 'Retail de Alta Gama', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80' },
  { id: 'santafe', title: 'Loft Santa Fe', category: 'residencial', location: 'Santa Fe, CDMX', tag: 'Penthouse', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' },
  { id: 'juarez', title: 'Café Juárez', category: 'comercial', location: 'Juárez, CDMX', tag: 'Cafetería Specialty', image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&q=80' },
  { id: 'coyoacan', title: 'Residencia Coyoacán', category: 'residencial', location: 'Coyoacán, CDMX', tag: 'Casa Unifamiliar', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80' },
  { id: 'reforma', title: 'Oficinas Reforma', category: 'comercial', location: 'Paseo de la Reforma, CDMX', tag: 'Oficinas Corporativas', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
  { id: 'narvarte', title: 'Cocina Narvarte', category: 'carpinteria', location: 'Narvarte, CDMX', tag: 'Carpintería Residencial', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80' },
];

const filters = ['Todos', 'Comercial', 'Residencial', 'Carpintería'];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [heroRef, heroVis] = useInView({ threshold: 0.1 });

  const filteredProjects = activeFilter === 'Todos'
    ? projectsData
    : projectsData.filter(p => p.category === activeFilter.toLowerCase().replace('í', 'i'));

  const [gridRefs, gridVis] = useStaggerInView(projectsData.length, { staggerDelay: 100 });
  const [featRef, featVis] = useInView({ threshold: 0.15 });

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

      {/* ═══ SECTION 4: STATS ═══ */}
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

      {/* ═══ SECTION 5: CTA ═══ */}
      <section className="pp-cta" ref={ctaRef}>
        <div className={`container-default pp-cta-inner ${ctaVis ? 'in-view' : ''}`}>
          <h2 className="pp-cta-title">¿Tenés un proyecto en mente?</h2>
          <p className="pp-cta-text">Hablemos de cómo transformar tu espacio.</p>
          <Link to="/contacto" className="pp-cta-btn">Contactar</Link>
        </div>
      </section>
    </div>
  );
}
