import { useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWixCMSData } from '../hooks/useWixCMS';
import { useDocumentSEO } from '../hooks/useDocumentSEO';
import { useInView, useStaggerInView } from '../hooks/useInView';
import CTAConfigurator from '../components/CTAConfigurator';
import ProcessSplit from '../components/ProcessSplit';
import './ServiceDetailPage.css';

const defaultStats = [
  { value: '350+', label: 'Piezas restauradas' },
  { value: '100%', label: 'Materiales probados' },
  { value: '3', label: 'Años de garantía' }
];

const tapTypes = [
  {
    icon: '◎',
    title: 'Tapicería de Salas a Domicilio',
    desc: 'Retapizado integral de salas modulares, sillones seccionales y sofás de lujo en tu espacio con recolección y entrega.',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80'
  },
  {
    icon: '◈',
    title: 'Restauración de Sillones de Autor',
    desc: 'Cuidado minucioso de piezas vintage, sillones Eames, Chesterfield y piezas de diseño con telas importadas.',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'
  },
  {
    icon: '⟡',
    title: 'Tapicería de Sillones para Cafetería',
    desc: 'Butacas compactas, sillones lounge y bancos tapizados que optimizan la rotación y brindan máximo confort.',
    img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80'
  },
  {
    icon: '◇',
    title: 'Tapicería de Cabeceras para Hoteles',
    desc: 'Cabeceros monumentales capitoné o lisos con anclaje a muro, telas ignífugas y espuma acústica integrada.',
    img: '/cabeceras_hoteles.webp'
  }
];

