import { useParams, Link } from 'react-router-dom';
import { useInView, useStaggerInView } from '../hooks/useInView';
import { useState, useRef, useEffect } from 'react';
import './ProjectDetailPage.css';

const projectsDB = {
  basilio: {
    title: 'Basilio Roma', location: 'Roma Norte, CDMX', category: 'Restaurante & Bar', area: '180 m²', duration: '4 meses', year: '2023', services: ['Diseño Comercial', 'Carpintería', 'Producción'],
    heroImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80','https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80','https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Un local estrecho de época porfiriana con escasa luz natural y restricciones estructurales severas que limitaban cualquier intervención agresiva.' },
      { num: '02', title: 'La Solución', text: 'Estructura de carpintería suspendida en nogal americano. Espejos estratégicos que duplican la percepción del espacio y arcos metálicos con iluminación LED integrada.' },
      { num: '03', title: 'El Impacto', text: 'Triplicó su capacidad operativa y se convirtió en referencia de interiorismo comercial en la Colonia Roma. Featured en Architectural Digest México.' },
    ],
    testimonial: { quote: '"Triplicamos nuestros ingresos tras la remodelación. El diseño funciona."', author: 'Carlos Mendoza', role: 'Propietario' },
    related: ['condesa','polanco'],
  },
  condesa: {
    title: 'Casa Condesa', location: 'Condesa, CDMX', category: 'Interiorismo Residencial', area: '220 m²', duration: '6 meses', year: '2023', services: ['Interiorismo Residencial', 'Carpintería'],
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80','https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80','https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Departamento de los años 70 en mal estado con distribución ineficiente y pisos dañados.' },
      { num: '02', title: 'La Solución', text: 'Eliminamos muros divisorios para crear un open concept con revestimientos de roble claro y chimenea de mármol travertine como punto focal.' },
      { num: '03', title: 'El Impacto', text: 'Un hogar de estética minimalista atemporal con ventilación cruzada natural. Valuación incrementada en un 60%.' },
    ],
    testimonial: { quote: '"Superó todas nuestras expectativas. Cada mañana despertamos en un espacio que nos representa."', author: 'Ana y Roberto Vega', role: 'Propietarios' },
    related: ['basilio','santafe'],
  },
  polanco: {
    title: 'Boutique Polanco', location: 'Polanco, CDMX', category: 'Retail de Alta Gama', area: '95 m²', duration: '3 meses', year: '2024', services: ['Diseño Comercial', 'Carpintería'],
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80','https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Crear una experiencia de compra exclusiva en un local con techos bajos y poco frente.' },
      { num: '02', title: 'La Solución', text: 'Terrazo continuo, percheros flotantes de acero cepillado y plafón espejo que duplica la altura visual.' },
      { num: '03', title: 'El Impacto', text: 'Incremento del 40% en ventas en el primer trimestre y reconocimiento en retail design awards.' },
    ],
    testimonial: { quote: '"Las ventas subieron un 40% el primer trimestre. El diseño vende."', author: 'Alejandra Ruiz', role: 'Directora Comercial' },
    related: ['basilio','juarez'],
  },
  santafe: {
    title: 'Loft Santa Fe', location: 'Santa Fe, CDMX', category: 'Penthouse', area: '310 m²', duration: '8 meses', year: '2022', services: ['Interiorismo Residencial', 'Carpintería', 'Producción'],
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80','https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Penthouse con vistas panorámicas que necesitaba integrar el paisaje urbano sin sacrificar privacidad.' },
      { num: '02', title: 'La Solución', text: 'Ventanales de piso a techo con carpintería de roble, cocina isla monolítica y terraza con jardín vertical.' },
      { num: '03', title: 'El Impacto', text: 'Una residencia que difumina los límites entre interior y exterior. Publicada en Elle Decoration MX.' },
    ],
    testimonial: { quote: '"Es exactamente lo que soñamos pero nunca pudimos articular."', author: 'Familia Hernández', role: 'Propietarios' },
    related: ['condesa','coyoacan'],
  },
  juarez: {
    title: 'Café Juárez', location: 'Juárez, CDMX', category: 'Cafetería Specialty', area: '65 m²', duration: '2.5 meses', year: '2024', services: ['Diseño Comercial', 'Carpintería'],
    heroImage: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80','https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Local diminuto que debía funcionar como cafetería, tostador y espacio de degustación simultáneamente.' },
      { num: '02', title: 'La Solución', text: 'Mobiliario multifuncional con barra giratoria, almacenamiento vertical y iluminación cálida zonal.' },
      { num: '03', title: 'El Impacto', text: 'Top 10 cafeterías de specialty en CDMX según TimeOut México. Se viralizó en redes por su diseño.' },
    ],
    testimonial: { quote: '"La gente viene por el café y se queda por el espacio."', author: 'Diego Soto', role: 'Fundador' },
    related: ['basilio','reforma'],
  },
  coyoacan: {
    title: 'Residencia Coyoacán', location: 'Coyoacán, CDMX', category: 'Casa Unifamiliar', area: '280 m²', duration: '7 meses', year: '2023', services: ['Interiorismo Residencial', 'Producción'],
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80','https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Integrar una casa colonial con elementos de diseño contemporáneo respetando la esencia del barrio.' },
      { num: '02', title: 'La Solución', text: 'Intervenciones quirúrgicas de mobiliario moderno sobre la arquitectura original de piedra volcánica.' },
      { num: '03', title: 'El Impacto', text: 'Un diálogo perfecto entre tradición mexicana y minimalismo contemporáneo. Premio al mejor interiorismo CDMX.' },
    ],
    testimonial: { quote: '"Lograron lo imposible: modernizar sin perder la esencia colonial."', author: 'Familia Sánchez', role: 'Propietarios' },
    related: ['condesa','santafe'],
  },
  reforma: {
    title: 'Oficinas Reforma', location: 'Reforma, CDMX', category: 'Oficinas Corporativas', area: '450 m²', duration: '5 meses', year: '2024', services: ['Diseño Comercial', 'Carpintería', 'Producción'],
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80','https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Transformar un piso completo de torre corporativa en un espacio creativo y funcional para 80 personas.' },
      { num: '02', title: 'La Solución', text: 'Open plan con pods acústicos, sala de juntas escultórica, terraza urbana y wellness room.' },
      { num: '03', title: 'El Impacto', text: 'Aumento del 35% en satisfacción de empleados y reducción del 20% en rotación de personal.' },
    ],
    testimonial: { quote: '"Nuestro equipo está más feliz y productivo. La inversión se pagó sola."', author: 'Ricardo Gómez', role: 'CEO' },
    related: ['polanco','basilio'],
  },
  narvarte: {
    title: 'Cocina Narvarte', location: 'Narvarte, CDMX', category: 'Carpintería Residencial', area: '12 m²', duration: '6 semanas', year: '2024', services: ['Carpintería'],
    heroImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80','https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80','https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80'],
    narrative: [
      { num: '01', title: 'El Reto', text: 'Cocina compacta de 12m² que necesitaba almacenamiento máximo sin perder estética ni funcionalidad.' },
      { num: '02', title: 'La Solución', text: 'Gabinetes hasta el techo, isla retráctil con sistema de rieles y organización interna a medida con herrajes Blum.' },
      { num: '03', title: 'El Impacto', text: 'Triplicó el almacenamiento en el mismo espacio con una estética que parece sacada de una revista.' },
    ],
    testimonial: { quote: '"No puedo creer que sea la misma cocina. Es otra casa."', author: 'Mariana Torres', role: 'Propietaria' },
    related: ['condesa','santafe'],
  },
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = projectsDB[id];

  const [heroRef, heroVis] = useInView({ threshold: 0.05 });
  const [specRef, specVis] = useInView({ threshold: 0.1 });
  const [galRef, galVis] = useInView({ threshold: 0.1 });
  const [narRefs, narVis] = useStaggerInView(3, { staggerDelay: 200 });
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

  // Gallery lightbox
  const [lightbox, setLightbox] = useState(null);

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
    { label: 'Año', value: project.year },
  ];

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
          <div className="pdv2-spec pdv2-spec-services" style={{ transitionDelay: '0.4s' }}>
            <span className="pdv2-spec-label">Servicios</span>
            <div className="pdv2-spec-tags">
              {project.services.map((s, i) => (
                <span key={i} className="pdv2-service-tag">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3: GALLERY BENTO ═══ */}
      <section className="pdv2-gallery" ref={galRef}>
        <div className={`pdv2-gallery-bento ${galVis ? 'in-view' : ''}`}>
          {project.gallery.map((img, i) => (
            <div key={i} className={`pdv2-bento-item pdv2-bento-${i}`} style={{ transitionDelay: `${i * 0.12}s` }} onClick={() => setLightbox(i)} data-cursor="Ver">
              <img src={img} alt={`${project.title} ${i + 1}`} />
              <div className="pdv2-bento-overlay">
                <span>+</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="pdv2-lightbox" onClick={() => setLightbox(null)}>
          <button className="pdv2-lb-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={project.gallery[lightbox]} alt="" />
          <div className="pdv2-lb-nav">
            <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox > 0 ? lightbox - 1 : project.gallery.length - 1); }}>←</button>
            <span>{lightbox + 1} / {project.gallery.length}</span>
            <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox < project.gallery.length - 1 ? lightbox + 1 : 0); }}>→</button>
          </div>
        </div>
      )}

      {/* ═══ 4: NARRATIVE ═══ */}
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

      {/* ═══ 5: TESTIMONIAL ═══ */}
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

      {/* ═══ 6: RELATED ═══ */}
      <section className="pdv2-related" ref={relRef}>
        <div className="container-default">
          <h2 className="section-heading anim-fade-up in-view">Más <em>proyectos</em>.</h2>
          <div className={`pdv2-related-grid ${relVis ? 'in-view' : ''}`}>
            {project.related.map((relId) => {
              const rel = projectsDB[relId];
              if (!rel) return null;
              return (
                <Link to={`/proyectos/${relId}`} key={relId} className="pdv2-rel-card">
                  <div className="pdv2-rel-img">
                    <img src={rel.heroImage.replace('w=1400', 'w=700')} alt={rel.title} />
                    <div className="pdv2-rel-overlay">
                      <span className="pdv2-rel-cat">{rel.category}</span>
                      <h3 className="pdv2-rel-title">{rel.title}</h3>
                      <span className="pdv2-rel-loc">{rel.location}</span>
                    </div>
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
