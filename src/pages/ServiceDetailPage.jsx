import { useParams, Link } from 'react-router-dom';
import { useInView, useStaggerInView } from '../hooks/useInView';
import { useEffect, useRef, useState } from 'react';
import { useWixCMSData } from '../hooks/useWixCMS';
import './ServiceDetailPage.css';

const allServices = {
  comercial: {
    title: 'Diseño Comercial', subtitle: 'Espacios que venden, experiencias que conectan.',
    tag: 'Retail · Oficinas · Restaurantes', heroImage: '/diseno_comercial.png',
    description: 'En Studio CAB diseñamos espacios comerciales que trascienden la estética para convertirse en herramientas estratégicas de negocio.',
    longText: 'Nuestro equipo combina arquitectura de interiores, diseño gráfico ambiental y ergonomía comercial para crear entornos que maximizan la experiencia del cliente y, en consecuencia, los ingresos.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80', caption: 'Basilio Roma — Barra principal' },
      { src: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80', caption: 'Café Juárez — Zona de degustación' },
      { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', caption: 'Restaurante Condesa — Salón principal' },
      { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', caption: 'Boutique Polanco — Exhibición' },
    ],
    materials: [
      { name: 'Mármol Travertino', desc: 'Aporta sofisticación e inercia térmica en barras de alto tránsito.', src: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=300&q=80' },
      { name: 'Acero Cepillado', desc: 'Tratado con lacas protectoras para un look industrial e imperecedero.', src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80' },
      { name: 'Vidrio Estriado', desc: 'Filtra la luz natural dividiendo espacios sin bloquear visuales.', src: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=300&q=80' },
    ],
    process: [
      { num: '01', title: 'Diagnóstico', desc: 'Análisis del giro, competencia, flujo de clientes y requerimientos técnicos del espacio.', icon: '⊙' },
      { num: '02', title: 'Concepto Creativo', desc: 'Desarrollo del concepto visual alineado a la identidad de marca y objetivos comerciales.', icon: '◎' },
      { num: '03', title: 'Diseño Ejecutivo', desc: 'Planos constructivos, renders 3D fotorrealistas, paleta de materiales y especificaciones técnicas.', icon: '◈' },
      { num: '04', title: 'Producción', desc: 'Fabricación de mobiliario, coordinación de obra, instalación y entrega llave en mano.', icon: '◇' },
    ],
    stats: [
      { value: '40+', label: 'Proyectos comerciales' },
      { value: '98%', label: 'Clientes satisfechos' },
      { value: '180', label: 'Días promedio' },
    ],
    testimonial: {
      quote: '"Triplicamos nuestros ingresos tras la remodelación. El diseño no solo se ve increíble, funciona."',
      author: 'Carlos Mendoza', role: 'Dueño — Basilio Roma',
    },
    benefits: [
      { icon: '◎', title: 'Diseño centrado en ventas', text: 'Layouts que optimizan recorridos y elevan conversiones.' },
      { icon: '◈', title: 'Identidad de marca espacial', text: 'Tu marca vive en cada pared, mostrador y textura.' },
      { icon: '◇', title: 'Materialidad premium', text: 'Piedra, madera y metal de primer nivel con acabados de lujo.' },
      { icon: '△', title: 'Plazos garantizados', text: 'Entrega en tiempo contractual o ajustamos presupuesto.' },
    ],
  },
  residencial: {
    title: 'Interiorismo Residencial', subtitle: 'Tu hogar, tu identidad personal.',
    tag: 'Casas · Departamentos · Penthouses', heroImage: '/interiorismo_residencial.png',
    description: 'Diseñamos espacios habitacionales sofisticados donde cada rincón refleja la personalidad del habitante.',
    longText: 'Desde departamentos de diseño en la Condesa hasta residencias de lujo en Bosques de las Lomas, cada detalle — desde la veta de la madera hasta la temperatura de la iluminación — está cuidadosamente curado.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', caption: 'Casa Condesa — Sala principal' },
      { src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', caption: 'Loft Santa Fe — Cocina' },
      { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', caption: 'Residencia Coyoacán — Fachada' },
      { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', caption: 'Penthouse Reforma — Terraza' },
    ],
    materials: [
      { name: 'Nogal Americano', desc: 'Madera noble de veta profunda para aportar calidez en salas.', src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80' },
      { name: 'Piedra Volcánica', desc: 'Textura rugosa y oscura para muros de acento que dialogan con el exterior.', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80' },
      { name: 'Latón Cepillado', desc: 'Detalles dorados en luminarias y herrajes para destellos elegantes.', src: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=300&q=80' },
    ],
    process: [
      { num: '01', title: 'Consulta Inicial', desc: 'Entendemos tu estilo de vida, necesidades funcionales y aspiraciones estéticas.', icon: '⊙' },
      { num: '02', title: 'Propuesta Creativa', desc: 'Moodboards, paleta de materiales, renders 3D y presupuesto detallado.', icon: '◎' },
      { num: '03', title: 'Desarrollo Técnico', desc: 'Planos ejecutivos, especificaciones de carpintería e iluminación.', icon: '◈' },
      { num: '04', title: 'Ejecución', desc: 'Supervisión de obra, fabricación e instalación hasta el último detalle.', icon: '◇' },
    ],
    stats: [
      { value: '60+', label: 'Hogares transformados' },
      { value: '100%', label: 'Diseño a medida' },
      { value: '5', label: 'Años de garantía' },
    ],
    testimonial: {
      quote: '"Superó todas nuestras expectativas. Cada mañana despertamos en un espacio que realmente nos representa."',
      author: 'Ana y Roberto Vega', role: 'Clientes — Casa Condesa',
    },
    benefits: [
      { icon: '◎', title: 'Diseño personalizado', text: 'Cada proyecto es único, adaptado a tu estilo de vida.' },
      { icon: '◈', title: 'Materiales nobles', text: 'Mármol, nogal, roble y piedra natural de primera calidad.' },
      { icon: '◇', title: 'Iluminación escénica', text: 'Diseño lumínico integrado para cada ambiente y hora del día.' },
      { icon: '△', title: 'Carpintería a medida', text: 'Mobiliario fabricado en nuestro taller, milimétrico.' },
    ],
  },
  carpinteria: {
    title: 'Carpintería sobre Diseño', subtitle: 'Mobiliario hecho a medida, pieza por pieza.',
    tag: 'Muebles · Cocinas · Closets', heroImage: '/carpinteria_diseno.png',
    description: 'Fabricamos cocinas, closets, barras y elementos arquitectónicos de madera con acabados premium y diseño milimétrico.',
    longText: 'Con maquinaria CNC de última generación y mano de obra artesanal, cada pieza lleva la precisión digital y el alma del trabajo manual.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80', caption: 'Cocina integral — Nogal americano' },
      { src: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80', caption: 'Vestidor — Sistema modular' },
      { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', caption: 'Cocina Narvarte — Gabinetes superiores' },
      { src: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80', caption: 'Estantería industrial — Acero + nogal' },
    ],
    materials: [
      { name: 'Encinos Selectos', desc: 'Maderas duras ideales para cubiertas y puertas macizas de alta resistencia.', src: 'https://images.unsplash.com/photo-1595526051245-4506e0005bd0?w=300&q=80' },
      { name: 'Lacas Poliuretano', desc: 'Capas satinadas impermeables y resistentes al rayado.', src: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&q=80' },
      { name: 'Herrajes Blum', desc: 'Sistemas de cierre suave alemanes ocultos de precisión.', src: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=300&q=80' },
    ],
    process: [
      { num: '01', title: 'Levantamiento', desc: 'Medición milimétrica del espacio con herramientas láser de precisión.', icon: '⊙' },
      { num: '02', title: 'Diseño 3D', desc: 'Modelado paramétrico con selección de materiales, herrajes y acabados.', icon: '◎' },
      { num: '03', title: 'Fabricación', desc: 'Corte CNC, ensamble manual, acabado de laca y control de calidad.', icon: '◈' },
      { num: '04', title: 'Instalación', desc: 'Montaje profesional con ajuste perfecto y limpieza del espacio.', icon: '◇' },
    ],
    stats: [
      { value: '500+', label: 'Piezas fabricadas' },
      { value: 'CNC', label: 'Precisión digital' },
      { value: '5', label: 'Años de garantía' },
    ],
    testimonial: {
      quote: '"La cocina quedó perfecta al milímetro. La calidad es de otro nivel, mejor que cualquier marca importada."',
      author: 'Mariana Torres', role: 'Cliente — Cocina Narvarte',
    },
    benefits: [
      { icon: '◎', title: 'Taller propio', text: 'Control total de fabricación sin intermediarios.' },
      { icon: '◈', title: 'CNC + artesanía', text: 'Precisión digital combinada con acabado manual.' },
      { icon: '◇', title: 'Materiales certificados', text: 'Maderas FSC, herrajes Blum, lacas Sherwin-Williams.' },
      { icon: '△', title: 'Garantía extendida', text: '5 años de garantía en estructura y mecanismos.' },
    ],
  },
  produccion: {
    title: 'Producción e Instalación', subtitle: 'Del plano a la realidad, sin excusas.',
    tag: 'Obra · Acabados · Supervisión', heroImage: '/produccion_instalacion.png',
    description: 'Gestionamos la fabricación, montaje e instalación de cada proyecto en CDMX y área metropolitana con altos estándares de calidad y atención al detalle.',
    longText: 'Nuestro equipo coordina cada aspecto: instalaciones, acabados y entrega llave en mano. Un solo equipo de principio a fin.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', caption: 'Obra en proceso — Estructura' },
      { src: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80', caption: 'Instalación de acabados' },
      { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80', caption: 'Supervisión en sitio' },
      { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', caption: 'Resultado final — Oficinas Reforma' },
    ],
    materials: [
      { name: 'Concreto Texturizado', desc: 'Acabado contemporáneo texturizado a mano con selladores ópticos.', src: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&q=80' },
      { name: 'Acero Estructural', desc: 'Acero al carbón para soportar dobles alturas y volados.', src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80' },
      { name: 'Piedra Caliza', desc: 'Revestimiento térmico ideal para exteriores y fachadas ventiladas.', src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&q=80' },
    ],
    process: [
      { num: '01', title: 'Planeación', desc: 'Cronograma detallado, presupuesto cerrado y plan de contingencias.', icon: '⊙' },
      { num: '02', title: 'Obra Civil', desc: 'Demolición, estructura, instalaciones eléctricas e hidráulicas.', icon: '◎' },
      { num: '03', title: 'Acabados', desc: 'Pisos, muros, plafones, pintura y carpintería fina.', icon: '◈' },
      { num: '04', title: 'Entrega', desc: 'Limpieza profunda, checklist de calidad y entrega llave en mano.', icon: '◇' },
    ],
    stats: [
      { value: '12K', label: 'm² construidos' },
      { value: '0', label: 'Retrasos en 2024' },
      { value: '100%', label: 'Presupuesto respetado' },
    ],
    testimonial: {
      quote: '"Entregaron exactamente en fecha y presupuesto. Su nivel de supervisión es impecable."',
      author: 'Grupo Restaurantero MX', role: 'Cliente corporativo',
    },
    benefits: [
      { icon: '◎', title: 'Llave en mano', text: 'Un solo punto de contacto para todo el proyecto.' },
      { icon: '◈', title: 'Supervisión en sitio', text: 'Presencia diaria de nuestro equipo en la obra.' },
      { icon: '◇', title: 'Control de costos', text: 'Presupuesto cerrado con desglose transparente.' },
      { icon: '△', title: 'Acabados premium', text: 'Cada detalle ejecutado con estándar de alta costura.' },
    ],
  },
};

export default function ServiceDetailPage() {
  const { id } = useParams();
  const service = allServices[id];
  const { subservicios } = useWixCMSData();
  
  const currentSubservices = (subservicios || []).filter(sub => {
    if (sub.servicioMayor === id) return true;
    const cat = sub.categora;
    if (!cat) return false;
    if (id === 'comercial' && cat === 'Diseño Comercial') return true;
    if (id === 'residencial' && cat === 'Interiorismo Residencial') return true;
    if (id === 'produccion' && cat === 'Producción e Instalación') return true;
    if (id === 'carpinteria' && (cat === 'Carpintería y Mobiliario sobre Diseño' || cat === 'Carpintería sobre Diseño')) return true;
    return false;
  });

  const [heroRef, heroVis] = useInView({ threshold: 0.05 });
  const [introRef, introVis] = useInView({ threshold: 0.15 });
  const [subsRef, subsVis] = useInView({ threshold: 0.15 });
  const [materialsRef, materialsVis] = useInView({ threshold: 0.15 });
  const [galRef, galVis] = useInView({ threshold: 0.1 });
  const [procRefs, procVis] = useStaggerInView(4, { staggerDelay: 200 });
  const [testRef, testVis] = useInView({ threshold: 0.2 });
  const [benRefs, benVis] = useStaggerInView(4, { staggerDelay: 120 });
  const [calcRef, calcVis] = useInView({ threshold: 0.15 });
  const [ctaRef, ctaVis] = useInView({ threshold: 0.2 });

  // Parallax on hero
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

  // Active gallery
  const [activeGal, setActiveGal] = useState(0);

  // Materials active state
  const [activeMaterial, setActiveMaterial] = useState(0);

  // Budget Planner State
  const [calcArea, setCalcArea] = useState(60);
  const [calcQuality, setCalcQuality] = useState('premium');

  if (!service) {
    return (
      <div className="page-enter" style={{ padding: '200px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: 'var(--colors--theme-black)' }}>Servicio no encontrado</h1>
        <Link to="/servicios" style={{ color: 'var(--colors--theme-orange)', fontWeight: 700, marginTop: 20, display: 'inline-block' }}>← Volver a Servicios</Link>
      </div>
    );
  }

  const otherServices = Object.entries(allServices).filter(([key]) => key !== id).slice(0, 3);

  // Calculate dynamic budget range
  const calculateBudget = () => {
    let pricePerM2;
    let timeLabel;

    if (id === 'comercial') {
      if (calcQuality === 'standard') { pricePerM2 = 4200; timeLabel = '3 meses'; }
      else if (calcQuality === 'premium') { pricePerM2 = 7500; timeLabel = '5 meses'; }
      else { pricePerM2 = 13000; timeLabel = '8 meses'; }
    } else if (id === 'residencial') {
      if (calcQuality === 'standard') { pricePerM2 = 5500; timeLabel = '4 meses'; }
      else if (calcQuality === 'premium') { pricePerM2 = 9500; timeLabel = '6 meses'; }
      else { pricePerM2 = 16000; timeLabel = '9 meses'; }
    } else if (id === 'carpinteria') {
      if (calcQuality === 'standard') { pricePerM2 = 8500; timeLabel = '6 semanas'; }
      else if (calcQuality === 'premium') { pricePerM2 = 16000; timeLabel = '10 semanas'; }
      else { pricePerM2 = 27000; timeLabel = '16 semanas'; }
    } else { // produccion
      if (calcQuality === 'standard') { pricePerM2 = 3200; timeLabel = '3 meses'; }
      else if (calcQuality === 'premium') { pricePerM2 = 6000; timeLabel = '5 meses'; }
      else { pricePerM2 = 10000; timeLabel = '7 meses'; }
    }

    const minBudget = calcArea * pricePerM2;
    const maxBudget = Math.round(minBudget * 1.25);

    return {
      min: minBudget.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }),
      max: maxBudget.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }),
      time: timeLabel
    };
  };

  const budgetResult = calculateBudget();

  return (
    <div className="service-detail page-enter">

      {/* ═══ 1: IMMERSIVE HERO ═══ */}
      <section className="sdv2-hero" ref={heroRef}>
        <div className="sdv2-hero-media">
          <img ref={heroImgRef} src={service.heroImage} alt={service.title} className="sdv2-hero-img" />
          <div className="sdv2-hero-overlay" />
          <div className="sdv2-hero-grain" />
        </div>
        <div className={`sdv2-hero-content ${heroVis ? 'in-view' : ''}`}>
          <span className="sdv2-hero-tag">{service.tag}</span>
          <h1 className="sdv2-hero-title">
            {service.title.split(' ').map((word, wi, arr) => (
              <span key={wi} className="sdv2-word">
                {word.split('').map((char, ci) => {
                  const idx = arr.slice(0, wi).join(' ').length + (wi > 0 ? 1 : 0) + ci;
                  return (
                    <span key={ci} className="sdv2-letter" style={{ animationDelay: `${0.4 + idx * 0.035}s` }}>
                      {char}
                    </span>
                  );
                })}
                {wi < arr.length - 1 && <span className="sdv2-letter">&nbsp;</span>}
              </span>
            ))}
          </h1>
          <p className="sdv2-hero-sub">{service.subtitle}</p>
          <div className="sdv2-hero-stats">
            {service.stats.map((s, i) => (
              <div key={i} className="sdv2-hero-stat">
                <span className="sdv2-stat-val">{s.value}</span>
                <span className="sdv2-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sdv2-scroll-indicator">
          <span>Scroll</span>
          <div className="sdv2-scroll-line" />
        </div>
      </section>

      {/* ═══ 2: INTRO SPLIT ═══ */}
      <section className="sdv2-intro" ref={introRef}>
        <div className="container-default">
          <div className={`sdv2-intro-grid ${introVis ? 'in-view' : ''}`}>
            <div className="sdv2-intro-left">
              <span className="section-eyebrow" style={{opacity:1,transform:'none'}}>Sobre el servicio</span>
              <h2 className="sdv2-intro-title">{service.description}</h2>
            </div>
            <div className="sdv2-intro-right">
              <p className="sdv2-intro-text">{service.longText}</p>
              <Link to="/contacto" className="sdv2-intro-cta" data-cursor="Cotizar">
                Cotizar Este Servicio
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2.5: SUBSERVICIOS DINÁMICOS (WIX CMS) ═══ */}
      {currentSubservices.length > 0 && (
        <section className="sdv2-subservices" ref={subsRef}>
          <div className="container-default">
            <span className={`section-eyebrow ${subsVis ? 'in-view' : ''}`}>[02.1 // ESPECIALIZACIONES]</span>
            <h2 className={`section-heading ${subsVis ? 'in-view' : ''}`}>Subservicios de <em>{service.title}</em>.</h2>
            
            <div className="sdv2-subs-grid">
              {currentSubservices.map((sub, idx) => {
                const title = sub.title || sub.subservicio || '';
                const description = sub.descripcin || sub.description || '';
                
                const rawSubcat = sub.subcategora || sub.subcategoria || '';
                const cleanSubcat = rawSubcat
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .trim();
                
                const hasBusinessPage = ['gimnasios', 'hoteles', 'oficinas', 'restaurantes'].includes(cleanSubcat);
                
                let waLink = sub.enlaceDeWhatsapp || '';
                if (waLink) {
                  if (waLink.startsWith('https://wa.me/?text=')) {
                    waLink = waLink.replace('https://wa.me/?text=', 'https://wa.me/525512345678?text=');
                  }
                } else {
                  const waMessage = encodeURIComponent(sub.whatsappText || `Hola Studio CAB. Me interesa el subservicio de *${title}*.`);
                  waLink = `https://wa.me/525512345678?text=${waMessage}`;
                }
                
                return (
                  <div key={sub._id || idx} className="sdv2-sub-card">
                    <span className="sdv2-sub-code">[SUB // 0{idx + 1}]</span>
                    <h3 className="sdv2-sub-title">{title}</h3>
                    <p className="sdv2-sub-desc">{description}</p>
                    
                    <div className="sdv2-sub-actions">
                      <Link to={`/subservicios/${sub.slug || ''}`} className="sdv2-sub-link">
                        Saber Más ↗
                      </Link>
                      
                      <a 
                        href={waLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="sdv2-sub-wa-btn"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                          <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.812.48 3.564 1.392 5.124L2 22l5.004-1.308c1.512.828 3.204 1.272 4.992 1.272C17.52 22 22 17.52 22 12.012c0-2.676-1.044-5.184-2.928-7.08C17.184 3.036 14.688 2 12.012 2zm5.724 14.124c-.252.708-1.464 1.296-2.004 1.344-.492.048-.972.24-3.156-.624-2.772-1.104-4.524-3.924-4.656-4.104-.132-.18-1.092-1.452-1.092-2.772 0-1.32.684-1.968.936-2.232.252-.264.672-.384 1.08-.384.144 0 .276.012.396.012.348.012.516.036.744.576.228.552.792 1.932.864 2.076.072.144.12.312.024.504-.096.192-.144.312-.288.48-.144.168-.312.384-.444.516-.144.144-.3.3-.132.588.168.288.756 1.248 1.62 2.016.924.816 1.704 1.068 1.944 1.188.24.12.384.108.528-.06.144-.168.624-.72.792-.96.168-.24.336-.204.564-.12.228.084 1.452.684 1.704.816.252.132.42.192.48.3.06.108.06.624-.192 1.332z" />
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 3: MUESTRARIO DE MATERIALES (NUEVA) ═══ */}
      <section className="sdv2-materials" ref={materialsRef}>
        <div className="container-default">
          <span className={`section-eyebrow ${materialsVis ? 'in-view' : ''}`}>Materiales del Estudio</span>
          <h2 className={`section-heading ${materialsVis ? 'in-view' : ''}`}>Muestrario de <em>texturas sugeridas</em>.</h2>
          
          <div className={`sdv2-materials-grid ${materialsVis ? 'in-view' : ''}`}>
            <div className="sdv2-materials-list">
              {service.materials.map((mat, i) => (
                <button
                  key={i}
                  className={`sdv2-material-item ${activeMaterial === i ? 'active' : ''}`}
                  onClick={() => setActiveMaterial(i)}
                >
                  <span className="sdv2-mat-num">0{i + 1}</span>
                  <span className="sdv2-mat-name">{mat.name}</span>
                </button>
              ))}
            </div>

            <div className="sdv2-materials-preview">
              <div className="sdv2-mat-preview-card">
                <div className="sdv2-mat-image-wrapper">
                  <img src={service.materials[activeMaterial].src} alt={service.materials[activeMaterial].name} />
                </div>
                <div className="sdv2-mat-content">
                  <h3 className="sdv2-mat-title">{service.materials[activeMaterial].name}</h3>
                  <p className="sdv2-mat-desc">{service.materials[activeMaterial].desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4: SHOWCASE GALLERY ═══ */}
      <section className="sdv2-showcase" ref={galRef}>
        <div className={`sdv2-showcase-inner ${galVis ? 'in-view' : ''}`}>
          <div className="sdv2-showcase-main">
            <img src={service.gallery[activeGal].src} alt={service.gallery[activeGal].caption} />
            <div className="sdv2-showcase-caption">
              <span className="sdv2-cap-num">0{activeGal + 1} / 0{service.gallery.length}</span>
              <span className="sdv2-cap-text">{service.gallery[activeGal].caption}</span>
            </div>
          </div>
          <div className="sdv2-showcase-thumbs">
            {service.gallery.map((g, i) => (
              <button key={i} className={`sdv2-thumb ${activeGal === i ? 'active' : ''}`} onClick={() => setActiveGal(i)}>
                <img src={g.src.replace('w=800', 'w=300')} alt={g.caption} />
                <div className="sdv2-thumb-overlay">
                  <span>0{i + 1}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5: PROCESS ═══ */}
      <section className="sdv2-process">
        <div className="container-default">
          <span className="section-eyebrow anim-fade-up in-view">Metodología</span>
          <h2 className="section-heading anim-fade-up in-view">Nuestro <em>proceso</em>.</h2>
          <div className="sdv2-process-grid">
            {service.process.map((step, i) => (
              <div key={i} ref={el => procRefs.current[i] = el} className={`sdv2-process-card ${procVis[i] ? 'in-view' : ''}`}>
                <div className="sdv2-proc-header">
                  <span className="sdv2-proc-icon">{step.icon}</span>
                  <span className="sdv2-proc-num">{step.num}</span>
                </div>
                <h3 className="sdv2-proc-title">{step.title}</h3>
                <p className="sdv2-proc-desc">{step.desc}</p>
                {i < 3 && <div className="sdv2-proc-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6: TESTIMONIAL ═══ */}
      <section className="sdv2-testimonial" ref={testRef}>
        <div className={`container-default sdv2-test-inner ${testVis ? 'in-view' : ''}`}>
          <div className="sdv2-test-quote-mark">"</div>
          <blockquote className="sdv2-test-quote">{service.testimonial.quote}</blockquote>
          <div className="sdv2-test-author">
            <div className="sdv2-test-line" />
            <div>
              <span className="sdv2-test-name">{service.testimonial.author}</span>
              <span className="sdv2-test-role">{service.testimonial.role}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7: BENEFITS ═══ */}
      <section className="sdv2-benefits">
        <div className="container-default">
          <span className="section-eyebrow anim-fade-up in-view">Ventajas</span>
          <h2 className="section-heading anim-fade-up in-view">¿Por qué <em>Studio CAB</em>?</h2>
          <div className="sdv2-benefits-grid">
            {service.benefits.map((b, i) => (
              <div key={i} ref={el => benRefs.current[i] = el} className={`sdv2-benefit ${benVis[i] ? 'in-view' : ''}`}>
                <span className="sdv2-ben-num">0{i + 1}</span>
                <h3 className="sdv2-ben-title">{b.title}</h3>
                <p className="sdv2-ben-text">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8: PLANIFICADOR DE PROYECTO (NUEVA) ═══ */}
      <section className="sdv2-planner" ref={calcRef}>
        <div className="container-default">
          <div className={`sdv2-planner-inner ${calcVis ? 'in-view' : ''}`}>
            <div className="sdv2-planner-info">
              <span className="section-eyebrow">Presupuesto</span>
              <h2 className="sdv2-planner-title">Planificá tu inversión.</h2>
              <p className="sdv2-planner-text">
                Utilizá nuestra calculadora interactiva para estimar de forma preliminar el costo y tiempo de desarrollo basado en los metros cuadrados de tu espacio.
              </p>
              
              <div className="sdv2-calc-inputs">
                <div className="sdv2-calc-range">
                  <div className="sdv2-range-labels">
                    <label>Superficie:</label>
                    <span className="sdv2-range-val">{calcArea} m²</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={calcArea}
                    onChange={(e) => setCalcArea(parseInt(e.target.value))}
                    className="sdv2-range-slider"
                  />
                </div>

                <div className="sdv2-calc-options">
                  <label>Nivel de Acabados:</label>
                  <div className="sdv2-option-pills">
                    {[
                      { id: 'standard', name: 'Estándar' },
                      { id: 'premium', name: 'Premium' },
                      { id: 'coleccion', name: 'Colección CAB' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        className={`sdv2-pill-btn ${calcQuality === opt.id ? 'active' : ''}`}
                        onClick={() => setCalcQuality(opt.id)}
                      >
                        {opt.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="sdv2-planner-result">
              <div className="sdv2-result-card">
                <span className="sdv2-result-label">[INVERSIÓN ESTIMADA]</span>
                <span className="sdv2-result-price">{budgetResult.min} – {budgetResult.max}</span>
                <span className="sdv2-result-currency">Pesos Mexicanos (MXN)</span>
                
                <div className="sdv2-result-divider" />
                
                <div className="sdv2-result-time">
                  <span className="sdv2-time-label">Plazo de entrega estimado:</span>
                  <span className="sdv2-time-value">{budgetResult.time}</span>
                </div>

                <p className="sdv2-result-disclaimer">
                  *Esta es una estimación conceptual sujeta a levantamiento físico y plano ejecutivo.
                </p>
                <Link to="/contacto" className="sdv2-result-btn">Iniciar Proyecto</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 9: CTA + OTHER SERVICES ═══ */}
      <section className="sdv2-cta" ref={ctaRef}>
        <div className={`container-default sdv2-cta-inner ${ctaVis ? 'in-view' : ''}`}>
          <div className="sdv2-cta-card">
            <h2 className="sdv2-cta-title">¿Listo para transformar tu espacio?</h2>
            <p className="sdv2-cta-text">Agendá una consulta gratuita y recibí tu propuesta en menos de 7 días.</p>
            <Link to="/contacto" className="sdv2-cta-btn">
              Agendar Consulta
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </Link>
          </div>
          <div className="sdv2-other">
            <h3 className="sdv2-other-title">También ofrecemos</h3>
            {otherServices.map(([key, s]) => (
              <Link to={`/servicios/${key}`} key={key} className="sdv2-other-link">
                <span>{s.title}</span>
                <svg width="16" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
