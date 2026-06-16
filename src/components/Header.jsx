import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { cartCount, setCartOpen, cartOpen } = useCart();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu on resize to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  // Track page scroll to apply compact styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navItems = [
    { label: 'Proyectos', to: '/proyectos', num: '01' },
    { label: 'Servicios', to: '/servicios', num: '02' },
    { label: 'Nosotros', to: '/nosotros', num: '03' },
    { label: 'Tienda', to: '/tienda', num: '04' },
    { label: 'Contacto', to: '/contacto', num: '05' },
  ];

  return (
    <header className={`header-technical ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-nav-container">
        {/* Logo — links to Home */}
        <Link to="/" className="header-logo-link">
          <img
            src="/logo-cab.png"
            alt="Grupo CAB Studio"
            className="header-logo-image"
          />
        </Link>

        {/* Desktop Nav List */}
        <nav className="header-desktop-nav">
          <ul className="header-nav-list">
            {navItems.map((item, index) => (
              <li key={index} className="header-nav-item">
                <Link
                  to={item.to}
                  className={`header-nav-link ${location.pathname.startsWith(item.to) ? 'active' : ''}`}
                >
                  <span className="header-nav-num">[{item.num}]</span> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA & Burger Wrapper */}
        <div className="header-actions">
          <Link to="/contacto" className="header-cta-btn">
            COTIZAR PROYECTO
            <span className="cta-btn-coord">[CAB-101]</span>
          </Link>

          {/* Cart Icon Toggle */}
          <button
            className={`header-cart-toggle clickable ${cartCount > 0 ? 'has-items' : ''}`}
            onClick={() => setCartOpen(!cartOpen)}
            aria-label="Ver carrito"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span key={cartCount} className="header-cart-badge">{cartCount}</span>
            )}
          </button>

          {/* Technical Hamburger Menu Toggle */}
          <button
            className={`header-burger-btn ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>
        </div>
      </div>

      {/* Full-Screen Technical Mobile Drawer Overlay */}
      <div className={`header-mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-blueprint-bg" />
        
        {/* Coordinate decoration markers */}
        <div className="mobile-drawer-cross top-left">+</div>
        <div className="mobile-drawer-cross top-right">+</div>
        <div className="mobile-drawer-cross bottom-left">+</div>
        <div className="mobile-drawer-cross bottom-right">+</div>
        <div className="mobile-drawer-code">[MENU_ACTIVE // CDMX 2026]</div>

        <ul className="mobile-nav-list">
          {navItems.map((item, index) => (
            <li key={index} className="mobile-nav-item">
              <Link 
                to={item.to} 
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                <span className="mobile-nav-num">[{item.num}]</span>
                <span className="mobile-nav-txt">{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="mobile-nav-item cta-item">
            <Link 
              to="/contacto" 
              className="mobile-nav-cta-link"
              onClick={() => setMenuOpen(false)}
            >
              COTIZAR PROYECTO
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
