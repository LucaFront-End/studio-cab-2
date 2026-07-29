import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-blueprint-grid" />
      <div className="container-default">
        <div className="footer-top-grid">
          {/* Col 1: Brand Info */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo-wrapper">
              <img
                src="/logo-cab.png"
                alt="Grupo CAB Studio"
                className="footer-logo-image"
              />
            </Link>
            <p className="footer-brand-desc">
              Espacios comerciales y residencias premium que integran arquitectura interior de alto nivel y carpintería fina manufacturada en nuestro propio taller en la Ciudad de México.
            </p>
            <div className="footer-coord-badge">
              <span className="coord-dot"></span>
              <span className="coord-text">CDMX // 19.4326° N, 99.1332° W</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Navegación</h4>
            <ul className="footer-links-list">
              <li><Link to="/" className="footer-link"><span className="link-num">01 //</span> Inicio</Link></li>
              <li><Link to="/proyectos" className="footer-link"><span className="link-num">02 //</span> Proyectos</Link></li>
              <li><Link to="/servicios" className="footer-link"><span className="link-num">03 //</span> Servicios</Link></li>
              <li><Link to="/nosotros" className="footer-link"><span className="link-num">04 //</span> Nosotros</Link></li>
              <li><Link to="/tienda" className="footer-link"><span className="link-num">05 //</span> Tienda</Link></li>
              <li><Link to="/contacto" className="footer-link"><span className="link-num">06 //</span> Contacto</Link></li>
              <li><Link to="/zonas-de-cobertura" className="footer-link"><span className="link-num">07 //</span> Zonas de Cobertura</Link></li>
            </ul>
          </div>

          {/* Col 3: Negocios (SEO) */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Negocios</h4>
            <ul className="footer-links-list">
              <li><Link to="/negocios/gimnasios" className="footer-link"><span className="link-num">→</span> Gimnasios</Link></li>
              <li><Link to="/negocios/hoteles" className="footer-link"><span className="link-num">→</span> Hoteles</Link></li>
              <li><Link to="/negocios/oficinas" className="footer-link"><span className="link-num">→</span> Oficinas</Link></li>
              <li><Link to="/negocios/restaurantes" className="footer-link"><span className="link-num">→</span> Restaurantes</Link></li>
              <li><Link to="/negocios/retail" className="footer-link"><span className="link-num">→</span> Boutiques / Retail</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Contacto</h4>
            <ul className="footer-contact-list">
              <li className="contact-item">
                <span className="contact-label">[TALLER Y SHOWROOM]</span>
                <span className="contact-val">Av. P.º de la Reforma 284, Juárez, Cuauhtémoc, CDMX</span>
              </li>
              <li className="contact-item">
                <span className="contact-label">[TEL / WHATSAPP]</span>
                <a href="tel:+525516406963" className="contact-val link">+52 55 1640 6963</a>
              </li>
              <li className="contact-item">
                <span className="contact-label">[EMAIL]</span>
                <a href="mailto:proyectos@studiocab.mx" className="contact-val link">proyectos@studiocab.mx</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Social */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Social</h4>
            <div className="footer-social-wrapper">
              <a href="https://www.instagram.com/studiocab.mx" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://www.facebook.com/studiocab.mx/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@studiocab.mx" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="TikTok">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.48V13a8.3 8.3 0 0 0 5.73 2.26V11.8a4.83 4.83 0 0 1-3.77-1.34h-.01V6.69z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} Studio CAB Modernas. Todos los derechos reservados.
          </div>
          <div className="footer-system-status">
            [SYSTEM: OPERATIONAL // WORKSPACE OK]
          </div>
        </div>
      </div>
    </footer>
  );
}
