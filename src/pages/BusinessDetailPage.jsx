import { useParams, Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import './BusinessDetailPage.css';

const INDUSTRIES_DATA = {
  gimnasios: {
    plannerType: 'hotelero',
    title: 'Gimnasios y Centros Wellness',
    niche: 'Carpintería para Gimnasios',
    subtitle: 'Mobiliario de alto tráfico y ebanistería premium para clubes deportivos y centros de salud.',
    heroImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80',
    intro: 'Diseñamos y fabricamos mobiliario personalizado que resiste el uso continuo y las condiciones de humedad, sin perder la sofisticación que exige tu marca. Desde áreas de recepción de mármol y madera hasta lockers inteligentes integrados.',
    benefits: [
      { title: 'Lockers de Alto Tráfico', desc: 'Fabricados en MDF hidrófugo y chapas naturales tratadas contra humedad, equipados con cerraduras electrónicas integradas.' },
      { title: 'Barras de Recepción e Hitos', desc: 'Diseños escultóricos monolíticos combinando maderas macizas, piedras sinterizadas y sistemas de iluminación LED.' },
      { title: 'Zonas Funcionales y Racks', desc: 'Estructuras modulares a medida para equipamiento, paneles acústicos de roble y detalles ergonómicos para usuarios.' }
    ],
    ctaText: 'Solicitar propuesta para Gimnasio'
  },
  hoteles: {
    plannerType: 'hotelero',
    title: 'Hoteles y Hospitalidad',
    niche: 'Mobiliario para Hoteles',
    subtitle: 'Soluciones de carpintería y acabados de lujo para habitaciones, lobbys y áreas comunes.',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80',
    intro: 'Producción a escala hotelera manteniendo rigurosos estándares de calidad artesanal. Nos especializamos en equipamiento de habitaciones (cabeceros, clósets, escritorios) y mobiliario monumental para lobbys.',
    benefits: [
      { title: 'Equipamiento de Habitaciones (FF&E)', desc: 'Producción masiva homologada de mobiliario fijo y móvil con acabados retardantes al fuego y de alta durabilidad.' },
      { title: 'Lobbys y Áreas Comunes', desc: 'Revestimientos monumentales de madera en muros y plafones, barras de bar y áreas de check-in de diseño exclusivo.' },
      { title: 'Estandarización y Garantía', desc: 'Procesos de control de calidad CNC para asegurar que cada habitación mantenga la misma precisión milimétrica.' }
    ],
    ctaText: 'Solicitar propuesta para Hotel'
  },
  oficinas: {
    plannerType: 'oficina',
    title: 'Oficinas Corporativas y Coworkings',
    niche: 'Mobiliario para Oficinas',
    subtitle: 'Espacios de trabajo ergonómicos que fomentan la colaboración, la concentración y proyectan la identidad corporativa.',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
    intro: 'Creamos entornos de oficina contemporáneos optimizando la acústica, la ergonomía y la conectividad. Fabricamos mesas de junta monumentales, cabinas de privacidad acústicas y recepciones corporativas.',
    benefits: [
      { title: 'Mesas de Junta y Conectividad', desc: 'Diseños de gran formato en maderas seleccionadas con sistemas integrados de gestión de cableado y conectividad oculta.' },
      { title: 'Panelería Acústica y Lambrín', desc: 'Sistemas de revestimiento ranurado de roble o nogal con aislamiento acústico posterior para salas de reuniones y zonas privadas.' },
      { title: 'Estaciones de Trabajo y Almacenaje', desc: 'Soluciones modulares ergonómicas para personal operativo y ejecutivos, optimizando la distribución del espacio.' }
    ],
    ctaText: 'Solicitar propuesta para Oficinas'
  },
  restaurantes: {
    plannerType: 'restaurante',
    title: 'Restaurantes, Cafeterías y Bares',
    niche: 'Mobiliario para Restaurantes',
    subtitle: 'Interiorismo comercial y mobiliario sobre diseño que define la experiencia gastronómica y maximiza la rotación.',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=80',
    intro: 'Entendemos que el mobiliario en alimentos y bebidas es una pieza clave de la operación. Diseñamos barras monumentales que resisten el derrame de líquidos y booths ergonómicos que invitan a la permanencia.',
    benefits: [
      { title: 'Barras de Bar de Alto Impacto', desc: 'Cubiertas de madera tratada o piedra sinterizada, con subestructuras metálicas preparadas para instalaciones de baristas.' },
      { title: 'Booths y Banquetas a Medida', desc: 'Sistemas de asientos fijos tapizados en pieles sintéticas de grado comercial y estructuras internas reforzadas.' },
      { title: 'Mesas y Sillas de Autor', desc: 'Fabricación propia de mobiliario de comedor coordinado con el concepto estético y la paleta de materiales del lugar.' }
    ],
    ctaText: 'Solicitar propuesta para Restaurante'
  },
  retail: {
    plannerType: 'retail',
    title: 'Retail, Tiendas y Boutiques',
    niche: 'Mobiliario para Retail',
    subtitle: 'Sistemas de exhibición de lujo que destacan la mercancía y elevan el valor percibido de la marca.',
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80',
    intro: 'Diseñamos vitrinas, percheros flotantes y mesas de exhibición donde la iluminación integrada y la materialidad sofisticada atraen la atención del cliente hacia el producto.',
    benefits: [
      { title: 'Vitrinas e Iluminación Focalizada', desc: 'Estructuras de herrería fina y vidrio templado con iluminación LED integrada de alto índice de reproducción cromática (CRI).' },
      { title: 'Percheros y Displays Flotantes', desc: 'Sistemas modulares ajustables en acero inoxidable cepillado, latón o acabados en pintura electrostática mate.' },
      { title: 'Puntos de Venta y Cashwraps', desc: 'Muebles de caja con diseño premium y áreas funcionales ocultas para empaque, cableado y sistemas de cobro.' }
    ],
    ctaText: 'Solicitar propuesta para Boutique'
  }
};

export default function BusinessDetailPage() {
  const { id } = useParams();
  const industry = INDUSTRIES_DATA[id];

  const [heroRef, heroVis] = useInView({ threshold: 0.1 });
  const [contentRef, contentVis] = useInView({ threshold: 0.15 });

  if (!industry) {
    return (
      <div className="industry-not-found container-default page-enter">
        <h1 className="not-found-title">Industria no encontrada</h1>
        <p className="not-found-desc">El segmento de negocio solicitado no está registrado.</p>
        <Link to="/" className="not-found-link">← Volver al Inicio</Link>
      </div>
    );
  }

  return (
    <div className="business-detail-page page-enter">
      {/* ═══ 1: HERO SECTION ═══ */}
      <section className="ind-hero-section" ref={heroRef}>
        <div className="ind-hero-bg">
          <img src={industry.heroImage} alt={industry.title} className="ind-hero-img" />
          <div className="ind-hero-overlay" />
          <div className="ind-hero-grid" />
        </div>
        
        <div className="ind-hero-container container-default">
          <div className={`ind-hero-content ${heroVis ? 'in-view' : ''}`}>
            <span className="ind-hero-eyebrow">[SOLUCIÓN PARA NEGOCIOS]</span>
            <h1 className="ind-hero-title">
              {industry.title}
            </h1>
            <p className="ind-hero-desc">
              {industry.subtitle}
            </p>
            <div className="ind-tech-frame">
              <span className="ind-cross top-left">+</span>
              <span className="ind-cross top-right">+</span>
              <span className="ind-cross bottom-left">+</span>
              <span className="ind-cross bottom-right">+</span>
              <span className="ind-code">CAB-SPEC-2026 // SEO_PROD</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2: CONTENT SECTION ═══ */}
      <section className="ind-content-section" ref={contentRef}>
        <div className="container-default">
          <div className={`ind-content-grid ${contentVis ? 'in-view' : ''}`}>
            
            {/* Left Block: Intro text & capacity */}
            <div className="ind-content-left">
              <span className="ind-section-tag">[CAPACIDAD INDUSTRIAL]</span>
              <h2 className="ind-section-title">Ingeniería y Manufactura Directa</h2>
              <p className="ind-section-text">
                {industry.intro}
              </p>
              <p className="ind-section-subtext">
                En Studio CAB controlamos el 100% de la cadena de suministro y producción. Contamos con maquinaria CNC, personal de ebanistería calificado e instaladores propios en CDMX para evitar cualquier retraso o fricción con subcontratistas.
              </p>
            </div>

            {/* Right Block: Niche specifics list */}
            <div className="ind-content-right">
              <h3 className="ind-list-title">Soluciones Específicas para {industry.title}</h3>
              <div className="ind-benefits-list">
                {industry.benefits.map((benefit, i) => (
                  <div key={i} className="ind-benefit-card">
                    <span className="ind-benefit-num">0{i+1} //</span>
                    <div className="ind-benefit-info">
                      <h4>{benefit.title}</h4>
                      <p>{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Unified Niche CTA */}
          <div className="ind-cta-box">
            <Link 
              to="/contacto" 
              state={{ selectedType: industry.plannerType }}
              className="ind-cta-btn"
            >
              {industry.ctaText}
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 1L13.5 6L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 6H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
