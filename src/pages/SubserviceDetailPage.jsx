import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useWixCMSData } from '../hooks/useWixCMS';
import { useInView } from '../hooks/useInView';
import { resolveWixImage, resolveWixVideo } from '../lib/wixCMS';
import CTAConfigurator from '../components/CTAConfigurator';
import './SubserviceDetailPage.css';

// Curated high-res Unsplash images mapped to major categories for maximum aesthetic appeal
const categoryImages = {
  'Diseño Comercial': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
  'Interiorismo Residencial': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=80',
  'Carpintería y Mobiliario sobre Diseño': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1400&q=80',
  'Carpintería sobre Diseño': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1400&q=80',
  'Producción e Instalación': 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=1400&q=80'
};

export default function SubserviceDetailPage() {
  const { slug } = useParams();
  const { subservicios, proyectos, loading } = useWixCMSData();
  const [subservice, setSubservice] = useState(null);
  
  const [heroRef, heroVis] = useInView({ threshold: 0.1 });
  const [contentRef, contentVis] = useInView({ threshold: 0.1 });
  const [galRef, galVis] = useInView({ threshold: 0.1 });

  // Gallery slider states (declared at top to prevent conditional hook errors)
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const thumbRefs = useRef([]);

  // Scroll automático de miniaturas
  useEffect(() => {
    if (thumbRefs.current[activeSlide]) {
      thumbRefs.current[activeSlide].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeSlide]);

  useEffect(() => {
    if (!loading && subservicios) {
      setTimeout(() => {
        const found = subservicios.find(item => item.slug === slug || (item.data && item.data.slug === slug));
        setSubservice(found || null);
      }, 0);
    }
  }, [slug, subservicios, loading]);

  // Dynamically update document SEO tags
  useEffect(() => {
    if (subservice) {
      const data = subservice.data || subservice;
      const title = data.title || data.subservicio || '';
      document.title = data.tituloDeSeo || `${title} | Studio CAB | Carpintería sobre Diseño`;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = data.metadescripcin || `${title} en CDMX. Soluciones de fabricación y carpintería premium a la medida.`;
    }
  }, [subservice]);

  if (loading) {
    return (
      <div className="sub-detail-loading">
        <div className="spinner"></div>
        <p>Cargando especificaciones del subservicio...</p>
      </div>
    );
  }

  if (!subservice) {
    return (
      <div className="sub-detail-not-found page-enter">
        <h2>Subservicio no encontrado</h2>
        <p>No se pudo localizar el servicio con el slug especificado en el CMS.</p>
        <Link to="/servicios" className="back-btn">← Volver a Servicios</Link>
      </div>
    );
  }

  const data = subservice.data || subservice;
  const title = data.title || data.subservicio || data.nombre || '';
  
  // Mapeo detallado y flexible para cubrir posibles nombres de campos de Wix
  const description = data.descripcion || data.description || data.descripcin || `Servicio especializado de ${title} para proyectos residenciales y comerciales en CDMX.`;
  const paragraph2 = data['2ParrafoDescripcion'] || data.parrafo2 || data['2ParraffoDescripin'] || '';
  const excerpt = data.excerpt || data.resumen || '';
  const category = data.categoria || data.categora || data.category || 'Especializado';
  const subcategory = data.subcategoria || data.subcategora || data.subcategory || 'General';

  // WhatsApp Link normalization
  let waLink = data.enlaceDeWhatsapp || '';
  if (waLink) {
    if (waLink.startsWith('https://wa.me/?text=')) {
      waLink = waLink.replace('https://wa.me/?text=', 'https://wa.me/525516406963?text=');
    }
  } else {
    const waMessage = encodeURIComponent(`Hola Studio CAB. Me interesa cotizar el subservicio de *${title}* (Categoría: ${category}).`);
    waLink = `https://wa.me/525516406963?text=${waMessage}`;
  }

  const bgImage = categoryImages[category] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80';

  // 1. Filtrar proyectos asociados a este subservicio mediante multireferencias dinámicas de Wix CMS
  const relatedProjects = (proyectos || []).filter(proj => {
    const projData = proj.data || proj;
    const subserviceId = data._id;
    const subserviceTitleNormalized = title.toLowerCase().trim();
    const subserviceSlugNormalized = (slug || '').toLowerCase().trim();

    // Coincidencia directa en el arreglo de multireferencias de Wix Data
    if (Array.isArray(projData.subservicios) && projData.subservicios.length > 0) {
      const match = projData.subservicios.some(sub => {
        if (!sub) return false;
        const sId = sub._id || sub.id;
        const sSlug = (sub.slug || '').toLowerCase().trim();
        const sTitle = (sub.title || sub.subservicio || '').toLowerCase().trim();

        return (
          (sId && sId === subserviceId) ||
          (sSlug && sSlug === subserviceSlugNormalized) ||
          (sTitle && sTitle === subserviceTitleNormalized) ||
          (subserviceTitleNormalized && sTitle.includes(subserviceTitleNormalized))
        );
      });
      if (match) return true;
    }

    // Coincidencia secundaria en campos de texto o IDs
    const projSubservices = (
      projData.subserviciosTexto || 
      projData.subservicio || 
      projData.subserviciosAsociados || 
      ''
    );
    
    if (projSubservices && typeof projSubservices === 'string') {
      const textToSearch = projSubservices.toLowerCase();
      if (
        textToSearch.includes(subserviceTitleNormalized) || 
        textToSearch.includes(subserviceSlugNormalized) ||
        (subserviceId && textToSearch.includes(subserviceId))
      ) {
        return true;
      }
    }
    
    // Fallback: Coincidencia por palabra clave del subservicio en el título del proyecto
    if (subserviceTitleNormalized.includes('terraza') && projData.title.toLowerCase().includes('terraza')) return true;
    if (subserviceTitleNormalized.includes('boutique') && projData.title.toLowerCase().includes('boutique')) return true;
    if (subserviceTitleNormalized.includes('oficina') && projData.title.toLowerCase().includes('workstation')) return true;
    if (subserviceTitleNormalized.includes('hotel') && projData.title.toLowerCase().includes('barcelo')) return true;
    if (subserviceTitleNormalized.includes('cama') && projData.title.toLowerCase().includes('barcelo')) return true;
    if (subserviceTitleNormalized.includes('vestidor') && projData.title.toLowerCase().includes('condesa')) return true;
    if (subserviceTitleNormalized.includes('cocina') && projData.title.toLowerCase().includes('condesa')) return true;
    if (subserviceTitleNormalized.includes('gimnasio') && projData.title.toLowerCase().includes('gimnasio')) return true;
    
    return false;
  });

  // 2. Extraer y aplanar imágenes y videos de los proyectos relacionados
  const gallery = [];
  relatedProjects.forEach(proj => {
    const projData = proj.data || proj;
    const projTitle = projData.title || projData.nombre || '';
    const rawGallery = projData.mediagallery || [];
    rawGallery.forEach(item => {
      if (item.type === 'video') {
        const posterUrl = item.settings?.posters?.[0]?.url 
          ? `https://static.wixstatic.com/media/${item.settings.posters[0].url}` 
          : '';
        gallery.push({
          type: 'video',
          url: resolveWixVideo(item.slug || item.src),
          poster: posterUrl,
          projectName: projTitle
        });
      } else {
        gallery.push({
          type: 'image',
          url: resolveWixImage(item.src, 1200),
          originalUrl: resolveWixImage(item.src, 'original'),
          projectName: projTitle
        });
      }
    });
  });

  // 3. Fallbacks estéticos en caso de que no haya proyectos asociados cargados todavía
  if (gallery.length === 0) {
    const fallbacks = {
      'Diseño Comercial': [
        { type: 'image', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80', originalUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&q=90' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&q=80', originalUrl: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1600&q=90' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80', originalUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=90' }
      ],
      'Interiorismo Residencial': [
        { type: 'image', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80', originalUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=90' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80', originalUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=90' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', originalUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=90' }
      ],
      'default': [
        { type: 'image', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80', originalUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=90' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80', originalUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=90' }
      ]
    };
    const selectedFallback = fallbacks[category] || fallbacks['default'];
    gallery.push(...selectedFallback);
  }

  const handleThumbClick = (i) => {
    setActiveSlide(i);
    if (thumbRefs.current[i]) {
      thumbRefs.current[i].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  return (
    <div className="sub-detail page-enter">
      
      {/* ═══ IMMERSIVE HERO ═══ */}
      <section className="sub-hero" ref={heroRef} style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="sub-hero-overlay" />
        <div className="sub-hero-grain" />
        <div className={`sub-hero-content ${heroVis ? 'in-view' : ''}`}>
          <div className="sub-breadcrumbs">
            <Link to="/">Inicio</Link>
            <span className="separator">/</span>
            <Link to="/servicios">Servicios</Link>
            <span className="separator">/</span>
            <span className="current">{category}</span>
          </div>
          
          <h1 className="sub-title">{title}</h1>
          {excerpt && <p className="sub-excerpt">{excerpt}</p>}
        </div>
      </section>

      {/* ═══ CONTENT DETAILS SPLIT ═══ */}
      <section className="sub-body container-default" ref={contentRef}>
        <div className={`sub-body-grid ${contentVis ? 'in-view' : ''}`}>
          
          {/* LEFT: TEXT CONTENT */}
          <div className="sub-body-left">
            <span className="section-eyebrow">[ESPECIFICACIONES TÉCNICAS]</span>
            <h2 className="sub-info-heading">Diseño, ingeniería y producción integrada.</h2>
            
            <p className="sub-desc-lead">{description}</p>
            {paragraph2 && <p className="sub-desc-secondary">{paragraph2}</p>}
            
            <div className="sub-meta-table">
              {category !== 'Especializado' && (
                <div className="meta-row">
                  <span className="meta-label">Sector Principal:</span>
                  <span className="meta-value">{category}</span>
                </div>
              )}
              {subcategory !== 'General' && (
                <div className="meta-row">
                  <span className="meta-label">Especialización:</span>
                  <span className="meta-value">{subcategory}</span>
                </div>
              )}
              <div className="meta-row">
                <span className="meta-label">Área de Cobertura:</span>
                <span className="meta-value">CDMX y Área Metropolitana (Interior de la República bajo cotización)</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Materialidad Sugerida:</span>
                <span className="meta-value">Maderas certificadas, tableros hidrófugos y piedras sinterizadas</span>
              </div>
            </div>
          </div>

          {/* RIGHT: B2B CONTACT AND ESTIMATE ACTION CARD */}
          <div className="sub-body-right">
            <div className="sub-action-card">
              <span className="card-badge">B2B Soluciones</span>
              <h3 className="card-title">¿Listo para iniciar tu cotización?</h3>
              <p className="card-desc">
                Cuéntanos sobre tu espacio, medidas y materiales de interés. Nuestro equipo de ingenieros y diseñadores estructurará una propuesta fotorrealista a tu medida.
              </p>
              
              <div className="card-actions">
                <a 
                  href={waLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="sub-wa-action-btn"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.812.48 3.564 1.392 5.124L2 22l5.004-1.308c1.512.828 3.204 1.272 4.992 1.272C17.52 22 22 17.52 22 12.012c0-2.676-1.044-5.184-2.928-7.08C17.184 3.036 14.688 2 12.012 2zm5.724 14.124c-.252.708-1.464 1.296-2.004 1.344-.492.048-.972.24-3.156-.624-2.772-1.104-4.524-3.924-4.656-4.104-.132-.18-1.092-1.452-1.092-2.772 0-1.32.684-1.968.936-2.232.252-.264.672-.384 1.08-.384.144 0 .276.012.396.012.348.012.516.036.744.576.228.552.792 1.932.864 2.076.072.144.12.312.024.504-.096.192-.144.312-.288.48-.144.168-.312.384-.444.516-.144.144-.3.3-.132.588.168.288.756 1.248 1.62 2.016.924.816 1.704 1.068 1.944 1.188.24.12.384.108.528-.06.144-.168.624-.72.792-.96.168-.24.336-.204.564-.12.228.084 1.452.684 1.704.816.252.132.42.192.48.3.06.108.06.624-.192 1.332z" />
                  </svg>
                  Cotizar por WhatsApp
                </a>
                
                <a 
                  href="#cta-configurator"
                  className="sub-form-action-btn"
                >
                  Usar Planificador de Proyecto
                </a>
              </div>
              
              <div className="card-footer-info">
                <span>⏱️ Respuesta en menos de 24 horas</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══ CINEMATIC CAROUSEL GALLERY ═══ */}
      {gallery.length > 0 && (
        <section className="pdv2-gallery">
          <div className="container-default">
            <span className="section-eyebrow">[GALERÍA DE TRABAJOS]</span>
            <h2 className="section-heading">Proyectos y <em>detalles reales</em>.</h2>
            
            <div className={`pdv2-gallery-slider ${galVis ? 'in-view' : ''}`} ref={galRef}>
              <div className="pdv2-slider-viewport">
                <div 
                  className="pdv2-slider-track"
                  style={{ transform: `translate3d(-${activeSlide * 100}%, 0, 0)` }}
                >
                  {gallery.map((item, i) => (
                    <div key={i} className="pdv2-slide" onClick={() => setLightbox(i)}>
                      {item.type === 'video' ? (
                        <div className="pdv2-video-wrapper">
                          <video src={item.url} poster={item.poster} muted loop playsInline />
                          <div className="pdv2-video-play-indicator">▶</div>
                        </div>
                      ) : (
                        <img src={item.url} alt="" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider Arrows */}
              <button 
                className="pdv2-slider-arrow prev" 
                onClick={() => setActiveSlide(activeSlide > 0 ? activeSlide - 1 : gallery.length - 1)}
              >
                ←
              </button>
              <button 
                className="pdv2-slider-arrow next" 
                onClick={() => setActiveSlide(activeSlide < gallery.length - 1 ? activeSlide + 1 : 0)}
              >
                →
              </button>

              {/* Slide Counter */}
              <div className="pdv2-slider-counter">
                <span>{String(activeSlide + 1).padStart(2, '0')}</span>
                <span className="divider">/</span>
                <span>{String(gallery.length).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Thumbnails Navigation */}
            {gallery.length > 1 && (
              <div className="pdv2-slider-thumbs-container">
                <div className="pdv2-slider-thumbs">
                  {gallery.map((item, i) => (
                    <button
                      key={i}
                      ref={el => thumbRefs.current[i] = el}
                      className={`pdv2-slider-thumb ${i === activeSlide ? 'active' : ''}`}
                      onClick={() => handleThumbClick(i)}
                    >
                      {item.type === 'video' ? (
                        <div className="thumb-video-placeholder">VÍDEO</div>
                      ) : (
                        <img src={item.url} alt="" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══ MASONRY / GRID GALERÍA COMPLETA DE PROYECTOS VINCULADOS ═══ */}
      {gallery.length > 0 && (
        <section className="sub-grid-gallery-section">
          <div className="container-default">
            <div className="sub-grid-gallery-header">
              <span className="section-eyebrow">[GALERÍA COMPLETA DE PROYECTOS]</span>
              <h2 className="section-heading">Fotografías y Renders <em>vinculados a {title}</em>.</h2>
              <p className="sub-grid-gallery-sub">
                Colección de detalles visuales y ejecuciones reales registradas en el CMS de proyectos de Studio CAB para esta especialidad.
              </p>
            </div>

            <div className="sub-grid-gallery">
              {gallery.map((item, idx) => (
                <div 
                  key={idx} 
                  className="sub-grid-card"
                  onClick={() => setLightbox(idx)}
                >
                  {item.type === 'video' ? (
                    <div className="sub-grid-media-box video-box">
                      <video src={item.url} poster={item.poster} muted loop playsInline />
                      <div className="sub-grid-play-badge">▶ Video Real</div>
                    </div>
                  ) : (
                    <div className="sub-grid-media-box">
                      <img src={item.url} alt={`${title} - Proyecto Studio CAB`} loading="lazy" />
                      <div className="sub-grid-hover-overlay">
                        <span>Ver en Alta Resolución ⊕</span>
                      </div>
                    </div>
                  )}
                  {item.projectName && (
                    <span className="sub-grid-project-tag">{item.projectName}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox rendered in document.body Portal to escape transforms */}
      {lightbox !== null && createPortal(
        <div className="pdv2-lightbox" onClick={() => setLightbox(null)}>
          <button className="pdv2-lb-close" onClick={() => setLightbox(null)}>✕</button>
          {gallery[lightbox].type === 'video' ? (
            <video 
              src={gallery[lightbox].url} 
              poster={gallery[lightbox].poster} 
              controls 
              autoPlay 
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '80vh', maxWidth: '90vw' }} 
            />
          ) : (
            <img 
              src={gallery[lightbox].originalUrl} 
              alt="" 
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <div className="pdv2-lb-nav" onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox > 0 ? lightbox - 1 : gallery.length - 1); }}>←</button>
            <span>{lightbox + 1} / {gallery.length}</span>
            <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox < gallery.length - 1 ? lightbox + 1 : 0); }}>→</button>
          </div>
          
          {/* WhatsApp CTA Button in Lightbox */}
          <div className="pdv2-lb-whatsapp-container" onClick={(e) => e.stopPropagation()}>
            <a 
              href={`https://wa.me/525516406963?text=${encodeURIComponent(
                `Hola Studio CAB, me interesa cotizar un diseño similar a este detalle de ${title}: ${gallery[lightbox].originalUrl || gallery[lightbox].url}`
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

      {/* ═══ CONFIGURATOR FORM ═══ */}
      <CTAConfigurator source={`Subservicio: ${title}`} />
    </div>
  );
}
