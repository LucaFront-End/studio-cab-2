import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useInView, useStaggerInView } from '../hooks/useInView';
import { useWixCMSData } from '../hooks/useWixCMS';
import { submitWixLead } from '../lib/wixCMS';
import { useDocumentSEO } from '../hooks/useDocumentSEO';
import './StorePage.css';

export default function StorePage() {
  useDocumentSEO(
    'Tienda de Muebles sobre Diseño en CDMX | Grupo CAB Studio',
    'Compra muebles sobre diseño en CDMX fabricados por Grupo CAB Studio. Descubre mobiliario comercial, residencial y carpintería personalizada con envíos a México.'
  );

  const { productos, colecciones, loading } = useWixCMSData();
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitWixLead({
        name: customName,
        email: customEmail,
        phone: customPhone,
        message: customNotes,
        photoUrl: photoPreview,
        source: 'Cotización Especial'
      });
      setIsSuccess(true);
    } catch (err) {
      console.warn('Wix submit failed in custom quote, using local fallback success screen', err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomReset = () => {
    setCustomName('');
    setCustomEmail('');
    setCustomPhone('');
    setCustomNotes('');
    setPhotoPreview('');
    setIsSuccess(false);
    setShowCustomModal(false);
  };

  const [heroRef, heroVis] = useInView({ threshold: 0.1 });
  const [featRef, featVis] = useInView({ threshold: 0.15 });
  const [craftRef, craftVis] = useInView({ threshold: 0.15 });
  const [ctaRef, ctaVis] = useInView({ threshold: 0.2 });

  // Map live Wix products to our layout structure
  const mappedProducts = (productos || []).map(p => {
    const colMap = {};
    (colecciones || []).forEach(c => {
      colMap[c.id] = c.name;
    });

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

  // Derive unique categories dynamically from actual live products (excluding Wix default 'All Products' collection)
  const uniqueCategories = Array.from(
    new Set(mappedProducts.flatMap(p => p.collectionNames))
  ).filter(cat => {
    if (!cat) return false;
    const lower = cat.trim().toLowerCase();
    return lower !== 'all products' && lower !== 'all' && lower !== 'todos los productos' && lower !== 'todos';
  });

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

      {/* ═══ 3.5: CUSTOM DESIGN BANNER (NUEVA) ═══ */}
      <section className="st-custom-banner-section">
        <div className="container-default">
          <div className="st-custom-banner-inner">
            {/* AutoCAD ticks */}
            <div className="corner-cross top-left">+</div>
            <div className="corner-cross top-right">+</div>
            <div className="corner-cross bottom-left">+</div>
            <div className="corner-cross bottom-right">+</div>

            <div className="st-custom-banner-grid">
              <div className="st-custom-banner-img">
                <img src="/custom_furniture_sketch.png" alt="Boceto Técnico de Mobiliario" />
              </div>
              <div className="st-custom-banner-info">
                <span className="st-custom-banner-tag">[SHEET M-102 // DISEÑO SOBRE ESPECIFICACIÓN]</span>
                <h2 className="st-custom-banner-title">Mobiliario de autor a la <em>medida de tus espacios</em></h2>
                <p className="st-custom-banner-desc">
                  ¿Tienes en mente un diseño particular o necesitas adaptar alguna pieza de nuestro catálogo a dimensiones especiales?
                  Enviándonos una foto de referencia o boceto técnico, nuestro equipo de diseño estructurará una propuesta viable con
                  costos de fabricación.
                </p>
                <button 
                  onClick={() => setShowCustomModal(true)} 
                  className="st-custom-banner-btn"
                >
                  Subir Boceto y Cotizar
                </button>
              </div>
            </div>
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
              <img src="/alma_del_taller.webp" alt="El Alma del Taller - Carpintería Artesanal Studio CAB" />
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

      {/* Custom Product Quotation Modal */}
      {showCustomModal && createPortal(
        <div className="st-modal-backdrop" onClick={handleCustomReset}>
          <div className="st-modal-card" onClick={e => e.stopPropagation()}>
            <button className="st-modal-close" onClick={handleCustomReset}>✕</button>
            
            {/* Corner crosshairs for architectural feel */}
            <div className="corner-cross top-left">+</div>
            <div className="corner-cross top-right">+</div>
            <div className="corner-cross bottom-left">+</div>
            <div className="corner-cross bottom-right">+</div>

            <div className="st-modal-header">
              <span className="st-modal-tech-tag">[SHEET M-101 // PIEZA A MEDIDA]</span>
              <h3 className="st-modal-title">Diseño y Fabricación Especial</h3>
              <p className="st-modal-subtitle">Envíanos tu idea o boceto de referencia para cotizar con nuestro taller.</p>
            </div>

            {isSuccess ? (
              <div className="st-modal-success">
                <div className="st-modal-success-icon">✓</div>
                <h4>Propuesta Recibida con Éxito</h4>
                <p>
                  Gracias, <strong>{customName}</strong>. Hemos registrado tu solicitud y la imagen de referencia. 
                  Nuestro equipo de diseño técnico analizará la viabilidad y te contactará mediante 
                  <strong> {customEmail}</strong> o <strong>{customPhone}</strong> con una propuesta económica formal.
                </p>
                <button className="st-modal-success-btn" onClick={handleCustomReset}>Volver a la Tienda</button>
              </div>
            ) : (
              <form className="st-modal-form" onSubmit={handleCustomSubmit}>
                
                {/* Image Upload Area */}
                <div className="st-upload-container">
                  <label className="st-upload-label">
                    <input 
                      type="file" 
                      accept="image/*" 
                      required 
                      onChange={handlePhotoChange} 
                      className="st-file-input" 
                    />
                    {photoPreview ? (
                      <div className="st-upload-preview">
                        <img src={photoPreview} alt="Vista previa del boceto" />
                        <span className="st-upload-change-btn">Cambiar Foto</span>
                      </div>
                    ) : (
                      <div className="st-upload-placeholder">
                        <span className="upload-icon">📷</span>
                        <span className="upload-text">Selecciona una imagen o foto de referencia</span>
                        <span className="upload-limit">[JPG, PNG // MAX 5MB]</span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="st-modal-grid">
                  <div className="st-modal-input-group">
                    <input 
                      type="text" 
                      required 
                      placeholder="Nombre Completo" 
                      value={customName} 
                      onChange={e => setCustomName(e.target.value)} 
                      className="st-modal-input" 
                    />
                    <span className="st-modal-tech-label">[CLIENTE / ID]</span>
                  </div>

                  <div className="st-modal-grid-2col">
                    <div className="st-modal-input-group">
                      <input 
                        type="email" 
                        required 
                        placeholder="Correo Electrónico" 
                        value={customEmail} 
                        onChange={e => setCustomEmail(e.target.value)} 
                        className="st-modal-input" 
                      />
                      <span className="st-modal-tech-label">[EMAIL / ENVELOPE]</span>
                    </div>

                    <div className="st-modal-input-group">
                      <input 
                        type="tel" 
                        required 
                        placeholder="Teléfono" 
                        value={customPhone} 
                        onChange={e => setCustomPhone(e.target.value)} 
                        className="st-modal-input" 
                      />
                      <span className="st-modal-tech-label">[TEL / MOBILE]</span>
                    </div>
                  </div>

                  <div className="st-modal-input-group">
                    <textarea 
                      placeholder="Notas sobre medidas, maderas, acabados o especificaciones adicionales..." 
                      value={customNotes} 
                      onChange={e => setCustomNotes(e.target.value)} 
                      className="st-modal-textarea" 
                    />
                    <span className="st-modal-tech-label">[NOTAS TÉCNICAS]</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="st-modal-submit-btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Analizando Viabilidad...' : 'Enviar Solicitud de Cotización'}
                </button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
