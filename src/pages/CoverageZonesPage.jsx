import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWixCMSData } from '../hooks/useWixCMS';
import { useDocumentSEO } from '../hooks/useDocumentSEO';
import { useInView } from '../hooks/useInView';
import CTAConfigurator from '../components/CTAConfigurator';
import './CoverageZonesPage.css';

export default function CoverageZonesPage() {
  useDocumentSEO(
    'Zonas de Cobertura y Landings | Grupo CAB Studio CDMX',
    'Hub dinámico de zonas de cobertura, proyectos y landings de interiorismo, carpintería sobre diseño y tapicería en CDMX y Área Metropolitana.'
  );

  const { subservicios, landingsDeCiudad, loading } = useWixCMSData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');

  const [heroRef, heroVis] = useInView({ threshold: 0.1 });
  const [gridRef, gridVis] = useInView({ threshold: 0.05 });

  // 1. Combinar Subservicios activos y LandingsdeCiudad en una sola lista unificada
  const activeLandings = useMemo(() => {
    const list = [];

    // Subservicios (pre-filtrados por aparecenEnCategora en la API)
    if (subservicios) {
      subservicios.forEach(item => {
        const data = item.data || item;
        list.push({
          id: item._id,
          title: data.title || data.subservicio || '',
          category: data.categoria || data.categora || data.category || 'Especializado',
          description: data.excerpt || data.descripcin || data.description || '',
          slug: data.slug || item._id,
          type: 'subservicio',
          targetUrl: `/subservicios/${data.slug || item._id}`
        });
      });
    }

    // Landings de Ciudad (LandingsdeCiudad collection)
    if (landingsDeCiudad) {
      landingsDeCiudad.forEach(item => {
        const data = item.data || item;
        list.push({
          id: item._id,
          title: data.tituloPgina || data.title || '',
          category: data.ciudadOEstado ? `Zona: ${data.ciudadOEstado.split('(')[0].trim()}` : 'Cobertura Nacional',
          description: data.excerptPgina || data.fraseCorta || '',
          slug: data.slug || item._id,
          type: 'ciudad',
          targetUrl: `/ciudad/${data.slug || item._id}`
        });
      });
    }

    return list;
  }, [subservicios, landingsDeCiudad]);

  // 2. Extraer categorías únicas para las pestañas del repetidor
  const categories = useMemo(() => {
    const set = new Set();
    activeLandings.forEach(item => {
      if (item.category) set.add(item.category);
    });
    return ['Todas', ...Array.from(set).sort()];
  }, [activeLandings]);

  // 3. Filtrar dinámicamente por término de búsqueda y categoría
  const filteredLandings = useMemo(() => {
    return activeLandings.filter(item => {
      const title = (item.title || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();

      const search = searchTerm.toLowerCase().trim();
      const matchesSearch = !search || 
        title.includes(search) || 
        desc.includes(search) || 
        cat.includes(search);

      const matchesCat = activeCategory === 'Todas' || item.category === activeCategory;

      return matchesSearch && matchesCat;
    });
  }, [activeLandings, searchTerm, activeCategory]);

  return (
    <div className="coverage-zones-page page-enter">
      
      {/* ═══ 1: HERO HUB ═══ */}
      <section className="cz-hero" ref={heroRef}>
        <div className="cz-hero-grain" />
        <div className={`cz-hero-content ${heroVis ? 'in-view' : ''}`}>
          <div className="cz-breadcrumbs">
            <Link to="/">Inicio</Link>
            <span className="separator">/</span>
            <span className="current">Zonas de Cobertura</span>
          </div>
          
          <h1 className="cz-title">
            Hub de <em>Zonas y Landings</em>.
          </h1>
          <p className="cz-subtitle">
            Directorio dinámico de cobertura en CDMX y Área Metropolitana. Explora nuestras especialidades y zonas de atención en tiempo real.
          </p>

          {/* Controls Bar: Search + Stats */}
          <div className="cz-controls-bar">
            <div className="cz-search-input-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cz-search-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text"
                className="cz-search-input"
                placeholder="Buscar por zona, colonia (Polanco, Condesa, Santa Fe...) o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="cz-clear-search" onClick={() => setSearchTerm('')}>✕</button>
              )}
            </div>

            <div className="cz-counter-badge">
              <span className="cz-counter-num">{loading ? '...' : filteredLandings.length}</span>
              <span className="cz-counter-lbl">Landings Activas</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2: REPETIDOR DINÁMICO ═══ */}
      <section className="cz-grid-section container-default" ref={gridRef}>
        
        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="cz-tabs">
            {categories.map((cat, idx) => {
              const count = cat === 'Todas' 
                ? activeLandings.length 
                : activeLandings.filter(i => i.category === cat).length;
              return (
                <button
                  key={idx}
                  className={`cz-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat} <span className="tab-count">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="cz-loading-screen">
            <div className="cz-spinner"></div>
            <p>Cargando landings dinámicas desde Wix CMS...</p>
          </div>
        ) : filteredLandings.length === 0 ? (
          <div className="cz-empty-state">
            <h3>No se encontraron zonas o especialidades</h3>
            <p>Intenta con otro término de búsqueda o selecciona otra categoría.</p>
            <button className="cz-reset-btn" onClick={() => { setSearchTerm(''); setActiveCategory('Todas'); }}>
              Ver todas las landings
            </button>
          </div>
        ) : (
          <div className={`cz-repeater-grid ${gridVis ? 'in-view' : ''}`}>
            {filteredLandings.map((item, idx) => {
              const waMessage = encodeURIComponent(`SW- Hola Studio CAB. Me interesa información sobre *${item.title}* en mi zona.`);
              const waLink = `https://wa.me/525516406963?text=${waMessage}`;

              return (
                <article key={item.id || idx} className="cz-card">
                  <div className="cz-card-header">
                    <span className="cz-card-tag">{item.category}</span>
                    <span className="cz-card-code">HUB // {String(idx + 1).padStart(3, '0')}</span>
                  </div>

                  <h3 className="cz-card-title">{item.title}</h3>
                  <p className="cz-card-desc">{item.description}</p>

                  <div className="cz-card-footer">
                    <Link to={item.targetUrl} className="cz-card-link">
                      Ver Landing ↗
                    </Link>

                    <a 
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cz-card-wa"
                      title="Cotizar directamente en WhatsApp"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.812.48 3.564 1.392 5.124L2 22l5.004-1.308c1.512.828 3.204 1.272 4.992 1.272C17.52 22 22 17.52 22 12.012c0-2.676-1.044-5.184-2.928-7.08C17.184 3.036 14.688 2 12.012 2zm5.724 14.124c-.252.708-1.464 1.296-2.004 1.344-.492.048-.972.24-3.156-.624-2.772-1.104-4.524-3.924-4.656-4.104-.132-.18-1.092-1.452-1.092-2.772 0-1.32.684-1.968.936-2.232.252-.264.672-.384 1.08-.384.144 0 .276.012.396.012.348.012.516.036.744.576.228.552.792 1.932.864 2.076.072.144.12.312.024.504-.096.192-.144.312-.288.48-.144.168-.312.384-.444.516-.144.144-.3.3-.132.588.168.288.756 1.248 1.62 2.016.924.816 1.704 1.068 1.944 1.188.24.12.384.108.528-.06.144-.168.624-.72.792-.96.168-.24.336-.204.564-.12.228.084 1.452.684 1.704.816.252.132.42.192.48.3.06.108.06.624-.192 1.332z" />
                      </svg>
                      Cotizar
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══ 3: CONFIGURATOR CTA ═══ */}
      <CTAConfigurator source="Zonas de Cobertura Hub" />
    </div>
  );
}