const gallery = [
  { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', caption: 'Sillón de autor — Tapicería textil bouclé' },
  { src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', caption: 'Restauración de banqueta — Piel de alta densidad' },
  { src: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80', caption: 'Booths gastronómicos — Tapicería náutica de alto tráfico' },
  { src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', caption: 'Silla ejecutiva — Capitoné artesanal y costuras' }
];

const benefits = [
  { 
    icon: '🛡️', 
    title: 'Garantía Total de Satisfacción', 
    text: 'Garantizamos cada pieza con respaldo absoluto. Si algún ensamble, acabado o textura no supera tus expectativas, lo ajustamos de inmediato sin costo.' 
  },
  { 
    icon: '🧵', 
    title: 'Textiles & Pieles Selección', 
    text: 'Catálogo exclusivo con más de 200 opciones importadas: lino natural, terciopelo antimanchas, piel náutica y tejidos de autor para cada espacio.' 
  },
  { 
    icon: '📐', 
    title: 'Maestría Artesanal & Precisión', 
    text: 'Más de 15 años de trayectoria. Nuestros maestros unifican técnicas tradicionales de capitoné y costuras de alta costura con precisión digital.' 
  },
  { 
    icon: '🚚', 
    title: 'Logística Integral Gratuita', 
    text: 'Nos encargamos del retiro, embalaje especializado y entrega final de tus piezas sin cargo adicional en toda la CDMX y área metropolitana.' 
  },
  { 
    icon: '⚡', 
    title: 'Valoración Express WhatsApp', 
    text: 'Envía imágenes o medidas por WhatsApp y nuestro departamento técnico te enviará un presupuesto detallado en cuestión de minutos.' 
  },
  { 
    icon: '✨', 
    title: 'Transformaciones Reales', 
    text: 'Explora nuestros proyectos concluidos y comprueba la exactitud de acabados, volumen y firmeza antes de iniciar tu propuesta.' 
  }
];

export default function TapiceriaLandingPage() {
  const { slug } = useParams();
  const { landingTapicerias, loading } = useWixCMSData();

  const landing = (landingTapicerias || []).find(l => {
    const data = l.data || l;
    return data.slug === slug || l._id === slug;
  });

  const data = landing ? (landing.data || landing) : null;

  const pageTitle = data?.title || data?.tituloPgina || data?.tituloSeo || 'Tapicería de Muebles en CDMX';
  const pageExcerpt = data?.excerptPgina || data?.subtitle || 'Restauración, acojinado y confección textil de alta gama.';
  const seoTitle = data?.tituloSeo || (data?.title ? `${data.title} | Studio CAB` : 'Tapicería de Muebles en CDMX | Studio CAB');
  const seoDesc = data?.metadescripcinSeo || pageExcerpt;
  const whatsappUrl = data?.whatsapp || `https://wa.me/525516406963?text=${encodeURIComponent(`SW- Hola Studio CAB. Me interesa agendar una consulta para *${pageTitle}*.`)}`;

  useDocumentSEO(seoTitle, seoDesc);

  const [heroRef, heroVis] = useInView({ threshold: 0.05 });
  const [introRef, introVis] = useInView({ threshold: 0.15 });
  const [subsRef, subsVis] = useInView({ threshold: 0.15 });
  const [testRef, testVis] = useInView({ threshold: 0.2 });
  const [benRefs, benVis] = useStaggerInView(benefits.length, { staggerDelay: 120 });
  const [ctaRef, ctaVis] = useInView({ threshold: 0.2 });

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

  if (loading) {
    return (
      <div style={{ padding: '200px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--colors--theme-orange)', borderRadius: '50%', animation: 'cz-spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <p style={{ fontWeight: 600, color: 'var(--colors--theme-black)' }}>Cargando información de tapicería desde Wix CMS...</p>
      </div>
    );
  }

  if (!landing) {
    return (
      <div className="page-enter" style={{ padding: '200px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: 'var(--colors--theme-black)' }}>Página de Tapicería no encontrada</h1>
        <p style={{ marginTop: 12, color: 'var(--colors--theme-gray)' }}>No se localizó la landing especificada en el CMS de LandingTapicerias.</p>
        <Link to="/servicios/tapiceria" style={{ color: 'var(--colors--theme-orange)', fontWeight: 700, marginTop: 24, display: 'inline-block' }}>
          ← Volver a Tapicería de Muebles
        </Link>
      </div>
    );
  }

  return (
    <div className="service-detail page-enter">

      {/* ═══ 1: IMMERSIVE HERO ═══ */}
      <section className="sdv2-hero" ref={heroRef}>
        <div className="sdv2-hero-media">
          <img ref={heroImgRef} src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=80" alt={pageTitle} className="sdv2-hero-img" />
          <div className="sdv2-hero-overlay" />
          <div className="sdv2-hero-grain" />
        </div>
        <div className={`sdv2-hero-content ${heroVis ? 'in-view' : ''}`}>
          <span className="sdv2-hero-tag">TAPICERÍA · RELLENOS · ESTRUCTURA · COSTURAS</span>
          <h1 className="sdv2-hero-title">
            {pageTitle.split(' ').map((word, wi, arr) => (
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
          <p className="sdv2-hero-sub">{pageExcerpt}</p>
          <div className="sdv2-hero-stats">
            {defaultStats.map((s, i) => (
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
              <h2 className="sdv2-intro-title">{pageTitle}</h2>
            </div>
            <div className="sdv2-intro-right">
              <p className="sdv2-intro-text">{seoDesc}</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="sdv2-intro-cta" data-cursor="Cotizar">
                Cotizar por WhatsApp
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3: ESPECIALIDADES DE TAPICERÍA ═══ */}
      <section className="sdv2-subservices" ref={subsRef}>
        <div className="container-default">
          <span className={`section-eyebrow ${subsVis ? 'in-view' : ''}`}>[02.1 // ESPECIALIZACIONES]</span>
          <h2 className={`section-heading ${subsVis ? 'in-view' : ''}`}>
            Especialidades de <em>Tapicería</em>.
          </h2>
          
          <div className={`sdv2-tap-grid ${subsVis ? 'in-view' : ''}`}>
            {tapTypes.map((type, i) => {
              const itemWaMessage = encodeURIComponent(`SW- Hola Studio CAB, me interesa cotizar el servicio de *${type.title}* en ${pageTitle}.`);
              const itemWaLink = `https://wa.me/525516406963?text=${itemWaMessage}`;
              return (
                <div key={i} className="sdv2-tap-card" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="sdv2-tap-card-img-wrapper">
                    <img src={type.img} alt={type.title} className="sdv2-tap-card-img" />
                    <div className="sdv2-tap-card-overlay" />
                  </div>
                  <div className="sdv2-tap-card-content">
                    <span className="sdv2-tap-card-code">[ESP // 0{i + 1}]</span>
                    <h3 className="sdv2-tap-card-title">{type.title}</h3>
                    <p className="sdv2-tap-card-desc">{type.desc}</p>
                    <div className="sdv2-tap-card-actions">
                      <a href={itemWaLink} target="_blank" rel="noopener noreferrer" className="sdv2-tap-wa-btn">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: '6px' }}>
                          <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.812.48 3.564 1.392 5.124L2 22l5.004-1.308c1.512.828 3.204 1.272 4.992 1.272C17.52 22 22 17.52 22 12.012c0-2.676-1.044-5.184-2.928-7.08C17.184 3.036 14.688 2 12.012 2zm5.724 14.124c-.252.708-1.464 1.296-2.004 1.344-.492.048-.972.24-3.156-.624-2.772-1.104-4.524-3.924-4.656-4.104-.132-.18-1.092-1.452-1.092-2.772 0-1.32.684-1.968.936-2.232.252-.264.672-.384 1.08-.384.144 0 .276.012.396.012.348.012.516.036.744.576.228.552.792 1.932.864 2.076.072.144.12.312.024.504-.096.192-.144.312-.288.48-.144.168-.312.384-.444.516-.144.144-.3.3-.132.588.168.288.756 1.248 1.62 2.016.924.816 1.704 1.068 1.944 1.188.24.12.384.108.528-.06.144-.168.624-.72.792-.96.168-.24.336-.204.564-.12.228.084 1.452.684 1.704.816.252.132.42.192.48.3.06.108.06.624-.192 1.332z" />
                        </svg>
                        Cotizar por WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 4: GALLERY ═══ */}
      <section className="sdv2-gallery">
        <div className="container-default">
          <div className="sdv2-gallery-header">
            <span className="section-eyebrow">Galería de proyectos</span>
            <h2 className="section-heading">Resultados en <em>Tapicería</em>.</h2>
          </div>
          <div className="sdv2-gallery-grid">
            {gallery.map((g, i) => (
              <div key={i} className="sdv2-gal-item">
                <img src={g.src} alt={g.caption} className="sdv2-gal-img" />
                <div className="sdv2-gal-overlay">
                  <span className="sdv2-gal-caption">{g.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5: TESTIMONIAL ═══ */}
      <section className="sdv2-testimonial" ref={testRef}>
        <div className={`container-default sdv2-test-inner ${testVis ? 'in-view' : ''}`}>
          <div className="sdv2-test-quote-mark">"</div>
          <blockquote className="sdv2-test-quote">
            "Restauraron nuestras banquetas y sillerías comerciales dejándolas mejores que nuevas. La atención en el armado estructural y las costuras es fantástica."
          </blockquote>
          <div className="sdv2-test-author">
            <div className="sdv2-test-line" />
            <div>
              <span className="sdv2-test-name">Rodrigo Alarcón</span>
              <span className="sdv2-test-role">Director Operativo — Grupo Gastronómico MX</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6: BENEFITS / POR QUÉ ELEGIRNOS ═══ */}
      <section className="sdv2-benefits">
        <div className="container-default">
          <div className="sdv2-benefits-header">
            <span className="sdv2-benefits-eyebrow">DIFERENCIALES // STUDIO CAB</span>
            <h2 className="sdv2-benefits-heading">Compromiso con la <em>excelencia</em>.</h2>
            <p className="sdv2-benefits-subheading">
              Garantizamos precisión técnica, materiales certificados y atención directa sin intermediarios.
            </p>
          </div>
          <div className="sdv2-benefits-grid">
            {benefits.map((b, i) => (
              <div key={i} ref={el => benRefs.current[i] = el} className={`sdv2-benefit ${benVis[i] ? 'in-view' : ''}`}>
                <div className="sdv2-ben-corner top-left">+</div>
                <div className="sdv2-ben-corner top-right">+</div>
                <div className="sdv2-ben-corner bottom-left">+</div>
                <div className="sdv2-ben-corner bottom-right">+</div>

                <div className="sdv2-ben-header">
                  <div className="sdv2-ben-icon-box">{b.icon}</div>
                  <span className="sdv2-ben-badge">[CAB-VAL // 0{i + 1}]</span>
                </div>
                <h3 className="sdv2-ben-title">{b.title}</h3>
                <p className="sdv2-ben-text">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7: PROCESS ═══ */}
      <ProcessSplit />

      {/* ═══ 8: CTA ═══ */}
      <section className="sdv2-cta" ref={ctaRef}>
        <div className={`container-default sdv2-cta-inner ${ctaVis ? 'in-view' : ''}`}>
          <div className="sdv2-cta-card">
            <h2 className="sdv2-cta-title">¿Listo para transformar tu espacio?</h2>
            <p className="sdv2-cta-text">Agendá una consulta gratuita y recibí tu propuesta en menos de 7 días.</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sdv2-cta-btn"
            >
              AGENDAR CONSULTA
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ 9: CTA CONFIGURATOR / FORM ═══ */}
      <CTAConfigurator source={`Landing Tapicería: ${pageTitle}`} />

    </div>
  );
}
