import { useParams, Link } from 'react-router-dom';
import { useInView, useStaggerInView } from '../hooks/useInView';
import './ServiceDetailPage.css';

const allServices = {
  comercial: {
    title: 'Diseño Comercial', subtitle: 'Espacios que venden, experiencias que conectan.',
    tag: 'Retail · Oficinas · Restaurantes', heroImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
    description: 'En Studio CAB diseñamos espacios comerciales que trascienden la estética para convertirse en herramientas estratégicas de negocio. Cada proyecto se desarrolla con un enfoque en el comportamiento del consumidor, la identidad de marca y la optimización del flujo operativo.',
    longText: 'Nuestro equipo combina arquitectura de interiores, diseño gráfico ambiental y ergonomía comercial para crear entornos que maximizan la experiencia del cliente y, en consecuencia, los ingresos. Trabajamos con restaurantes, cafés, boutiques, showrooms y oficinas corporativas.',
    gallery: [
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80',
      'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    ],
    benefits: [
      { icon: 'focus', title: 'Diseño centrado en ventas', text: 'Layouts que optimizan recorridos y elevan conversiones.' },
      { icon: 'identity', title: 'Identidad de marca espacial', text: 'Tu marca vive en cada pared, mostrador y textura.' },
      { icon: 'quality', title: 'Materialidad premium', text: 'Piedra, madera y metal de primer nivel con acabados de lujo.' },
      { icon: 'delivery', title: 'Plazos garantizados', text: 'Entrega en tiempo contractual o ajustamos presupuesto.' },
    ],
  },
  residencial: {
    title: 'Interiorismo Residencial', subtitle: 'Tu hogar, tu identidad personal.',
    tag: 'Casas · Departamentos · Penthouses', heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    description: 'Diseñamos espacios habitacionales sofisticados donde cada rincón refleja la personalidad del habitante. La precisión constructiva se funde con texturas naturales de mármol, madera de nogal y acabados minerales.',
    longText: 'Desde departamentos de diseño en la Condesa hasta residencias de lujo en Bosques de las Lomas, nuestro enfoque combina funcionalidad con sensibilidad estética. Cada detalle — desde la veta de la madera hasta la temperatura de la iluminación — está cuidadosamente curado.',
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    ],
    benefits: [
      { icon: 'focus', title: 'Diseño personalizado', text: 'Cada proyecto es único, adaptado a tu estilo de vida.' },
      { icon: 'quality', title: 'Materiales nobles', text: 'Mármol, nogal, roble y piedra natural de primera calidad.' },
      { icon: 'identity', title: 'Iluminación escénica', text: 'Diseño lumínico integrado para cada ambiente y hora del día.' },
      { icon: 'delivery', title: 'Carpintería a medida', text: 'Mobiliario fabricado en nuestro taller, milimétrico.' },
    ],
  },
  carpinteria: {
    title: 'Carpintería sobre Diseño', subtitle: 'Mobiliario hecho a medida, pieza por pieza.',
    tag: 'Muebles · Cocinas · Closets', heroImage: 'https://images.unsplash.com/photo-1595526051245-4506e0005bd0?w=1200&q=80',
    description: 'Fabricamos cocinas, closets, barras, gabinetes y elementos arquitectónicos de madera con acabados premium y diseño milimétrico en nuestro taller propio en CDMX.',
    longText: 'Con maquinaria CNC de última generación y mano de obra artesanal especializada, cada pieza que sale de nuestro taller lleva la precisión digital y el alma del trabajo manual. Utilizamos chapas naturales certificadas, herrajes europeos y acabados de laca poliuretano de alta resistencia.',
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    ],
    benefits: [
      { icon: 'focus', title: 'Taller propio', text: 'Control total de fabricación sin intermediarios.' },
      { icon: 'identity', title: 'CNC + artesanía', text: 'Precisión digital combinada con acabado manual.' },
      { icon: 'quality', title: 'Materiales certificados', text: 'Maderas FSC, herrajes Blum, lacas Sherwin-Williams.' },
      { icon: 'delivery', title: 'Garantía extendida', text: '5 años de garantía en estructura y mecanismos.' },
    ],
  },
  produccion: {
    title: 'Producción e Instalación', subtitle: 'Del plano a la realidad, sin excusas.',
    tag: 'Obra · Acabados · Supervisión', heroImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    description: 'Supervisión y ejecución total del proceso constructivo, garantizando acabados de alta costura arquitectónica desde la obra negra hasta la entrega llave en mano.',
    longText: 'Nuestro equipo de producción coordina cada aspecto del proyecto: desde instalaciones eléctricas e hidráulicas hasta la colocación de acabados finales. Un solo equipo responsable de principio a fin elimina las fricciones clásicas entre diseñador y constructor.',
    gallery: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
    ],
    benefits: [
      { icon: 'focus', title: 'Llave en mano', text: 'Un solo punto de contacto para todo el proyecto.' },
      { icon: 'identity', title: 'Supervisión en sitio', text: 'Presencia diaria de nuestro equipo en la obra.' },
      { icon: 'quality', title: 'Control de costos', text: 'Presupuesto cerrado con desglose transparente.' },
      { icon: 'delivery', title: 'Acabados premium', text: 'Cada detalle ejecutado con estándar de alta costura.' },
    ],
  },
};

