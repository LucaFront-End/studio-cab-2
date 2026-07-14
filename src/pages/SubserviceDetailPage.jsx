import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useWixCMSData } from '../hooks/useWixCMS';
import { useInView } from '../hooks/useInView';
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
  const { subservicios, loading } = useWixCMSData();
  const [subservice, setSubservice] = useState(null);
  
  const [heroRef, heroVis] = useInView({ threshold: 0.1 });
  const [contentRef, contentVis] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (!loading && subservicios) {
      const found = subservicios.find(item => item.slug === slug || (item.data && item.data.slug === slug));
      setSubservice(found || null);
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
  const title = data.title || data.subservicio || '';
  const description = data.descripcin || data.description || '';
  const paragraph2 = data['2ParraffoDescripin'] || '';
  const excerpt = data.excerpt || '';
  const category = data.categora || '';
  const subcategory = data.subcategora || data.subcategoria || '';

  // WhatsApp Link normalization
  let waLink = data.enlaceDeWhatsapp || '';
  if (waLink) {
    if (waLink.startsWith('https://wa.me/?text=')) {
      waLink = waLink.replace('https://wa.me/?text=', 'https://wa.me/525512345678?text=');
    }
  } else {
    const waMessage = encodeURIComponent(`Hola Studio CAB. Me interesa cotizar el subservicio de *${title}* (Categoría: ${category}).`);
    waLink = `https://wa.me/525512345678?text=${waMessage}`;
  }

  // Pre-fill link for standard contact form
  const contactState = {
    selectedType: ['gimnasios', 'hoteles', 'oficinas', 'restaurantes'].includes(subcategory.toLowerCase()) ? subcategory.toLowerCase() : 'otro',
    message: `Hola Studio CAB. Me interesa cotizar el subservicio de *${title}* dentro del sector de ${category}.\n\nPor favor envíenme más información.`
  };

  const bgImage = categoryImages[category] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80';

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
              <div className="meta-row">
                <span className="meta-label">Sector Principal:</span>
                <span className="meta-value">{category}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Especialización:</span>
                <span className="meta-value">{subcategory}</span>
              </div>
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
                
                <Link 
                  to="/contacto" 
                  state={contactState}
                  className="sub-form-action-btn"
                >
                  Usar Planificador de Proyecto
                </Link>
              </div>
              
              <div className="card-footer-info">
                <span>⏱️ Respuesta en menos de 24 horas</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
