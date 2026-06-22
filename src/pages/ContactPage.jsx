import { useState } from 'react';
import { useInView, useStaggerInView } from '../hooks/useInView';
import './ContactPage.css';

const faqs = [
  { q: '¿Cuál es el proceso para iniciar un proyecto?', a: 'Todo comienza con una consulta inicial donde entendemos tu visión, necesidades y presupuesto. Realizamos un levantamiento técnico del espacio y presentamos una propuesta creativa con renders 3D en un plazo de 5 a 7 días hábiles.' },
  { q: '¿Cuánto tiempo toma un proyecto típico?', a: 'Depende de la escala. Un proyecto de carpintería puede tomar 4-6 semanas. Un interiorismo residencial completo entre 3 y 6 meses. Proyectos comerciales grandes hasta 8 meses.' },
  { q: '¿Trabajan fuera de CDMX?', a: 'Sí, hemos realizado proyectos en Monterrey, Guadalajara, Querétaro y Cancún. Contamos con logística para envío de mobiliario y supervisión remota de obra.' },
  { q: '¿Cuál es la inversión mínima?', a: 'Proyectos de carpintería desde $80,000 MXN. Interiorismo residencial desde $250,000 MXN. Diseño comercial desde $400,000 MXN. Todo incluye renders, planos y fabricación.' },
  { q: '¿Ofrecen financiamiento?', a: 'Sí, manejamos esquemas de pago a 3 o 6 meses sin intereses para proyectos mayores a $200,000 MXN.' },
];

