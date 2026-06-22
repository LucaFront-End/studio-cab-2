import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import './ProductPage.css';

const productsDB = {
  'mesa-nogal': { name: 'Mesa Rústica Nogal', price: '$28,500', material: 'Nogal macizo', dimensions: '200 × 90 × 75 cm', weight: '45 kg', finish: 'Aceite natural', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80','https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80'], description: 'Mesa de comedor tallada en una sola pieza de nogal negro americano. La veta natural se preserva con un acabado de aceite que resalta la profundidad del tono chocolate. Base de acero cepillado con estructura triangulada.', related: ['mesa-marmol','silla-roble'] },
  'silla-roble': { name: 'Silla Escultura Roble', price: '$12,800', material: 'Roble europeo', dimensions: '55 × 50 × 82 cm', weight: '8 kg', finish: 'Laca satinada', images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80','https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80','https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80'], description: 'Silla de diseño esculpida en roble europeo con curvatura ergonómica tallada a mano. Asiento cóncavo que se adapta al cuerpo. Ensambles de caja y espiga sin tornillería visible.', related: ['sillon-cuero','mesa-nogal'] },
  'lampara-arco': { name: 'Lámpara Arco Latón', price: '$18,200', material: 'Latón + mármol', dimensions: '180 × 40 cm (arco)', weight: '12 kg', finish: 'Latón cepillado', images: ['https://images.unsplash.com/photo-1507473885765-e6ed057ab3fe?w=800&q=80','https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'], description: 'Lámpara de pie con arco de latón macizo cepillado y base de mármol travertine pulido. Pantalla de lino natural con difusor de acrílico óptico. Dimmer integrado.', related: ['lampara-mesa','espejo-arco'] },
  'estante-metal': { name: 'Estante Industrial', price: '$15,900', material: 'Acero + nogal', dimensions: '120 × 35 × 200 cm', weight: '35 kg', finish: 'Pintura electrostática negra', images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80'], description: 'Estantería de estructura de acero con pintura electrostática y entrepaños de nogal macizo. 5 niveles con ajuste de altura. Incluye anclaje a pared.', related: ['mesa-nogal','espejo-arco'] },
  'mesa-marmol': { name: 'Mesa Centro Mármol', price: '$34,000', material: 'Mármol travertine + acero', dimensions: '120 × 60 × 40 cm', weight: '52 kg', finish: 'Pulido mate', images: ['https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800&q=80','https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'], description: 'Mesa de centro esculpida en una sola losa de mármol travertine romano con vetas naturales. Base de acero inoxidable con acabado espejo. Pieza única irrepetible.', related: ['mesa-nogal','lampara-arco'] },
  'sillon-cuero': { name: 'Sillón Cuero Natural', price: '$42,500', material: 'Cuero vacuno + nogal', dimensions: '85 × 80 × 78 cm', weight: '28 kg', finish: 'Cuero curtido vegetal', images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80','https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'], description: 'Sillón lounge con estructura de nogal americano y tapiz de cuero vacuno curtido de forma vegetal. Cojines de espuma de alta densidad con relleno de pluma de ganso.', related: ['silla-roble','mesa-nogal'] },
  'espejo-arco': { name: 'Espejo Arco Bronce', price: '$9,800', material: 'Vidrio + bronce', dimensions: '60 × 120 cm', weight: '14 kg', finish: 'Bronce antiguo', images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80','https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'], description: 'Espejo con marco de latón con acabado bronce antiguo envejecido a mano. Forma de arco catedral inspirada en la arquitectura colonial mexicana.', related: ['lampara-arco','estante-metal'] },
  'lampara-mesa': { name: 'Lámpara Mesa Onyx', price: '$7,600', material: 'Onyx + latón', dimensions: '30 × 45 cm', weight: '4 kg', finish: 'Onyx translúcido', images: ['https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=800&q=80','https://images.unsplash.com/photo-1507473885765-e6ed057ab3fe?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'], description: 'Lámpara de mesa con cuerpo de onyx mexicano translúcido que proyecta una luz cálida ambiental. Base de latón con dimmer táctil integrado.', related: ['lampara-arco','espejo-arco'] },
};

const careTips = [
  { title: 'Madera de Nogal / Roble', text: 'Limpiar con un paño seco o levemente húmedo. Evitar productos abrasivos con silicona. Re-encerar cada 6 meses con ceras orgánicas naturales.' },
  { title: 'Latón y Metales', text: 'Limpiar con microfibra suave. El latón oxidado o cepillado adquirirá una pátina natural con el tiempo. Evitar humedad estancada.' },
  { title: 'Mármoles y Onyx', text: 'Piedras altamente porosas. Limpiar de inmediato cualquier derrame de líquidos ácidos (limón, café, vino) para evitar manchas permanentes.' }
];

export default function ProductPage() {
  const { id } = useParams();
  const product = productsDB[id];
  const [activeImg, setActiveImg] = useState(0);
  const [showSpecs, setShowSpecs] = useState(false);

  const [heroRef, heroVis] = useInView({ threshold: 0.1 });
  const [careRef, careVis] = useInView({ threshold: 0.15 });
  const [customRef, customVis] = useInView({ threshold: 0.15 });
  const [relRef, relVis] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaVis] = useInView({ threshold: 0.2 });

  if (!product) {
    return (
      <div className="page-enter" style={{ padding: '200px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: 'var(--colors--theme-black)' }}>Producto no encontrado</h1>
        <Link to="/tienda" style={{ color: 'var(--colors--theme-orange)', fontWeight: 700, marginTop: 20, display: 'inline-block' }}>← Volver a la Tienda</Link>
      </div>
    );
  }

  const specs = [
    { label: 'Material', value: product.material },
    { label: 'Dimensiones', value: product.dimensions },
    { label: 'Peso', value: product.weight },
    { label: 'Acabado', value: product.finish },
    { label: 'Fabricación', value: 'Hecho a mano — CDMX' },
    { label: 'Garantía', value: '5 años en estructura' },
  ];

  return (
    <div className="product-page page-enter">

      {/* ═══ 1: GALLERY + INFO ═══ */}
      <section className="prp-hero" ref={heroRef}>
        <div className={`container-default prp-hero-grid ${heroVis ? 'in-view' : ''}`}>
          <div className="prp-gallery">
            <div className="prp-main-image">
              <img src={product.images[activeImg]} alt={product.name} className="prp-main-img" />
            </div>
            <div className="prp-thumbnails">
              {product.images.map((img, i) => (
                <button key={i} className={`prp-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                  <img src={img.replace('w=800', 'w=200')} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="prp-info">
            <Link to="/tienda" className="prp-back">← Volver a la Tienda</Link>
            <h1 className="prp-name">{product.name}</h1>
            <span className="prp-price">{product.price} MXN</span>
            <p className="prp-desc">{product.description}</p>

            {/* Tabs */}
            <div className="prp-tabs">
              <button className={`prp-tab ${!showSpecs ? 'active' : ''}`} onClick={() => setShowSpecs(false)}>Descripción</button>
              <button className={`prp-tab ${showSpecs ? 'active' : ''}`} onClick={() => setShowSpecs(true)}>Especificaciones</button>
            </div>
            <div className="prp-tab-content">
              {!showSpecs ? (
                <div className="prp-desc-content">
                  <p>{product.description}</p>
                  <div className="prp-quick-specs">
                    <span><strong>Material:</strong> {product.material}</span>
                    <span><strong>Dimensiones:</strong> {product.dimensions}</span>
                  </div>
                </div>
              ) : (
                <div className="prp-specs-content">
                  {specs.map((spec, i) => (
                    <div key={i} className="prp-spec-row">
                      <span className="prp-spec-label">{spec.label}</span>
                      <span className="prp-spec-value">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link to="/contacto" className="prp-cta-btn">
              Consultar Disponibilidad
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 2: GUÍA DE CUIDADOS (NUEVA) ═══ */}
      <section className="prp-care-section" ref={careRef}>
        <div className="container-default">
          <span className={`section-eyebrow ${careVis ? 'in-view' : ''}`}>Mantenimiento</span>
          <h2 className={`section-heading ${careVis ? 'in-view' : ''}`}>Guía de <em>cuidado y longevidad</em>.</h2>
          
          <div className={`prp-care-grid ${careVis ? 'in-view' : ''}`}>
            {careTips.map((tip, i) => (
              <div key={i} className="prp-care-card" style={{ transitionDelay: `${i * 0.15}s` }}>
                <span className="prp-care-num">0{i + 1}</span>
                <h4 className="prp-care-title">{tip.title}</h4>
                <p className="prp-care-text">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3: PROCESO DE PERSONALIZACIÓN (NUEVA) ═══ */}
      <section className="prp-custom-section" ref={customRef}>
        <div className="container-default">
          <div className={`prp-custom-inner ${customVis ? 'in-view' : ''}`}>
            <div className="prp-custom-info">
              <span className="section-eyebrow">A Medida</span>
              <h2 className="prp-custom-title">Personalizá tu <em>pieza</em>.</h2>
              <p className="prp-custom-text">
                ¿Necesitás otra medida, madera o acabado? Todas nuestras piezas de catálogo pueden fabricarse adaptadas a las dimensiones de tu espacio.
              </p>
              <Link to="/contacto" className="prp-custom-btn">Pedir Presupuesto a Medida</Link>
            </div>
            
            <div className="prp-custom-steps">
              <div className="prp-c-step">
                <span className="prp-c-num">01</span>
                <div>
                  <h4>Selección de Medidas</h4>
                  <p>Ajustamos largo, ancho y altura al milímetro según tus necesidades arquitectónicas.</p>
                </div>
              </div>
              <div className="prp-c-step">
                <span className="prp-c-num">02</span>
                <div>
                  <h4>Materialidad a Elección</h4>
                  <p>Elegí entre Nogal Americano, Roble Europeo, Encino Nacional o terminaciones de Laca.</p>
                </div>
              </div>
              <div className="prp-c-step">
                <span className="prp-c-num">03</span>
                <div>
                  <h4>Desarrollo y Envío</h4>
                  <p>Fabricamos en 4-6 semanas y enviamos con embalaje de alta seguridad.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4: RELATED PRODUCTS ═══ */}
      <section className="prp-related" ref={relRef}>
        <div className="container-default">
          <h2 className="section-heading anim-fade-up in-view">También te puede <em>interesar</em>.</h2>
          <div className={`prp-related-grid ${relVis ? 'in-view' : ''}`}>
            {product.related.map(relId => {
              const rel = productsDB[relId];
              if (!rel) return null;
              return (
                <Link to={`/tienda/${relId}`} key={relId} className="prp-related-card">
                  <div className="prp-related-img">
                    <img src={rel.images[0]} alt={rel.name} />
                  </div>
                  <div className="prp-related-info">
                    <h3>{rel.name}</h3>
                    <span>{rel.price} MXN</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 5: CTA ═══ */}
      <section className="prp-cta-section" ref={ctaRef}>
        <div className={`container-default prp-cta-inner ${ctaVis ? 'in-view' : ''}`}>
          <h2 className="prp-cta-title">¿Interesado?</h2>
          <p className="prp-cta-text">Contactanos para consultar disponibilidad, tiempos de entrega y personalización.</p>
          <Link to="/contacto" className="prp-cta-link">Contactar</Link>
        </div>
      </section>
    </div>
  );
}
