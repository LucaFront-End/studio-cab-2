import { useParams, Link } from 'react-router-dom';
import { useInView, useStaggerInView } from '../hooks/useInView';
import { useState, useRef, useEffect } from 'react';
import './ProjectDetailPage.css';

const projectsDB = {
  basilio: {
    title: 'Basilio Roma', location: 'Roma Norte, CDMX', category: 'Restaurante & Bar', area: '180 m²', duration: '4 meses', services: ['Diseño Comercial', 'Carpintería', 'Producción'],
    heroImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80','https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Un local estrecho de época porfiriana con escasa luz natural y restricciones estructurales severas.' },
      { num: '02', title: 'La Solución', text: 'Estructura de carpintería suspendida en nogal. Espejos estratégicos y arcos metálicos con iluminación LED.' },
      { num: '03', title: 'El Impacto', text: 'Triplicó su capacidad operativa y se convirtió en referencia de interiorismo comercial en la zona.' },
    ],
    related: ['condesa','polanco'],
  },
  condesa: {
    title: 'Casa Condesa', location: 'Condesa, CDMX', category: 'Interiorismo Residencial', area: '220 m²', duration: '6 meses', services: ['Interiorismo Residencial', 'Carpintería'],
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80','https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Departamento de los años 70 en mal estado con distribución ineficiente.' },
      { num: '02', title: 'La Solución', text: 'Eliminamos muros divisorios, revestimientos de roble claro y chimenea de mármol.' },
      { num: '03', title: 'El Impacto', text: 'Un hogar de estética minimalista atemporal con ventilación cruzada natural.' },
    ],
    related: ['basilio','santafe'],
  },
  polanco: {
    title: 'Boutique Polanco', location: 'Polanco, CDMX', category: 'Retail de Alta Gama', area: '95 m²', duration: '3 meses', services: ['Diseño Comercial', 'Carpintería'],
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Crear una experiencia de compra exclusiva en un local con techos bajos.' },
      { num: '02', title: 'La Solución', text: 'Terrazo continuo, percheros flotantes de acero y plafón espejo.' },
      { num: '03', title: 'El Impacto', text: 'Incremento del 40% en ventas en el primer trimestre.' },
    ],
    related: ['basilio','juarez'],
  },
  santafe: {
    title: 'Loft Santa Fe', location: 'Santa Fe, CDMX', category: 'Penthouse', area: '310 m²', duration: '8 meses', services: ['Interiorismo Residencial', 'Carpintería', 'Producción'],
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80','https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Penthouse con vistas panorámicas que necesitaba integrar el paisaje urbano.' },
      { num: '02', title: 'La Solución', text: 'Ventanales de piso a techo con carpintería de roble y cocina isla monolítica.' },
      { num: '03', title: 'El Impacto', text: 'Una residencia que difumina los límites entre interior y exterior.' },
    ],
    related: ['condesa','coyoacan'],
  },
  juarez: {
    title: 'Café Juárez', location: 'Juárez, CDMX', category: 'Cafetería Specialty', area: '65 m²', duration: '2.5 meses', services: ['Diseño Comercial', 'Carpintería'],
    heroImage: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80','https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Local diminuto que debía funcionar como cafetería, tostador y espacio de degustación.' },
      { num: '02', title: 'La Solución', text: 'Mobiliario multifuncional con barra giratoria y almacenamiento vertical.' },
      { num: '03', title: 'El Impacto', text: 'Top 10 cafeterías de specialty en CDMX según TimeOut México.' },
    ],
    related: ['basilio','reforma'],
  },
  coyoacan: {
    title: 'Residencia Coyoacán', location: 'Coyoacán, CDMX', category: 'Casa Unifamiliar', area: '280 m²', duration: '7 meses', services: ['Interiorismo Residencial', 'Producción'],
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Integrar una casa colonial con elementos de diseño contemporáneo.' },
      { num: '02', title: 'La Solución', text: 'Respeto por la arquitectura original con intervenciones quirúrgicas de mobiliario moderno.' },
      { num: '03', title: 'El Impacto', text: 'Un diálogo perfecto entre tradición mexicana y minimalismo contemporáneo.' },
    ],
    related: ['condesa','santafe'],
  },
  reforma: {
    title: 'Oficinas Reforma', location: 'Reforma, CDMX', category: 'Oficinas Corporativas', area: '450 m²', duration: '5 meses', services: ['Diseño Comercial', 'Carpintería', 'Producción'],
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80','https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Transformar un piso completo de torre corporativa en un espacio creativo y funcional.' },
      { num: '02', title: 'La Solución', text: 'Open plan con pods acústicos, sala de juntas escultórica y terraza urbana.' },
      { num: '03', title: 'El Impacto', text: 'Aumento del 35% en satisfacción de empleados y reducción de rotación.' },
    ],
    related: ['polanco','basilio'],
  },
  narvarte: {
    title: 'Cocina Narvarte', location: 'Narvarte, CDMX', category: 'Carpintería Residencial', area: '12 m²', duration: '6 semanas', services: ['Carpintería'],
    heroImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80','https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Cocina compacta que necesitaba almacenamiento máximo sin perder estética.' },
      { num: '02', title: 'La Solución', text: 'Gabinetes hasta el techo, isla retráctil y sistema de organización interno a medida.' },
      { num: '03', title: 'El Impacto', text: 'Triplicó el almacenamiento en el mismo espacio con una estética impecable.' },
    ],
    related: ['condesa','santafe'],
  },
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = projectsDB[id];

  const [heroRef, heroVis] = useInView({ threshold: 0.1 });
  const [specRefs, specVis] = useStaggerInView(5, { staggerDelay: 100 });
  const [galRef, galVis] = useInView({ threshold: 0.1 });
  const [narRefs, narVis] = useStaggerInView(3, { staggerDelay: 200 });
  const [relRef, relVis] = useInView({ threshold: 0.1 });

  // Parallax hero
  const heroImgRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (heroImgRef.current && window.scrollY < 1000) {
        heroImgRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.25}px, 0) scale(1.1)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Slider state
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);
  const dragging = useRef(false);

  const handleSliderMove = (e) => {
    if (!dragging.current || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, x)));
  };

  if (!project) {
    return (
      <div className="page-enter" style={{ padding: '200px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: 'var(--colors--theme-black)' }}>Proyecto no encontrado</h1>
        <Link to="/proyectos" style={{ color: 'var(--colors--theme-orange)', fontWeight: 700, marginTop: 20, display: 'inline-block' }}>← Volver a Proyectos</Link>
      </div>
    );
  }

  const specs = [
    { label: 'Cliente', value: project.title },
    { label: 'Ubicación', value: project.location },
    { label: 'Superficie', value: project.area },
    { label: 'Duración', value: project.duration },
    { label: 'Servicios', value: project.services.join(', ') },
  ];

  return (
    <div className="project-detail page-enter">

      {/* ═══ 1: HERO FULLSCREEN ═══ */}
      <section className="pd-hero" ref={heroRef}>
        <div className="pd-hero-image-wrapper">
          <img ref={heroImgRef} src={project.heroImage} alt={project.title} className="pd-hero-image" />
          <div className="pd-hero-overlay" />
        </div>
        <div className={`pd-hero-content ${heroVis ? 'in-view' : ''}`}>
          <span className="pd-hero-category">{project.category}</span>
          <h1 className="pd-hero-title">{project.title}</h1>
          <p className="pd-hero-location">{project.location}</p>
        </div>
      </section>

      {/* ═══ 2: SPEC SHEET ═══ */}
      <section className="pd-specs">
        <div className="container-default">
          <div className="pd-specs-grid">
            {specs.map((spec, i) => (
              <div key={i} ref={el => specRefs.current[i] = el} className={`pd-spec-item ${specVis[i] ? 'in-view' : ''}`}>
                <span className="pd-spec-label">{spec.label}</span>
                <span className="pd-spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3: GALLERY ═══ */}
      <section className="pd-gallery" ref={galRef}>
        <div className="container-default">
          <div className={`pd-gallery-grid ${galVis ? 'in-view' : ''}`}>
            {project.gallery.map((img, i) => (
              <div key={i} className="pd-gallery-item" style={{ transitionDelay: `${i * 0.15}s` }}>
                <img src={img} alt={`${project.title} ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4: NARRATIVE ═══ */}
      <section className="pd-narrative">
        <div className="container-default">
          <span className="section-eyebrow anim-fade-up in-view">Historia del Proyecto</span>
          <h2 className="section-heading anim-fade-up in-view">Tres etapas, un <em>resultado</em>.</h2>
          <div className="pd-narrative-cards">
            {project.narrative.map((item, i) => (
              <div key={i} ref={el => narRefs.current[i] = el} className={`pd-nar-card ${narVis[i] ? 'in-view' : ''}`}>
                <span className="pd-nar-num">{item.num}</span>
                <h3 className="pd-nar-title">{item.title}</h3>
                <p className="pd-nar-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5: RELATED PROJECTS ═══ */}
      <section className="pd-related" ref={relRef}>
        <div className="container-default">
          <h2 className="section-heading anim-fade-up in-view">Proyectos <em>relacionados</em>.</h2>
          <div className={`pd-related-grid ${relVis ? 'in-view' : ''}`}>
            {project.related.map((relId) => {
              const rel = projectsDB[relId];
              if (!rel) return null;
              return (
                <Link to={`/proyectos/${relId}`} key={relId} className="pd-related-card">
                  <div className="pd-related-img-wrapper">
                    <img src={rel.heroImage.replace('w=1400', 'w=600')} alt={rel.title} />
                  </div>
                  <div className="pd-related-info">
                    <span className="pd-related-cat">{rel.category}</span>
                    <h3>{rel.title}</h3>
                    <span className="pd-related-loc">{rel.location}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
