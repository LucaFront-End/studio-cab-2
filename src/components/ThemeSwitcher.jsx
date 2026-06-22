import { useState, useEffect } from 'react';
import './ThemeSwitcher.css';

const THEMES = {
  original: {
    id: 'original',
    label: 'Versión Original',
    tag: 'DARK',
    swatch: '#0d0f12',
    accent: '#FF8719',
    vars: {
      '--colors--theme-black':  '#0d0f12',
      '--colors--theme-white':  '#F7F2E2',
      '--colors--theme-orange': '#FF8719',
      '--colors--theme-gray':   '#50555e',
      '--color-border':         'rgba(13, 15, 18, 0.1)',
    },
  },
  dorada: {
    id: 'dorada',
    label: 'Paleta Dorada',
    tag: 'GOLD',
    swatch: '#F7F2E2',
    accent: '#EFBF04',
    vars: {
      '--colors--theme-black':  '#000000',
      '--colors--theme-white':  '#F7F2E2',
      '--colors--theme-orange': '#EFBF04',
      '--colors--theme-gray':   '#444444',
      '--color-border':         'rgba(0, 0, 0, 0.1)',
    },
  },
};

function applyTheme(theme) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export default function ThemeSwitcher() {
  const [current, setCurrent] = useState('original');
  const [open, setOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Apply default on mount
  useEffect(() => {
    applyTheme(THEMES.original);
  }, []);

  const switchTo = (id) => {
    if (id === current || transitioning) return;
    setTransitioning(true);

    // Momentary full-page flash overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      background: ${THEMES[id].swatch};
      opacity: 0; pointer-events: none;
      transition: opacity 0.25s ease;
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '0.55';
      setTimeout(() => {
        applyTheme(THEMES[id]);
        setCurrent(id);
        overlay.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(overlay);
          setTransitioning(false);
          setOpen(false);
        }, 300);
      }, 260);
    });
  };

  const currentTheme = THEMES[current];

  return (
    <div className={`theme-switcher-root ${open ? 'open' : ''}`}>
      {/* Backdrop */}
      {open && <div className="ts-backdrop" onClick={() => setOpen(false)} />}

      {/* Panel */}
      <div className="ts-panel">
        <div className="ts-panel-header">
          <span className="ts-panel-label">PALETA DE COLORES</span>
          <span className="ts-panel-tag">[CAB-UI]</span>
        </div>

        <div className="ts-options">
          {Object.values(THEMES).map(theme => (
            <button
              key={theme.id}
              className={`ts-option-btn ${current === theme.id ? 'active' : ''}`}
              onClick={() => switchTo(theme.id)}
              disabled={transitioning}
            >
              <span className="ts-option-swatches">
                <span
                  className="ts-swatch"
                  style={{ background: theme.vars['--colors--theme-black'] }}
                />
                <span
                  className="ts-swatch"
                  style={{ background: theme.vars['--colors--theme-white'] }}
                />
                <span
                  className="ts-swatch"
                  style={{ background: theme.vars['--colors--theme-orange'] }}
                />
              </span>
              <span className="ts-option-info">
                <span className="ts-option-name">{theme.label}</span>
                <span className="ts-option-tag">[{theme.tag}]</span>
              </span>
              {current === theme.id && (
                <span className="ts-active-dot" />
              )}
            </button>
          ))}
        </div>

        <p className="ts-panel-hint">
          Cambio de paleta en tiempo real para presentación al cliente.
        </p>
      </div>

      {/* Floating trigger button */}
      <button
        className="ts-trigger-btn"
        onClick={() => setOpen(v => !v)}
        aria-label="Cambiar paleta de colores"
        title="Cambiar paleta de colores"
      >
        <span className="ts-trigger-icon">
          {/* Palette icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
            <circle cx="8.5"  cy="7.5"  r="0.5" fill="currentColor" />
            <circle cx="6.5"  cy="12.5" r="0.5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
          </svg>
        </span>
        <span className="ts-trigger-swatches">
          <span className="ts-trigger-swatch" style={{ background: currentTheme.vars['--colors--theme-black'] }} />
          <span className="ts-trigger-swatch" style={{ background: currentTheme.vars['--colors--theme-orange'] }} />
        </span>
        <span className="ts-trigger-label">PALETA</span>
      </button>
    </div>
  );
}
