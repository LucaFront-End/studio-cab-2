import React from 'react';
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
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Contacto</h4>
            <ul className="footer-contact-list">
              <li className="contact-item">
                <span className="contact-label">[TALLER Y SHOWROOM]</span>
                <span className="contact-val">Polanco, Ciudad de México</span>
              </li>
              <li className="contact-item">
                <span className="contact-label">[TEL / WHATSAPP]</span>
                <a href="tel:+525512345678" className="contact-val link">+52 55 1234 5678</a>
              </li>
              <li className="contact-item">
                <span className="contact-label">[EMAIL]</span>
                <a href="mailto:proyectos@studiocab.com" className="contact-val link">proyectos@studiocab.com</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Social */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Social</h4>
            <div className="footer-social-wrapper">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Pinterest">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
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