export default function ContactPage() {
  const [heroRef, heroVis] = useInView({ threshold: 0.1 });
  const [formRef, formVis] = useInView({ threshold: 0.1 });
  const [plannerRef, plannerVis] = useInView({ threshold: 0.15 });
  const [mapRef, mapVis] = useInView({ threshold: 0.1 });
  const [faqRef, faqVis] = useInView({ threshold: 0.1 });
  const [socialRef, socialVis] = useInView({ threshold: 0.1 });

  const [openFaq, setOpenFaq] = useState(-1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [focused, setFocused] = useState({});

  /* Project Planner / Calculator State (NUEVA) */
  const [plannerStep, setPlannerStep] = useState(1);
  const [plannerType, setPlannerType] = useState('residencial');
  const [plannerArea, setPlannerArea] = useState(75);
  const [plannerQuality, setPlannerQuality] = useState('premium');
  const [plannerLocation, setPlannerLocation] = useState('cdmx');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFocus = (field) => setFocused(prev => ({ ...prev, [field]: true }));
  const handleBlur = (field) => {
    if (!formData[field]) setFocused(prev => ({ ...prev, [field]: false }));
  };

  // Calculator Result
  const calculatePlannerResult = () => {
    let pricePerM2 = 5000;
    let timeLabel = '4 meses';

    if (plannerType === 'comercial') {
      pricePerM2 = plannerQuality === 'standard' ? 4200 : plannerQuality === 'premium' ? 7500 : 13000;
      timeLabel = plannerQuality === 'standard' ? '3 meses' : plannerQuality === 'premium' ? '5 meses' : '8 meses';
    } else if (plannerType === 'residencial') {
      pricePerM2 = plannerQuality === 'standard' ? 5500 : plannerQuality === 'premium' ? 9500 : 16000;
      timeLabel = plannerQuality === 'standard' ? '4 meses' : plannerQuality === 'premium' ? '6 meses' : '9 meses';
    } else if (plannerType === 'carpinteria') {
      pricePerM2 = plannerQuality === 'standard' ? 8500 : plannerQuality === 'premium' ? 16000 : 27000;
      timeLabel = plannerQuality === 'standard' ? '6 semanas' : plannerQuality === 'premium' ? '10 semanas' : '16 semanas';
    } else { // produccion
      pricePerM2 = plannerQuality === 'standard' ? 3200 : plannerQuality === 'premium' ? 6000 : 10000;
      timeLabel = plannerQuality === 'standard' ? '3 meses' : plannerQuality === 'premium' ? '5 meses' : '7 meses';
    }

    let multiplier = plannerLocation === 'fuera' ? 1.15 : 1.0;
    const minBudget = Math.round(plannerArea * pricePerM2 * multiplier);
    const maxBudget = Math.round(minBudget * 1.25);

    return {
      min: minBudget.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }),
      max: maxBudget.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }),
      time: timeLabel
    };
  };

  const plannerResult = calculatePlannerResult();

  const applyPlannerToForm = () => {
    setFormData(prev => ({
      ...prev,
      service: plannerType,
      message: `Hola Studio CAB. Estuve usando su planificador de proyectos. Mi espacio es de ${plannerArea}m² en ${plannerLocation === 'cdmx' ? 'CDMX' : 'fuera de CDMX'}, con nivel de acabados ${plannerQuality === 'standard' ? 'Estándar' : plannerQuality === 'premium' ? 'Premium' : 'Colección de Autor'}. El presupuesto estimado fue de ${plannerResult.min} - ${plannerResult.max}. Me gustaría agendar una llamada.`
    }));
    
    // Auto-focus service input
    setFocused(prev => ({ ...prev, service: true, message: true }));

    const formElement = document.querySelector('.cp-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="contact-page page-enter">

      {/* ═══ 1: HERO STATEMENT ═══ */}
      <section className="cp-hero" ref={heroRef}>
        <div className="cp-hero-bg" />
        <div className={`cp-hero-content ${heroVis ? 'in-view' : ''}`}>
          <span className="cp-hero-eyebrow">Contacto</span>
          <h1 className="cp-hero-title">
            {'Hablemos de tu próximo proyecto.'.split(' ').map((word, wi, arr) => (
              <span key={wi} className="cp-hero-word">
                {word.split('').map((char, ci) => {
                  const idx = arr.slice(0, wi).join(' ').length + (wi > 0 ? 1 : 0) + ci;
                  return (
                    <span key={ci} className="cp-hero-letter" style={{ animationDelay: `${0.3 + idx * 0.03}s` }}>
                      {char}
                    </span>
                  );
                })}
                {wi < arr.length - 1 && <span className="cp-hero-letter">&nbsp;</span>}
              </span>
            ))}
          </h1>
        </div>
      </section>

      {/* ═══ 2: FORM ═══ */}
      <section className="cp-form-section" ref={formRef}>
        <div className="container-default">
          <div className={`cp-form-grid ${formVis ? 'in-view' : ''}`}>
            <div className="cp-form-intro">
              <span className="section-eyebrow" style={{opacity:1,transform:'none'}}>Escríbenos</span>
              <h2 className="section-heading" style={{opacity:1,transform:'none'}}>
                Tu idea merece ser <em>escuchada</em>.
              </h2>
              <p className="cp-form-intro-text">
                Completá el formulario y te respondemos en menos de 24 horas. Podemos agendar una videollamada o una visita a nuestro showroom.
              </p>
            </div>

            <form className="cp-form" onSubmit={(e) => e.preventDefault()}>
              {[
                { name: 'name', label: 'Nombre Completo', type: 'text' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'phone', label: 'Teléfono / WhatsApp', type: 'tel' },
              ].map(field => (
                <div key={field.name} className={`cp-field ${focused[field.name] || formData[field.name] ? 'active' : ''}`}>
                  <label className="cp-field-label">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onFocus={() => handleFocus(field.name)}
                    onBlur={() => handleBlur(field.name)}
                    className="cp-field-input"
                  />
                  <div className="cp-field-line" />
                </div>
              ))}

              <div className={`cp-field ${focused.service || formData.service ? 'active' : ''}`}>
                <label className="cp-field-label">Servicio de Interés</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  onFocus={() => handleFocus('service')}
                  onBlur={() => handleBlur('service')}
                  className="cp-field-input cp-field-select"
                >
                  <option value=""></option>
                  <option value="comercial">Diseño Comercial</option>
                  <option value="residencial">Interiorismo Residencial</option>
                  <option value="carpinteria">Carpintería sobre Diseño</option>
                  <option value="produccion">Producción e Instalación</option>
                  <option value="otro">Otro</option>
                </select>
                <div className="cp-field-line" />
              </div>

              <div className={`cp-field cp-field-textarea ${focused.message || formData.message ? 'active' : ''}`}>
                <label className="cp-field-label">Cuéntanos sobre tu proyecto</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus('message')}
                  onBlur={() => handleBlur('message')}
                  className="cp-field-input"
                  rows="4"
                />
                <div className="cp-field-line" />
              </div>

              <button type="submit" className="cp-submit-btn">
                Enviar Mensaje
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══ 3: PLANIFICADOR DE PROYECTOS (NUEVA) ═══ */}
      <section className="cp-planner-section" ref={plannerRef}>
        <div className="container-default">
          <span className={`section-eyebrow ${plannerVis ? 'in-view' : ''}`}>Planificador</span>
          <h2 className={`section-heading ${plannerVis ? 'in-view' : ''}`}>Calculá tu <em>presupuesto estimado</em>.</h2>
          
          <div className={`cp-planner-container ${plannerVis ? 'in-view' : ''}`}>
            <div className="cp-planner-steps-box">
              <div className="cp-planner-step-indicator">
                {[1, 2, 3, 4].map(s => (
                  <button
                    key={s}
                    className={`cp-planner-dot-btn ${plannerStep === s ? 'active' : ''} ${s < plannerStep ? 'past' : ''}`}
                    onClick={() => setPlannerStep(s)}
                  >
                    <span>{s}</span>
                  </button>
                ))}
              </div>

              <div className="cp-planner-body">
                {plannerStep === 1 && (
                  <div className="cp-planner-tab">
                    <h4>1. ¿Qué tipo de proyecto es?</h4>
                    <div className="cp-planner-options">
                      {[
                        { id: 'residencial', label: 'Residencial' },
                        { id: 'comercial', label: 'Comercial' },
                        { id: 'carpinteria', label: 'Carpintería' },
                        { id: 'produccion', label: 'Obra e Instalación' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          className={`cp-planner-opt-btn ${plannerType === opt.id ? 'active' : ''}`}
                          onClick={() => setPlannerType(opt.id)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {plannerStep === 2 && (
                  <div className="cp-planner-tab">
                    <h4>2. ¿Cuántos metros cuadrados (m²)?</h4>
                    <div className="cp-planner-range">
                      <div className="cp-range-labels">
                        <label>Área del espacio:</label>
                        <span className="cp-range-val">{plannerArea} m²</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="500"
                        step="5"
                        value={plannerArea}
                        onChange={(e) => setPlannerArea(parseInt(e.target.value))}
                        className="cp-range-slider"
                      />
                    </div>
                  </div>
                )}

                {plannerStep === 3 && (
                  <div className="cp-planner-tab">
                    <h4>3. ¿Qué nivel de acabados preferís?</h4>
                    <div className="cp-planner-options">
                      {[
                        { id: 'standard', label: 'Estándar' },
                        { id: 'premium', label: 'Premium' },
                        { id: 'coleccion', label: 'Colección de Autor' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          className={`cp-planner-opt-btn ${plannerQuality === opt.id ? 'active' : ''}`}
                          onClick={() => setPlannerQuality(opt.id)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {plannerStep === 4 && (
                  <div className="cp-planner-tab">
                    <h4>4. ¿Dónde está ubicado?</h4>
                    <div className="cp-planner-options">
                      {[
                        { id: 'cdmx', label: 'Ciudad de México (CDMX)' },
                        { id: 'fuera', label: 'Fuera de CDMX (Interior)' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          className={`cp-planner-opt-btn ${plannerLocation === opt.id ? 'active' : ''}`}
                          onClick={() => setPlannerLocation(opt.id)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="cp-planner-nav">
                {plannerStep > 1 && (
                  <button className="cp-planner-nav-btn prev" onClick={() => setPlannerStep(prev => prev - 1)}>Anterior</button>
                )}
                {plannerStep < 4 ? (
                  <button className="cp-planner-nav-btn next" onClick={() => setPlannerStep(prev => prev + 1)}>Siguiente</button>
                ) : (
                  <span className="cp-planner-complete-msg">¡Listo para ver resultados!</span>
                )}
              </div>
            </div>

            <div className="cp-planner-result-box">
              <div className="cp-planner-result-card">
                <span className="cp-result-lbl">[ESTIMACIÓN CONCEPTUAL]</span>
                <h3 className="cp-result-price">{plannerResult.min} – {plannerResult.max}</h3>
                <span className="cp-result-currency">Pesos Mexicanos (MXN)</span>
                
                <div className="cp-result-divider" />
                
                <div className="cp-result-row">
                  <span className="cp-row-lbl">Tiempo estimado de ejecución:</span>
                  <span className="cp-row-val">{plannerResult.time}</span>
                </div>

                <button className="cp-result-apply-btn" onClick={applyPlannerToForm}>
                  Aplicar al Formulario de Contacto
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4: MAP & LOCATION ═══ */}
      <section className="cp-map-section" ref={mapRef}>
        <div className={`cp-map-grid ${mapVis ? 'in-view' : ''}`}>
          <div className="cp-map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.6614938918826!2d-99.19564!3d19.4331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fff0f79c4f2b%3A0x74e6c7ad4c4a1a!2sPolanco%2C%20Ciudad%20de%20M%C3%A9xico!5e0!3m2!1ses!2smx!4v1700000000000!5m2!1ses!2smx"
              width="100%" height="100%" style={{border:0,filter:'saturate(0.5) contrast(1.1)'}} allowFullScreen="" loading="lazy"
              title="Studio CAB Location"
            />
          </div>
          <div className="cp-contact-info">
            <h3 className="cp-info-title">Visítanos</h3>
            <div className="cp-info-items">
              <div className="cp-info-item">
                <span className="cp-info-label">[SHOWROOM & TALLER]</span>
                <span className="cp-info-value">Polanco, Ciudad de México</span>
              </div>
              <div className="cp-info-item">
                <span className="cp-info-label">[HORARIO]</span>
                <span className="cp-info-value">Lun — Vie: 9:00 — 18:00</span>
              </div>
              <div className="cp-info-item">
                <span className="cp-info-label">[TELÉFONO]</span>
                <a href="tel:+525512345678" className="cp-info-value cp-info-link">+52 55 1234 5678</a>
              </div>
              <div className="cp-info-item">
                <span className="cp-info-label">[EMAIL]</span>
                <a href="mailto:proyectos@studiocab.com" className="cp-info-value cp-info-link">proyectos@studiocab.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5: FAQ ═══ */}
      <section className="cp-faq" ref={faqRef}>
        <div className="container-default">
          <span className={`section-eyebrow ${faqVis ? 'in-view' : ''}`}>FAQ</span>
          <h2 className={`section-heading ${faqVis ? 'in-view' : ''}`}>Preguntas <em>frecuentes</em>.</h2>
          <div className="cp-faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`cp-faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="cp-faq-question" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>{faq.q}</span>
                  <span className="cp-faq-icon">{openFaq === i ? '−' : '+'}</span>
                </button>
                <div className="cp-faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6: SOCIAL & WHATSAPP ═══ */}
      <section className="cp-social" ref={socialRef}>
        <div className={`container-default cp-social-inner ${socialVis ? 'in-view' : ''}`}>
          <h2 className="cp-social-title">También nos encontrás en</h2>
          <div className="cp-social-grid">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="cp-social-card">
              <span className="cp-social-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </span>
              <span className="cp-social-name">Instagram</span>
              <span className="cp-social-handle">@studiocab</span>
            </a>
            <a href="https://wa.me/525512345678" target="_blank" rel="noopener noreferrer" className="cp-social-card cp-whatsapp">
              <span className="cp-social-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </span>
              <span className="cp-social-name">WhatsApp</span>
              <span className="cp-social-handle">Enviar mensaje</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="cp-social-card">
              <span className="cp-social-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </span>
              <span className="cp-social-name">LinkedIn</span>
              <span className="cp-social-handle">Studio CAB</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
