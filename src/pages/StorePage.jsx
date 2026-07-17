import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView, useStaggerInView } from '../hooks/useInView';
import { useWixCMSData } from '../hooks/useWixCMS';
import './StorePage.css';

export default function StorePage() {
  const { productos, loading } = useWixCMSData();
  const [activeFilter, setActiveFilter] = useState('Todos');

  const [heroRef, heroVis] = useInView({ threshold: 0.1 });
  const [featRef, featVis] = useInView({ threshold: 0.15 });
  const [craftRef, craftVis] = useInView({ threshold: 0.15 });
  const [ctaRef, ctaVis] = useInView({ threshold: 0.2 });

  // Map live Wix products to our layout structure
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
      description: p.description 
        ? p.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().slice(0, 160) + (p.description.replace(/<[^>]*>/g, '').trim().length > 160 ? '...' : '')
        : 'Mobiliario de autor diseñado y fabricado a mano en nuestro taller de CDMX con materiales premium.',
      material: p.additionalInfoSections?.find(s => s.title?.toLowerCase().includes('material'))?.description || 'Maderas selectas / MDF de alta densidad',
      dimensions: p.additionalInfoSections?.find(s => s.title?.toLowerCase().includes('dimens'))?.description || 'Medidas sobre diseño ejecutivo',
      weight: p.weight ? `${p.weight} kg` : 'Sobre cotización',
      finish: p.additionalInfoSections?.find(s => s.title?.toLowerCase().includes('acabado'))?.description || 'Barniz o laca premium',
    };
  });

  const [gridRefs, gridVis] = useStaggerInView(mappedProducts.length > 0 ? mappedProducts.length : 1, { staggerDelay: 80 });

  if (loading) {
    return (
      <div className="store-loading page-enter">
        <div className="spinner"></div>
        <p>Cargando productos de la tienda...</p>
      </div>
    );
  }

  // Derive unique categories dynamically from actual live products
  const uniqueCategories = Array.from(
    new Set(mappedProducts.flatMap(p => p.collectionNames))
  ).filter(cat => cat !== '');

  const filters = ['Todos', ...uniqueCategories];

  const filtered = activeFilter === 'Todos'
    ? mappedProducts
    : mappedProducts.filter(p => p.collectionNames.includes(activeFilter));

  const featuredProduct = mappedProducts[0] || null;

  return (
    <div className="store-page page-enter">

      {/* ═══ 1: HERO ═══ */}
      <section className="st-hero" ref={heroRef}>
        <div className="st-hero-bg" />
        <div className={`st-hero-content ${heroVis ? 'in-view' : ''}`}>
          <span className="st-hero-eyebrow">Tienda</span>
          <h1 className="st-hero-title">Mobiliario de Autor<span className="sp-dot">.</span></h1>
          <p className="st-hero-sub">Piezas únicas fabricadas en nuestro taller</p>
        </div>
        <div className="st-marquee-wrapper">
          <div className="st-marquee-track">
            {[...mappedProducts, ...mappedProducts, ...mappedProducts].map((p, i) => (
              <span key={i} className="st-marquee-item">{p.name} <span className="st-marquee-sep">✦</span></span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 2: FILTERS ═══ */}
      <section className="st-filters-section">
        <div className="container-default">
          <div className="st-filters">
            {filters.map(f => (
              <button key={f} className={`st-filter-btn ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3: PRODUCT GRID ═══ */}
      <section className="st-grid-section">
        <div className="container-default">
          <div className="st-product-grid">
            {filtered.map((product, i) => (
              <Link to={`/tienda/${product.id}`} key={product.id} ref={el => gridRefs.current[i] = el} className={`st-product-card ${gridVis[i] ? 'in-view' : ''}`}>
                <div className="st-product-images">
                  <img src={product.image} alt={product.name} className="st-product-img st-img-primary" />
                  <img src={product.image2} alt={product.name} className="st-product-img st-img-secondary" />
                </div>
                <div className="st-product-info">
                  <h3 className="st-product-name">{product.name}</h3>
                  <span className="st-product-price">{product.price}</span>
                </div>
                <span className="st-product-view">Ver Detalle →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4: FEATURED PRODUCT ═══ */}
      {featuredProduct && (
        <section className="st-featured" ref={featRef}>
          <div className={`st-featured-inner ${featVis ? 'in-view' : ''}`}>
            <div className="st-featured-image-wrapper">
              <img src={featuredProduct.image} alt={featuredProduct.name} />
            </div>
            <div className="st-featured-content">
              <span className="st-featured-badge">Destacado</span>
              <h2 className="st-featured-title">{featuredProduct.name}</h2>
              <p className="st-featured-price">{featuredProduct.price}</p>
              <p className="st-featured-desc">{featuredProduct.description}</p>
              <Link to={`/tienda/${featuredProduct.id}`} className="st-featured-cta">Ver Producto</Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ 5: EL ALMA DEL TALLER (NUEVA) ═══ */}
      <section className="st-craftsmanship" ref={craftRef}>
        <div className="container-default">
          <div className={`st-craft-grid ${craftVis ? 'in-view' : ''}`}>
            <div className="st-craft-image-box">
              <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80" alt="Carpintería Artesanal" />
              <div className="st-craft-image-badge">100% Hecho a Mano</div>
            </div>
            
            <div className="st-craft-info">
              <span className="section-eyebrow">Manufactura</span>
              <h2 className="st-craft-title">El Alma del <em>Taller</em>.</h2>
              <p className="st-craft-text">
                Cada pieza de nuestra tienda es concebida y fabricada íntegramente en nuestro taller en la CDMX. Fusionamos la precisión del corte CNC con el oficio tradicional de la carpintería artesanal.
              </p>
              
              <div className="st-craft-details">
                <div className="st-craft-detail-item">
                  <span className="st-craft-icon">✦</span>
                  <div>
                    <h4>Madera Sustentable Certificada</h4>
                    <p>Utilizamos exclusivamente Nogal Americano y Roble Europeo con certificación FSC.</p>
                  </div>
                </div>
                
                <div className="st-craft-detail-item">
                  <span className="st-craft-icon">✦</span>
                  <div>
                    <h4>Acabados Ecológicos</h4>
                    <p>Protegemos la madera con aceites naturales y ceras orgánicas libres de plomo.</p>
                  </div>
                </div>
                
                <div className="st-craft-detail-item">
                  <span className="st-craft-icon">✦</span>
                  <div>
                    <h4>Precisión Milimétrica</h4>
                    <p>Corte por computadora CNC combinado con ensamble y lijado final a mano.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6: NEWSLETTER CTA ═══ */}
      <section className="st-newsletter" ref={ctaRef}>
        <div className={`container-default st-newsletter-inner ${ctaVis ? 'in-view' : ''}`}>
          <h2 className="st-newsletter-title">Recibí novedades y lanzamientos</h2>
          <p className="st-newsletter-text">Suscribite a nuestro newsletter para enterarte de nuevas piezas y colecciones exclusivas.</p>
          <form className="st-newsletter-form" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Tu email" className="st-newsletter-input" />
            <button type="submit" className="st-newsletter-btn">Suscribir</button>
          </form>
        </div>
      </section>
    </div>
  );
}
