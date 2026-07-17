/* eslint-disable react-hooks/set-state-in-effect */
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useInView } from '../hooks/useInView';
import { useWixCMSData } from '../hooks/useWixCMS';
import CTAConfigurator from '../components/CTAConfigurator';
import './ProductPage.css';

const careTips = [
  { title: 'Madera de Nogal / Roble', text: 'Limpiar con un paño seco o levemente húmedo. Evitar productos abrasivos con silicona. Re-encerar cada 6 meses con ceras orgánicas naturales.' },
  { title: 'Latón y Metales', text: 'Limpiar con microfibra suave. El latón oxidado o cepillado adquirirá una pátina natural con el tiempo. Evitar humedad estancada.' },
  { title: 'Mármoles y Onyx', text: 'Piedras altamente porosas. Limpiar de inmediato cualquier derrame de líquidos ácidos (limón, café, vino) para evitar manchas permanentes.' }
];

export default function ProductPage() {
  const { id } = useParams();
  const { productos, loading } = useWixCMSData();
  const [activeImg, setActiveImg] = useState(0);
  const [showSpecs, setShowSpecs] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  // Reset active image index on product change
  useEffect(() => {
    setActiveImg(0);
  }, [id]);

  const [heroRef, heroVis] = useInView({ threshold: 0.1 });
  const [careRef, careVis] = useInView({ threshold: 0.15 });
  const [customRef, customVis] = useInView({ threshold: 0.15 });
  const [relRef, relVis] = useInView({ threshold: 0.1 });

  if (loading) {
    return (
      <div className="store-loading page-enter">
        <div className="spinner"></div>
        <p>Cargando detalles del producto...</p>
      </div>
    );
  }

  // Map live Wix products to our structure
  const mappedProducts = (productos || []).map(p => {
    const colMap = {
      '9412b68c-f9a3-0f76-303c-62dc441f8ab7': 'Sillas',
      'd5e57831-3481-3adf-d857-2ba34ed1fabc': 'Muebles sobre Diseño',
      '42c9a723-70b8-3bfb-4865-eec96dd795ee': 'Archivero',
      '96befe81-d8aa-1228-85ef-96d2c67d1aec': 'Closet',
      'e730e772-0355-ef09-12aa-a6fd3a61a6d5': 'Mini',
      'f84954f0-2bce-3f7a-2c98-203577ac2a14': 'Agua',
      '82f0b8b7-6684-6b61-4c58-89a6d4265429': 'Tierra'
    };

    const collections = (p.collectionIds || []).map(id => colMap[id] || '').filter(name => name !== '');
    const primaryCategory = collections[0] || 'Accesorios';

    const images = (p.media?.items || []).map(item => item.image?.url).filter(url => !!url);
    if (images.length === 0 && p.media?.mainMedia?.image?.url) {
      images.push(p.media.mainMedia.image.url);
    }

    return {
      id: p.id || p._id,
      slug: p.slug,
      name: p.name,
      price: p.price?.formatted?.price || p.priceData?.formatted?.price || (p.price?.price ? `$${p.price.price}` : ''),
      category: primaryCategory.toLowerCase(),
      collectionNames: collections,
      image: p.media?.mainMedia?.image?.url || '',
      image2: p.media?.items?.[1]?.image?.url || p.media?.mainMedia?.image?.url || '',
      images: images,
      description: p.description || 'Mobiliario de autor diseñado y fabricado a mano en nuestro taller de CDMX con materiales premium.',
      material: p.additionalInfoSections?.find(s => s.title?.toLowerCase().includes('material'))?.description || 'Maderas selectas / MDF de alta densidad',
      dimensions: p.additionalInfoSections?.find(s => s.title?.toLowerCase().includes('dimens'))?.description || 'Medidas sobre diseño ejecutivo',
      weight: p.weight ? `${p.weight} kg` : 'Sobre cotización',
      finish: p.additionalInfoSections?.find(s => s.title?.toLowerCase().includes('acabado'))?.description || 'Barniz o laca premium',
    };
  });

  const product = mappedProducts.find(p => p.id === id);

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
            <div className="prp-main-image" onClick={() => setLightbox(activeImg)} style={{ cursor: 'pointer' }}>
              <img src={product.images[activeImg]} alt={product.name} className="prp-main-img" />
            </div>
            <div className="prp-thumbnails">
              {product.images.map((img, i) => (
                <button key={i} className={`prp-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="prp-info">
            <Link to="/tienda" className="prp-back">← Volver a la Tienda</Link>
            <h1 className="prp-name">{product.name}</h1>
            <span className="prp-price">{product.price}</span>
            <div className="prp-desc" dangerouslySetInnerHTML={{ __html: product.description }} />

            {/* Trust Badges for Conversion */}
            <div className="prp-trust-badges">
              <div className="prp-badge-item">
                <span className="badge-icon">📐</span>
                <div className="badge-text">
                  <h5>A Medida</h5>
                  <p>Dimensiones adaptables a tu espacio</p>
                </div>
              </div>
              <div className="prp-badge-item">
                <span className="badge-icon">🚚</span>
                <div className="badge-text">
                  <h5>Envío Seguro</h5>
                  <p>Entrega técnica con embalaje de protección</p>
                </div>
              </div>
              <div className="prp-badge-item">
                <span className="badge-icon">🛡️</span>
                <div className="badge-text">
                  <h5>Garantía</h5>
                  <p>5 años de garantía estructural</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="prp-tabs">
              <button className={`prp-tab ${!showSpecs ? 'active' : ''}`} onClick={() => setShowSpecs(false)}>Descripción</button>
              <button className={`prp-tab ${showSpecs ? 'active' : ''}`} onClick={() => setShowSpecs(true)}>Especificaciones</button>
            </div>
            <div className="prp-tab-content">
              {!showSpecs ? (
                <div className="prp-desc-content">
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  <div className="prp-quick-specs" style={{ marginTop: '20px' }}>
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

            <div className="prp-action-buttons">
              <a 
                href={`https://wa.me/525512345678?text=${encodeURIComponent(
                  `Hola Studio CAB. Me interesa cotizar y personalizar el mueble "${product.name}" de su catálogo. ¿Me podrían dar información sobre costos y tiempos de entrega?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="prp-whatsapp-btn"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '8px' }}>
                  <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.812.48 3.564 1.392 5.124L2 22l5.004-1.308c1.512.828 3.204 1.272 4.992 1.272C17.52 22 22 17.52 22 12.012c0-2.676-1.044-5.184-2.928-7.08C17.184 3.036 14.688 2 12.012 2zm5.724 14.124c-.252.708-1.464 1.296-2.004 1.344-.492.048-.972.24-3.156-.624-2.772-1.104-4.524-3.924-4.656-4.104-.132-.18-1.092-1.452-1.092-2.772 0-1.32.684-1.968.936-2.232.252-.264.672-.384 1.08-.384.144 0 .276.012.396.012.348.012.516.036.744.576.228.552.792 1.932.864 2.076.072.144.12.312.024.504-.096.192-.144.312-.288.48-.144.168-.312.384-.444.516-.144.144-.3.3-.132.588.168.288.756 1.248 1.62 2.016.924.816 1.704 1.068 1.944 1.188.24.12.384.108.528-.06.144-.168.624-.72.792-.96.168-.24.336-.204.564-.12.228.084 1.452.684 1.704.816.252.132.42.192.48.3.06.108.06.624-.192 1.332z" />
                </svg>
                <span>Cotizar por WhatsApp</span>
              </a>
              
              <a href="#cta-configurator" className="prp-planner-btn">
                Planificador de Presupuesto
              </a>
            </div>
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
                ¿Necesitás otra medida, madera o acabado? Todas nuestras piezas de catálogo pueden fabricarse adaptadas a las dimensions de tu espacio.
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
            {mappedProducts.filter(p => p.id !== product?.id).slice(0, 3).map(rel => (
              <Link to={`/tienda/${rel.id}`} key={rel.id} className="prp-related-card">
                <div className="prp-related-img">
                  <img src={rel.image} alt={rel.name} />
                </div>
                <div className="prp-related-info">
                  <h3>{rel.name}</h3>
                  <span>{rel.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5: CONFIGURATOR FORM (CONVERSION FOCUS) ═══ */}
      <section id="cta-configurator">
        <CTAConfigurator source={`Catálogo: ${product.name}`} />
      </section>

      {/* Lightbox rendered in document.body Portal to escape transforms */}
      {lightbox !== null && createPortal(
        <div className="pdv2-lightbox" onClick={() => setLightbox(null)}>
          <button className="pdv2-lb-close" onClick={() => setLightbox(null)}>✕</button>
          <img 
            src={product.images[lightbox]} 
            alt="" 
            onClick={(e) => e.stopPropagation()}
          />
          <div className="pdv2-lb-nav" onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox > 0 ? lightbox - 1 : product.images.length - 1); }}>←</button>
            <span>{lightbox + 1} / {product.images.length}</span>
            <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox < product.images.length - 1 ? lightbox + 1 : 0); }}>→</button>
          </div>
          
          {/* WhatsApp CTA Button in Lightbox */}
          <div className="pdv2-lb-whatsapp-container" onClick={(e) => e.stopPropagation()}>
            <a 
              href={`https://wa.me/525512345678?text=${encodeURIComponent(
                `Hola Studio CAB, me interesa cotizar un diseño de la pieza de catálogo "${product.name}": ${product.images[lightbox]}`
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
    </div>
  );
}
