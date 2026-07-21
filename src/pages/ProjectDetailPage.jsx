import { useParams, Link } from 'react-router-dom';
import { useInView, useStaggerInView } from '../hooks/useInView';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ProjectDetailPage.css';

import { useWixCMSData } from '../hooks/useWixCMS';
import { resolveWixImage, resolveWixVideo } from '../lib/wixCMS';
import CTAConfigurator from '../components/CTAConfigurator';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { proyectos, loading } = useWixCMSData();

  const rawProject = (proyectos || []).find(p => p._id === id);
  
  let project = null;
  if (rawProject) {
    let cat = 'Proyecto Comercial';
    if (rawProject.servicioPrincipal === '8e5d5551-a1fa-4272-958e-1a01eacdb7ff') cat = 'Proyecto Residencial';
    else if (rawProject.servicioPrincipal === '06a2037c-149b-4fd6-844f-b9814340f9b8') cat = 'Carpintería';
    else if (rawProject.servicioPrincipal === 'f9aa307d-3523-4a2c-a202-826a5889ea3d') cat = 'Producción';

    // Parse gallery
    const rawGallery = rawProject.mediagallery || [];
    const gallery = rawGallery.map(g => {
      if (g.type === 'video') {
        const posterUrl = g.settings?.posters?.[0]?.url 
          ? `https://static.wixstatic.com/media/${g.settings.posters[0].url}` 
          : '';
        return { type: 'video', url: resolveWixVideo(g.slug || g.src), poster: posterUrl };
      }
      return { 
        type: 'image', 
        url: resolveWixImage(g.src, 1600), 
        originalUrl: resolveWixImage(g.src, 'original') 
      };
    });

    const narrative = [];
    if (rawProject.elReto) narrative.push({ num: '01', title: 'El Reto', text: rawProject.elReto });
    if (rawProject.laSolucin) narrative.push({ num: '02', title: 'La Solución', text: rawProject.laSolucin });
    if (rawProject.elImpacto) narrative.push({ num: '03', title: 'El Impacto', text: rawProject.elImpacto });

    project = {
      title: rawProject.title,
      location: rawProject.zonaDelProyecto,
      category: cat,
      area: rawProject.superficie,
      duration: rawProject.duracin,
      year: rawProject.ao,
      services: [], // Or map from related if it existed
      heroImage: resolveWixImage(rawProject.imagenPrincipal, 1400),
      fotoConRelieves: resolveWixImage(rawProject.fotoConRelieves, 1400),
      gallery: gallery,
      narrative: narrative,
      materials: [], // Not supported in Wix schema yet
      testimonial: null, // Not supported in Wix schema yet
      related: [] // Not supported in Wix schema yet
    };
  }

  const [heroRef, heroVis] = useInView({ threshold: 0.05 });
  const [specRef, specVis] = useInView({ threshold: 0.1 });
  const [galRef, galVis] = useInView({ threshold: 0.1 });
  const narCount = project?.narrative?.length || 0;
  const [narRefs, narVis] = useStaggerInView(narCount, { staggerDelay: 200 });
  const [materialsRef, materialsVis] = useInView({ threshold: 0.15 });
  const [testRef, testVis] = useInView({ threshold: 0.2 });
  const [relRef, relVis] = useInView({ threshold: 0.1 });

  // Parallax hero
  const heroImgRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      if (heroImgRef.current && window.scrollY < 1200) {
        heroImgRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0) scale(1.15)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cinematic Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const thumbRefs = useRef([]);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setActiveSlide(prev => (prev < project.gallery.length - 1 ? prev + 1 : 0));
    }
    if (isRightSwipe) {
      setActiveSlide(prev => (prev > 0 ? prev - 1 : project.gallery.length - 1));
    }
  };

  // Center active thumbnail automatically
  useEffect(() => {
    if (thumbRefs.current[activeSlide]) {
      thumbRefs.current[activeSlide].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeSlide]);

  if (loading) {
    return (
      <div className="pdv2-loading-screen">
        <div className="pdv2-loading-spinner">
          <div className="pdv2-spinner-ring"></div>
          <span className="pdv2-loading-text">Cargando Proyecto</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-enter" style={{ padding: '200px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: 'var(--colors--theme-black)' }}>Proyecto no encontrado</h1>
        <Link to="/proyectos" style={{ color: 'var(--colors--theme-orange)', fontWeight: 700, marginTop: 20, display: 'inline-block' }}>← Volver a Proyectos</Link>
      </div>
    );
  }

  const specs = [];
  if (project.title) specs.push({ label: 'Proyecto', value: project.title });
  if (project.location) specs.push({ label: 'Ubicación', value: project.location });
  if (project.area) specs.push({ label: 'Superficie', value: project.area });
  if (project.duration) specs.push({ label: 'Duración', value: project.duration });
  if (project.year) specs.push({ label: 'Año', value: project.year });

  return (
    <div className="project-detail page-enter">

      {/* ═══ 1: CINEMATIC HERO ═══ */}
      <section className="pdv2-hero" ref={heroRef}>
        <div className="pdv2-hero-media">
          <img ref={heroImgRef} src={project.heroImage} alt={project.title} className="pdv2-hero-img" />
          <div className="pdv2-hero-overlay" />
          <div className="pdv2-hero-grain" />
        </div>
        <div className={`pdv2-hero-content ${heroVis ? 'in-view' : ''}`}>
          <span className="pdv2-hero-category">{project.category}</span>
          <h1 className="pdv2-hero-title">
            {project.title.split(' ').map((word, wi, arr) => (
              <span key={wi} className="pdv2-word">
                {word.split('').map((char, ci) => {
                  const idx = arr.slice(0, wi).join(' ').length + (wi > 0 ? 1 : 0) + ci;
                  return (
                    <span key={ci} className="pdv2-letter" style={{ animationDelay: `${0.5 + idx * 0.04}s` }}>
                      {char}
                    </span>
                  );
                })}
                {wi < arr.length - 1 && <span className="pdv2-letter">&nbsp;</span>}
              </span>
            ))}
          </h1>
          <p className="pdv2-hero-location">{project.location} · {project.year}</p>
        </div>
        <div className="pdv2-scroll-hint">
          <span>Descubrí el proyecto</span>
          <div className="pdv2-scroll-bar" />
        </div>
      </section>

      {/* ═══ 2: SPECS BAR ═══ */}
      <section className="pdv2-specs" ref={specRef}>
        <div className={`pdv2-specs-inner ${specVis ? 'in-view' : ''}`}>
          {specs.map((spec, i) => (
            <div key={i} className="pdv2-spec" style={{ transitionDelay: `${i * 0.08}s` }}>
              <span className="pdv2-spec-label">{spec.label}</span>
              <span className="pdv2-spec-value">{spec.value}</span>
            </div>
          ))}
          {project.services && project.services.length > 0 && (
            <div className="pdv2-spec pdv2-spec-services" style={{ transitionDelay: '0.4s' }}>
              <span className="pdv2-spec-label">Servicios</span>
              <div className="pdv2-spec-tags">
                {project.services.map((s, i) => (
                  <span key={i} className="pdv2-service-tag">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ 3: CINEMATIC CAROUSEL GALLERY ═══ */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="pdv2-gallery" ref={galRef}>
          <div className={`pdv2-gallery-slider ${galVis ? 'in-view' : ''}`}>
            
            {/* Viewport frame */}
            <div 
              className="pdv2-slider-viewport"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Slider Track */}
              <div 
                className="pdv2-slider-track"
                style={{ transform: `translate3d(-${activeSlide * 100}%, 0, 0)` }}
              >
                {project.gallery.map((media, i) => (
                  <div 
                    key={i} 
                    className={`pdv2-slide ${i === activeSlide ? 'active' : ''}`}
                    onClick={() => setLightbox(i)}
                  >
                    {media.type === 'video' ? (
                      <video src={media.url} poster={media.poster} autoPlay loop muted playsInline />
                    ) : (
                      <img src={media.url} alt={`${project.title} ${i + 1}`} />
                    )}
                    <div className="pdv2-slide-overlay">
                      <span className="pdv2-slide-zoom">🔍 Ampliar Imagen</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Controls */}
              <button 
                className="pdv2-slider-arrow prev" 
                onClick={(e) => { e.stopPropagation(); setActiveSlide(prev => (prev > 0 ? prev - 1 : project.gallery.length - 1)); }}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button 
                className="pdv2-slider-arrow next" 
                onClick={(e) => { e.stopPropagation(); setActiveSlide(prev => (prev < project.gallery.length - 1 ? prev + 1 : 0)); }}
                aria-label="Siguiente"
              >
                ›
              </button>

              {/* Slider Counter */}
              <div className="pdv2-slider-counter">
                <span className="current">{String(activeSlide + 1).padStart(2, '0')}</span>
                <span className="separator">/</span>
                <span className="total">{String(project.gallery.length).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Scrollable Thumbnails track */}
            <div className="pdv2-slider-thumbs-container">
              <div className="pdv2-slider-thumbs">
                {project.gallery.map((media, i) => (
                  <button
                    key={i}
                    ref={el => thumbRefs.current[i] = el}
                    className={`pdv2-slider-thumb ${i === activeSlide ? 'active' : ''}`}
                    onClick={() => setActiveSlide(i)}
                  >
                    {media.type === 'video' ? (
                      <div className="pdv2-thumb-video-placeholder">
                        <img src={media.poster || project.heroImage} alt="" />
                        <span className="pdv2-thumb-play-icon">▶</span>
                      </div>
                    ) : (
                      <img src={media.url.replace('w=1000', 'w=150')} alt="" />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Lightbox rendered in document.body Portal to escape transforms */}
      {lightbox !== null && createPortal(
        <div className="pdv2-lightbox" onClick={() => setLightbox(null)}>
          <button className="pdv2-lb-close" onClick={() => setLightbox(null)}>✕</button>
          {project.gallery[lightbox].type === 'video' ? (
            <video 
              src={project.gallery[lightbox].url} 
              poster={project.gallery[lightbox].poster} 
              controls 
              autoPlay 
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '80vh', maxWidth: '90vw' }} 
            />
          ) : (
            <img 
              src={project.gallery[lightbox].originalUrl} 
              alt="" 
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <div className="pdv2-lb-nav" onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox > 0 ? lightbox - 1 : project.gallery.length - 1); }}>←</button>
            <span>{lightbox + 1} / {project.gallery.length}</span>
            <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox < project.gallery.length - 1 ? lightbox + 1 : 0); }}>→</button>
          </div>
          
          {/* WhatsApp CTA Button in Lightbox */}
          <div className="pdv2-lb-whatsapp-container" onClick={(e) => e.stopPropagation()}>
            <a 
              href={`https://wa.me/525516406963?text=${encodeURIComponent(
                `Hola Studio CAB, me interesa cotizar un diseño similar a este detalle del proyecto *${project.title}*: ${project.gallery[lightbox].originalUrl || project.gallery[lightbox].url}`
              )}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="pdv2-lb-whatsapp-btn"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.812.48 3.564 1.392 5.124L2 22l5.004-1.308c1.512.828 3.204 1.272 4.992 1.272C17.52 22 22 17.52 22 12.012c0-2.676-1.044-5.184-2.928-7.08C17.184 3.036 14.688 2 12.012 2zm5.724 14.124c-.252.708-1.464 1.296-2.004 1.344-.492.048-.972.24-3.156-.624-2.772-1.104-4.524-3.924-4.656-4.104-.132-.18-1.092-1.452-1.092-2.772 0-1.32.684-1.968.936-2.232.252-.264.672-.384 1.08-.384.144 0 .276.012.396.012.348.012.516.036.744.576.228.552.792 1.932.864 2.076.072.144.12.312.024.504-.096.192-.144.312-.288.48-.144.168-.312.384-.444.516-.144.144-.3.3-.132.588.168.288.756 1.248 1.62 2.016.924.816 1.704 1.068 1.944 1.188.24.12.384.108.528-.06.144-.168.624-.72.792-.96.168-.24.336-.204.564-.12.228.084 1.452.684 1.704.816.252.132.42.192.48.3.06.108.06.624-.192 1.332z" />
              </svg>
              <span>Consultar este detalle</span>
            </a>
          </div>
        </div>,
        document.body
      )}

      {/* FOTO CON RELIEVES SEPARATOR */}
      {project.fotoConRelieves && (
        <section className="pdv2-foto-relieves" style={{ width: '100%', height: '70vh', marginTop: '100px', overflow: 'hidden', position: 'relative' }}>
          <img 
            src={project.fotoConRelieves} 
            alt="Detalle relieve" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </section>
      )}

      {/* ═══ 4: NARRATIVE ═══ */}
      {project.narrative && project.narrative.length > 0 && (
        <section className="pdv2-narrative">
          <div className="container-default">
            <span className="section-eyebrow anim-fade-up in-view">Case Study</span>
            <h2 className="section-heading anim-fade-up in-view">La <em>historia</em>.</h2>
            <div className="pdv2-nar-timeline">
              <div className="pdv2-nar-line" />
              {project.narrative.map((item, i) => (
                <div key={i} ref={el => narRefs.current[i] = el} className={`pdv2-nar-step ${narVis[i] ? 'in-view' : ''} ${i % 2 === 0 ? 'left' : 'right'}`}>
                  <div className="pdv2-nar-dot" />
                  <div className="pdv2-nar-card">
                    <span className="pdv2-nar-num">{item.num}</span>
                    <h3 className="pdv2-nar-title">{item.title}</h3>
                    <p className="pdv2-nar-text">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 5: PALETA DE MATERIALES (NUEVA) ═══ */}
      {project.materials && project.materials.length > 0 && (
        <section className="pdv2-materials-section" ref={materialsRef}>
          <div className="container-default">
            <span className={`section-eyebrow ${materialsVis ? 'in-view' : ''}`}>Materialidad</span>
            <h2 className={`section-heading ${materialsVis ? 'in-view' : ''}`}>Paleta de <em>texturas y acabados</em>.</h2>
            
            <div className={`pdv2-materials-grid ${materialsVis ? 'in-view' : ''}`}>
              {project.materials.map((mat, i) => (
                <div key={i} className="pdv2-material-card" style={{ transitionDelay: `${i * 0.15}s` }}>
                  <div className="pdv2-mat-img-box">
                    <img src={mat.image} alt={mat.name} />
                  </div>
                  <div className="pdv2-mat-info">
                    <h4 className="pdv2-mat-name">{mat.name}</h4>
                    <p className="pdv2-mat-desc">{mat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 6: TESTIMONIAL ═══ */}
      {project.testimonial && (
        <section className="pdv2-testimonial" ref={testRef}>
          <div className={`container-default pdv2-test-inner ${testVis ? 'in-view' : ''}`}>
            <div className="pdv2-test-mark">"</div>
            <blockquote className="pdv2-test-quote">{project.testimonial.quote}</blockquote>
            <div className="pdv2-test-author">
              <div className="pdv2-test-divider" />
              <div>
                <span className="pdv2-test-name">{project.testimonial.author}</span>
                <span className="pdv2-test-role">{project.testimonial.role}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ 7: RELATED ═══ */}
      {project.related && project.related.length > 0 && (
        <section className="pdv2-related" ref={relRef}>
          <div className="container-default">
            <h2 className="section-heading anim-fade-up in-view">Más <em>proyectos</em>.</h2>
            <div className={`pdv2-related-grid ${relVis ? 'in-view' : ''}`}>
              {project.related.map(() => {
                // If related is used, would need to map from CMS too
                return null;
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 8: CONFIGURATOR CTA BANNER ═══ */}
      <CTAConfigurator source={`Proyecto: ${project.title}`} />
    </div>
  );
}
