import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView, useStaggerInView } from '../hooks/useInView';
import { useCart } from '../context/CartContext';
import './StorePage.css';

const products = [
  { id: 'mesa-nogal', name: 'Mesa Rústica Nogal', price: '$28,500', category: 'mesas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80', image2: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&q=80' },
  { id: 'silla-roble', name: 'Silla Escultura Roble', price: '$12,800', category: 'sillas', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=500&q=80', image2: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80' },
  { id: 'lampara-arco', name: 'Lámpara Arco Latón', price: '$18,200', category: 'iluminacion', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab3fe?w=500&q=80', image2: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=500&q=80' },
  { id: 'estante-metal', name: 'Estante Industrial', price: '$15,900', category: 'accesorios', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&q=80', image2: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80' },
  { id: 'mesa-marmol', name: 'Mesa Centro Mármol', price: '$34,000', category: 'mesas', image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=500&q=80', image2: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&q=80' },
  { id: 'sillon-cuero', name: 'Sillón Cuero Natural', price: '$42,500', category: 'sillas', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80', image2: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=500&q=80' },
  { id: 'espejo-arco', name: 'Espejo Arco Bronce', price: '$9,800', category: 'accesorios', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=500&q=80', image2: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&q=80' },
  { id: 'lampara-mesa', name: 'Lámpara Mesa Onyx', price: '$7,600', category: 'iluminacion', image: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=500&q=80', image2: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab3fe?w=500&q=80' },
];

const filters = ['Todos', 'Mesas', 'Sillas', 'Iluminación', 'Accesorios'];

export default function StorePage() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [heroRef, heroVis] = useInView({ threshold: 0.1 });
  const [gridRefs, gridVis] = useStaggerInView(products.length, { staggerDelay: 80 });
  const [featRef, featVis] = useInView({ threshold: 0.15 });
  const [ctaRef, ctaVis] = useInView({ threshold: 0.2 });
  const { addToCart } = useCart();

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const filterRefs = useRef([]);

  useEffect(() => {
    const activeIndex = filters.indexOf(activeFilter);
    const activeBtn = filterRefs.current[activeIndex];
    if (activeBtn) {
      setIndicatorStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [activeFilter]);

  const filtered = activeFilter === 'Todos'
    ? products
    : products.filter(p => p.category === activeFilter.toLowerCase().replace('ó', 'o'));

  const featuredProduct = products[4]; // Mesa Mármol

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
            {[...products, ...products, ...products].map((p, i) => (
              <span key={i} className="st-marquee-item">{p.name} <span className="st-marquee-sep">✦</span></span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 2: FILTERS ═══ */}
      <section className="st-filters-section">
        <div className="container-default">
          <div className="st-filters">
            <div className="st-filter-indicator" style={indicatorStyle} />
            {filters.map((f, i) => (
              <button 
                key={f} 
                ref={el => filterRefs.current[i] = el}
                className={`st-filter-btn ${activeFilter === f ? 'active' : ''} clickable`} 
                onClick={() => setActiveFilter(f)}
              >
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
                  <span className="st-product-price">{product.price} MXN</span>
                </div>
                <div className="st-product-actions">
                  <span className="st-product-view">Detalles →</span>
                  <button
                    className="st-product-add-btn clickable"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const numericPrice = parseInt(product.price.replace('$', '').replace(',', ''));
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: numericPrice,
                        image: product.image,
                        category: product.category
                      });
                    }}
                  >
                    + AÑADIR
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4: FEATURED PRODUCT ═══ */}
      <section className="st-featured" ref={featRef}>
        <div className={`st-featured-inner ${featVis ? 'in-view' : ''}`}>
          <div className="st-featured-image-wrapper">
            <img src={featuredProduct.image.replace('w=500', 'w=1200')} alt={featuredProduct.name} />
          </div>
          <div className="st-featured-content">
            <span className="st-featured-badge">Destacado</span>
            <h2 className="st-featured-title">{featuredProduct.name}</h2>
            <p className="st-featured-price">{featuredProduct.price} MXN</p>
            <p className="st-featured-desc">Mesa de centro esculpida en mármol travertine con base de acero inoxidable. Pieza única fabricada a mano en nuestro taller.</p>
            <Link to={`/tienda/${featuredProduct.id}`} className="st-featured-cta">Ver Producto</Link>
          </div>
        </div>
      </section>

      {/* ═══ 5: NEWSLETTER CTA ═══ */}
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
