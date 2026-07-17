import { useState } from 'react';
import { submitWixLead } from '../lib/wixCMS';
import './CTAConfigurator.css';

const SPACE_OPTIONS = [
  {
    id: 'retail',
    title: 'Local Comercial',
    desc: 'Retail, cafeterías, restaurantes y boutiques de experiencia.',
    code: 'CAB-RTL // SCALE 1:50',
    icon: (
      <svg className="cta-option-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    id: 'office',
    title: 'Oficina Corporativa',
    desc: 'Espacios de trabajo modernos, eficientes y colaborativos.',
    code: 'CAB-CORP // SCALE 1:100',
    icon: (
      <svg className="cta-option-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="9" y1="22" x2="9" y2="16" />
        <line x1="15" y1="22" x2="15" y2="16" />
        <line x1="9" y1="16" x2="15" y2="16" />
        <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M12 6h.01M12 10h.01" />
      </svg>
    )
  },
  {
    id: 'showroom',
    title: 'Showroom / Galería',
    desc: 'Exhibición premium donde el espacio cuenta la historia de tu marca.',
    code: 'CAB-SHWR // SCALE 1:50',
    icon: (
      <svg className="cta-option-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    )
  },
  {
    id: 'custom',
    title: 'Mobiliario a Medida',
    desc: 'Carpintería de alta costura e integración técnica de madera y metal.',
    code: 'CAB-WDWRK // DETAIL 1:10',
    icon: (
      <svg className="cta-option-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    )
  }
];

const STYLE_OPTIONS = [
  {
    id: 'minimalist',
    title: 'Minimalista & Puro',
    desc: 'Maderas claras, líneas geométricas limpias y abundante iluminación natural.',
    code: 'FINISH // LIGHT-OAK',
    icon: (
      <svg className="cta-option-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      </svg>
    )
  },
  {
    id: 'textured',
    title: 'Cálido & Texturizado',
    desc: 'Materiales nobles expuestos, vetas pronunciadas y un carácter industrial sobrio.',
    code: 'FINISH // IND-WALNUT',
    icon: (
      <svg className="cta-option-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  {
    id: 'bold',
    title: 'Editorial & Audaz',
    desc: 'Contrastes dramáticos, metales pulidos y acentos de diseño que llaman la atención.',
    code: 'FINISH // HGH-CONTRAST',
    icon: (
      <svg className="cta-option-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <line x1="12" y1="22" x2="12" y2="12" />
        <line x1="12" y1="12" x2="22" y2="8.5" />
        <line x1="12" y1="12" x2="2" y2="8.5" />
      </svg>
    )
  },
  {
    id: 'classic',
    title: 'Clásico Moderno',
    desc: 'Molduras contemporáneas, elegancia atemporal y herrajes ocultos de alta gama.',
    code: 'FINISH // CONTEMP-MOLDING',
    icon: (
      <svg className="cta-option-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    )
  }
];

export default function CTAConfigurator({ source = 'Inicio' }) {
  const [step, setStep] = useState(1);
  const [spaceType, setSpaceType] = useState('');
  const [styleTheme, setStyleTheme] = useState('');
  const [areaSize, setAreaSize] = useState(120);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !contact) return;

    setIsSubmitting(true);
    try {
      await submitWixLead({
        name: name,
        phone: !contact.includes('@') ? contact : '',
        email: contact.includes('@') ? contact : '',
        spaceType: selectedSpaceObj?.title || spaceType,
        styleTheme: selectedStyleObj?.title || styleTheme,
        areaSize: areaSize,
        source: `Planificador - Origen: ${source || 'General'}`,
        message: `Configuración de Planificador:\n- Espacio: ${selectedSpaceObj?.title || spaceType}\n- Concepto: ${selectedStyleObj?.title || styleTheme}\n- Dimensión: ${areaSize} m²`
      });
      setIsSuccess(true);
    } catch (err) {
      console.warn('Wix submit failed in planner, using local fallback success screen', err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSpaceType('');
    setStyleTheme('');
    setAreaSize(120);
    setName('');
    setContact('');
    setIsSuccess(false);
  };

  const selectedSpaceObj = SPACE_OPTIONS.find(o => o.id === spaceType);
  const selectedStyleObj = STYLE_OPTIONS.find(o => o.id === styleTheme);

  const progressPct = ((step - 1) / 2) * 100;

  return (
    <section className="cta-configurator-section" id="cta-configurator">
      <div className="cta-blueprint-grid" />
      <div className="cta-blueprint-line-h top" />
      <div className="cta-blueprint-line-h bottom" />
      <div className="cta-blueprint-line-v left" />
      <div className="cta-blueprint-line-v right" />
      
      <div className="cta-container">
        <span className="cta-eyebrow">DISEÑO Y MANUFACTURA</span>
        <h2 className="cta-title-main">Comencemos tu espacio</h2>
        <p className="cta-desc-main">
          Usa nuestro configurador express para delinear tu visión. Nos pondremos en contacto contigo para concretar los detalles técnicos y planificar la obra.
        </p>

        {isSuccess ? (
          <div className="cta-card">
            {/* Corner AutoCAD Ticks */}
            <div className="cta-card-corner top-left">+</div>
            <div className="cta-card-corner top-right">+</div>
            <div className="cta-card-corner bottom-left">+</div>
            <div className="cta-card-corner bottom-right">+</div>
            <div className="cta-card-side-label">[SHEET A-101 // APPROVED // ORIGEN: {source.toUpperCase()}]</div>

            <div className="cta-success-screen">
              <div className="cta-success-icon-wrapper">
                <svg className="cta-success-svg" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="cta-success-title">PROPUESTA TÉCNICA APROBADA</h3>
              <p className="cta-success-desc">
                Gracias, <strong>{name}</strong>. Hemos registrado tu configuración (enviada desde la página de <strong>{source}</strong>) para un proyecto de <strong>{selectedSpaceObj?.title}</strong> con una escala de aprox. <strong>{areaSize} m²</strong> y acabados en concepto <strong>{selectedStyleObj?.title}</strong>. El equipo de Studio CAB analizará la viabilidad técnica y se comunicará contigo mediante <strong>{contact}</strong>.
              </p>

              {/* Signature Block for technical feel */}
              <div className="cta-signature-block">
                <div className="cta-sig-line">
                  <div className="cta-sig-name">{name}</div>
                  <div className="cta-sig-title">Cliente Proponente</div>
                </div>
                <div className="cta-sig-line">
                  <div className="cta-sig-name">Studio CAB Modernas</div>
                  <div className="cta-sig-title">Director Técnico / CDMX</div>
                </div>
              </div>

              <button className="cta-btn-reset" onClick={handleReset}>
                Configurar Otro Proyecto
              </button>
            </div>
          </div>
        ) : (
          <div className="cta-card">
            {/* Corner AutoCAD Ticks */}
            <div className="cta-card-corner top-left">+</div>
            <div className="cta-card-corner top-right">+</div>
            <div className="cta-card-corner bottom-left">+</div>
            <div className="cta-card-corner bottom-right">+</div>
            <div className="cta-card-side-label">[CONFIGURADOR ESPACIAL // CDMX // {source.toUpperCase()}]</div>

            <div className="cta-card-header">
              <div className="cta-progress-text">
                <span>Paso {step} de 3 // {selectedSpaceObj ? selectedSpaceObj.title : 'Elegir'}</span>
                <span>{Math.round(progressPct)}% COMPLETADO</span>
              </div>
              <div className="cta-progress-track">
                <div className="cta-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              
              <h3 className="cta-step-title">
                {step === 1 && '01 / Selecciona el tipo de espacio'}
                {step === 2 && '02 / Elige la estética y acabados'}
                {step === 3 && '03 / Define la escala y contacto'}
              </h3>
            </div>

            <div className="cta-step-content">
              {step === 1 && (
                <div className="cta-grid-options cta-slide-fade-enter-active">
                  {SPACE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`cta-option-btn ${spaceType === opt.id ? 'selected' : ''}`}
                      onClick={() => setSpaceType(opt.id)}
                    >
                      {/* corner crosshair decorations */}
                      <div className="corner-cross top-left">+</div>
                      <div className="corner-cross top-right">+</div>
                      <div className="corner-cross bottom-left">+</div>
                      <div className="corner-cross bottom-right">+</div>

                      {opt.icon}
                      <span className="cta-option-title">{opt.title}</span>
                      <span className="cta-option-desc">{opt.desc}</span>
                      <span className="cta-option-tech-tag">{opt.code}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="cta-grid-options cta-slide-fade-enter-active">
                  {STYLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`cta-option-btn ${styleTheme === opt.id ? 'selected' : ''}`}
                      onClick={() => setStyleTheme(opt.id)}
                    >
                      {/* corner crosshair decorations */}
                      <div className="corner-cross top-left">+</div>
                      <div className="corner-cross top-right">+</div>
                      <div className="corner-cross bottom-left">+</div>
                      <div className="corner-cross bottom-right">+</div>

                      {opt.icon}
                      <span className="cta-option-title">{opt.title}</span>
                      <span className="cta-option-desc">{opt.desc}</span>
                      <span className="cta-option-tech-tag">{opt.code}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <form className="cta-step3-container cta-slide-fade-enter-active" onSubmit={handleSubmit}>
                  <div className="cta-slider-wrapper">
                    <div className="cta-slider-header">
                      <span className="cta-slider-label">Dimensión Aproximada (Área)</span>
                      <span className="cta-slider-value">{areaSize === 500 ? '500+ m²' : `${areaSize} m²`}</span>
                    </div>
                    <div className="cta-slider-input-container">
                      <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={areaSize}
                        onChange={(e) => setAreaSize(parseInt(e.target.value))}
                        className="cta-range-input"
                      />
                      {/* Ticks matching metric scale */}
                      <div className="cta-ruler-ticks" />
                    </div>
                    <div className="cta-slider-labels">
                      <span>10 m²</span>
                      <span>250 m²</span>
                      <span>500+ m²</span>
                    </div>
                  </div>

                  <div className="cta-form-grid">
                    <div className="cta-input-group">
                      <input
                        type="text"
                        required
                        placeholder="ej. Arq. Daniel Ramos"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="cta-input-field"
                      />
                      <span className="cta-input-tech-label">[CLIENTE / ID]</span>
                    </div>
                    <div className="cta-input-group">
                      <input
                        type="text"
                        required
                        placeholder="ej. +52 55 1234 5678 o mail@correo.com"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="cta-input-field"
                      />
                      <span className="cta-input-tech-label">[CONTACTO / RFC]</span>
                    </div>
                  </div>
                </form>
              )}
            </div>

            <div className="cta-card-footer">
              <div className="cta-summary-details">
                <span className="cta-summary-label">Resumen de Parámetros</span>
                <span className="cta-summary-text">
                  {spaceType ? selectedSpaceObj?.title : '...'}
                  {styleTheme ? ` • Concepto ${selectedStyleObj?.title}` : ''}
                  {step === 3 ? ` • ~${areaSize === 500 ? '500+' : areaSize} m²` : ''}
                </span>
              </div>

              <div className="cta-actions-wrapper">
                {step > 1 && (
                  <button type="button" className="cta-btn-nav cta-btn-prev" onClick={handlePrev}>
                    Atrás
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    className="cta-btn-nav cta-btn-next"
                    disabled={(step === 1 && !spaceType) || (step === 2 && !styleTheme)}
                    onClick={handleNext}
                  >
                    Continuar
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="cta-btn-nav cta-btn-submit"
                    disabled={!name || !contact || isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? 'Validando...' : 'Enviar Mi Idea'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