const renderBenefitIcon = (iconName) => {
  switch (iconName) {
    case 'focus':
      return (
        <svg className="sd-benefit-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" className="anim-draw-on" />
          <circle cx="12" cy="12" r="6" className="anim-draw-on" />
          <circle cx="12" cy="12" r="2" className="anim-draw-on" />
        </svg>
      );
    case 'identity':
      return (
        <svg className="sd-benefit-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" className="anim-draw-on" />
        </svg>
      );
    case 'quality':
      return (
        <svg className="sd-benefit-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 12l10 10 10-10L12 2z" className="anim-draw-on" />
        </svg>
      );
    case 'delivery':
      return (
        <svg className="sd-benefit-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" className="anim-draw-on" />
          <polyline points="12 6 12 12 16 14" className="anim-draw-on" />
        </svg>
      );
    default:
      return <span>◎</span>;
  }
};

export default function ServiceDetailPage() {
  const { id } = useParams();
  const service = allServices[id];

  const [heroRef, heroVis] = useInView({ threshold: 0.1 });
  const [descRef, descVis] = useInView({ threshold: 0.2 });
  const [galRef, galVis] = useInView({ threshold: 0.1 });
  const [benRefs, benVis] = useStaggerInView(4, { staggerDelay: 150 });
  const [ctaRef, ctaVis] = useInView({ threshold: 0.2 });

  if (!service) {
    return (
      <div className="sd-not-found page-enter">
        <div className="container-default" style={{ padding: '200px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: 'var(--colors--theme-black)' }}>Servicio no encontrado</h1>
          <Link to="/servicios" style={{ color: 'var(--colors--theme-orange)', fontWeight: 700, marginTop: 20, display: 'inline-block' }}>← Volver a Servicios</Link>
        </div>
      </div>
    );
  }

  const otherServices = Object.entries(allServices).filter(([key]) => key !== id).slice(0, 3);

  return (
    <div className="service-detail page-enter">

      {/* ═══ SECTION 1: HERO SPLIT ═══ */}
      <section className="sd-hero" ref={heroRef}>
        <div className={`sd-hero-text ${heroVis ? 'in-view' : ''}`}>
          <span className="sd-hero-tag">{service.tag}</span>
          <h1 className="sd-hero-title">{service.title}</h1>
          <p className="sd-hero-subtitle">{service.subtitle}</p>
          <Link to="/contacto" className="sd-hero-cta">
            Cotizar Este Servicio
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </Link>
        </div>
        <div className={`sd-hero-image-col ${heroVis ? 'in-view' : ''}`}>
          <img src={service.heroImage} alt={service.title} className="sd-hero-image" />
        </div>
      </section>

      {/* ═══ SECTION 2: DESCRIPTION ═══ */}
      <section className="sd-description" ref={descRef}>
        <div className="container-default">
          <div className={`sd-desc-grid ${descVis ? 'in-view' : ''}`}>
            <div className="sd-desc-left">
              <span className="section-eyebrow" style={{opacity:1,transform:'none'}}>Detalle del Servicio</span>
              <h2 className="section-heading" style={{opacity:1,transform:'none'}}>
                ¿Qué <em>incluye</em>?
              </h2>
            </div>
            <div className="sd-desc-right">
              <p className="sd-desc-text">{service.description}</p>
              <p className="sd-desc-text">{service.longText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: GALLERY ═══ */}
      <section className="sd-gallery" ref={galRef}>
        <div className="container-default">
          <div className={`sd-gallery-grid ${galVis ? 'in-view' : ''}`}>
            {service.gallery.map((img, i) => (
              <div key={i} className="sd-gallery-item" style={{ transitionDelay: `${i * 0.15}s` }} data-cursor="view">
                <img src={img} alt={`${service.title} ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: BENEFITS ═══ */}
      <section className="sd-benefits">
        <div className="container-default">
          <span className="section-eyebrow anim-fade-up in-view">Beneficios</span>
          <h2 className="section-heading anim-fade-up in-view">¿Por qué elegirnos para <em>{service.title.toLowerCase()}</em>?</h2>
          <div className="sd-benefits-grid">
            {service.benefits.map((b, i) => (
              <div
                key={i}
                ref={el => benRefs.current[i] = el}
                className={`sd-benefit-card ${benVis[i] ? 'in-view' : ''}`}
              >
                <span className="sd-benefit-icon">{renderBenefitIcon(b.icon)}</span>
                <h3 className="sd-benefit-title">{b.title}</h3>
                <p className="sd-benefit-text">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: CTA ═══ */}
      <section className="sd-cta" ref={ctaRef}>
        <div className={`container-default sd-cta-inner ${ctaVis ? 'in-view' : ''}`}>
          <div className="sd-cta-card">
            <h2 className="sd-cta-title">¿Interesado en {service.title.toLowerCase()}?</h2>
            <p className="sd-cta-text">Dejanos tus datos y te contactamos en menos de 24 horas.</p>
            <Link to="/contacto" className="sd-cta-btn">Contactar Ahora</Link>
          </div>

          {/* Other Services */}
          <div className="sd-other-services">
            <h3 className="sd-other-title">Otros Servicios</h3>
            {otherServices.map(([key, s]) => (
              <Link to={`/servicios/${key}`} key={key} className="sd-other-link">
                <span>{s.title}</span>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M7 1L11 5L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
