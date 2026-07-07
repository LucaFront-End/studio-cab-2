import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import './ContactPage.css';

const faqs = [
  { q: '¿Cuál es el proceso para iniciar un proyecto?', a: 'Todo comienza con una consulta inicial donde entendemos tu visión, necesidades y presupuesto. Realizamos un levantamiento técnico del espacio y presentamos una propuesta creativa con renders 3D en un plazo de 5 a 7 días hábiles.' },
  { q: '¿Cuánto tiempo toma un proyecto típico?', a: 'Depende de la escala. Un proyecto de carpintería puede tomar 4-6 semanas. Un interiorismo residencial completo entre 3 y 6 meses. Proyectos comerciales grandes hasta 8 meses.' },
  { q: '¿Trabajan fuera de CDMX?', a: 'Sí, hemos realizado proyectos en Monterrey, Guadalajara, Querétaro y Cancún. Contamos con logística para envío de mobiliario y supervisión remota de obra.' },
  { q: '¿Cuál es la inversión mínima?', a: 'Proyectos de carpintería desde $80,000 MXN. Interiorismo residencial desde $250,000 MXN. Diseño comercial desde $400,000 MXN. Todo incluye renders, planos y fabricación.' },
  { q: '¿Ofrecen financiamiento?', a: 'Sí, manejamos esquemas de pago a 3 o 6 meses sin intereses para proyectos mayores a $200,000 MXN.' },
];

const projectTypeLabels = {
  comercial: 'Comercial',
  hotelero: 'Hotelero',
  restaurante: 'Restaurante / Cafetería',
  oficina: 'Oficina',
  residencial: 'Residencial',
  franquicia: 'Franquicia',
  retail: 'Retail / Boutique',
  otro: 'Otro'
};

const serviceLabels = {
  diseño_interiores: 'Diseño de Interiores',
  carpinteria_mobiliario: 'Carpintería y Mobiliario sobre Diseño',
  produccion_mobiliario: 'Producción de Mobiliario',
  instalacion: 'Instalación',
  remodelacion: 'Remodelación',
  proyecto_integral: 'Proyecto Integral',
  asesoria: 'Asesoría'
};

const materialLabels = {
  madera_natural: 'Madera Natural',
  mdf: 'MDF',
  aglomerado: 'Aglomerado',
  mdf_chapa: 'MDF con Chapa',
  madera_maciza: 'Madera Maciza',
  otro: 'Otro'
};

const locationLabels = {
  cdmx: 'Ciudad de México (CDMX)',
  fuera: 'Fuera de CDMX (Interior)'
};

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
  const [plannerType, setPlannerType] = useState('comercial');
  const [plannerService, setPlannerService] = useState('diseño_interiores');
  const [plannerMaterial, setPlannerMaterial] = useState('madera_natural');
  const [plannerCustomMaterial, setPlannerCustomMaterial] = useState('');
  const [plannerLocation, setPlannerLocation] = useState('cdmx');

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.selectedType) {
      setTimeout(() => {
        setPlannerType(location.state.selectedType);
        setPlannerStep(2);
        
        const plannerElement = document.querySelector('.cp-planner-section');
        if (plannerElement) {
          plannerElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFocus = (field) => setFocused(prev => ({ ...prev, [field]: true }));
  const handleBlur = (field) => {
    if (!formData[field]) setFocused(prev => ({ ...prev, [field]: false }));
  };

  const applyPlannerToForm = () => {
    const selectedType = projectTypeLabels[plannerType] || plannerType;
    const selectedService = serviceLabels[plannerService] || plannerService;
    const selectedMaterial = plannerMaterial === 'otro' 
      ? `Otro: ${plannerCustomMaterial || 'No especificado'}` 
      : (materialLabels[plannerMaterial] || plannerMaterial);
    const selectedLocation = locationLabels[plannerLocation] || plannerLocation;

    let formService = 'otro';
    if (plannerType === 'residencial') formService = 'residencial';
    else if (['comercial', 'retail', 'oficina', 'restaurante', 'hotelero', 'franquicia'].includes(plannerType)) formService = 'comercial';
    else if (plannerService === 'carpinteria_mobiliario' || plannerService === 'produccion_mobiliario') formService = 'carpinteria';
    else if (plannerService === 'instalacion') formService = 'produccion';

    setFormData(prev => ({
      ...prev,
      service: formService,
      message: `Hola Studio CAB. He configurado mi propuesta personalizada:\n- Tipo de Proyecto: ${selectedType}\n- Servicio Necesitado: ${selectedService}\n- Material Solicitado: ${selectedMaterial}\n- Ubicación: ${selectedLocation}\n\nMe gustaría recibir más información.`
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
          <h2 className={`section-heading ${plannerVis ? 'in-view' : ''}`}>Solicita una <em>propuesta personalizada</em>.</h2>
          
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
                        { id: 'comercial', label: 'Comercial' },
                        { id: 'hotelero', label: 'Hotelero' },
                        { id: 'restaurante', label: 'Restaurante / Cafetería' },
                        { id: 'oficina', label: 'Oficina' },
                        { id: 'residencial', label: 'Residencial' },
                        { id: 'franquicia', label: 'Franquicia' },
                        { id: 'retail', label: 'Retail / Boutique' },
                        { id: 'otro', label: 'Otro' }
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
                    <h4>2. ¿Qué servicio necesitas?</h4>
                    <div className="cp-planner-options">
                      {[
                        { id: 'diseño_interiores', label: 'Diseño de Interiores' },
                        { id: 'carpinteria_mobiliario', label: 'Carpintería y Mobiliario sobre Diseño' },
                        { id: 'produccion_mobiliario', label: 'Producción de Mobiliario' },
                        { id: 'instalacion', label: 'Instalación' },
                        { id: 'remodelacion', label: 'Remodelación' },
                        { id: 'proyecto_integral', label: 'Proyecto Integral' },
                        { id: 'asesoria', label: 'Asesoría' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          className={`cp-planner-opt-btn ${plannerService === opt.id ? 'active' : ''}`}
                          onClick={() => setPlannerService(opt.id)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {plannerStep === 3 && (
                  <div className="cp-planner-tab">
                    <h4>3. ¿Qué tipo de material estás buscando?</h4>
                    <div className="cp-planner-options">
                      {[
                        { id: 'madera_natural', label: 'Madera Natural' },
                        { id: 'mdf', label: 'MDF' },
                        { id: 'aglomerado', label: 'Aglomerado' },
                        { id: 'mdf_chapa', label: 'MDF con Chapa' },
                        { id: 'madera_maciza', label: 'Madera Maciza' },
                        { id: 'otro', label: 'Otro' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          className={`cp-planner-opt-btn ${plannerMaterial === opt.id ? 'active' : ''}`}
                          onClick={() => setPlannerMaterial(opt.id)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {plannerMaterial === 'otro' && (
                      <div className="cp-planner-custom-input-wrapper">
                        <input
                          type="text"
                          placeholder="Especificá el material que buscás..."
                          value={plannerCustomMaterial}
                          onChange={(e) => setPlannerCustomMaterial(e.target.value)}
                          className="cp-planner-custom-input"
                        />
                      </div>
                    )}
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
                <span className="cp-result-lbl">[PROPUESTA PERSONALIZADA]</span>
                <h3 className="cp-result-summary-title">Resumen de Selección</h3>
                
                <div className="cp-result-divider" />
                
                <div className="cp-result-summary-list">
                  <div className="cp-summary-item">
                    <span className="cp-summary-lbl">Tipo de Proyecto:</span>
                    <span className="cp-summary-val">{projectTypeLabels[plannerType] || 'No seleccionado'}</span>
                  </div>
                  <div className="cp-summary-item">
                    <span className="cp-summary-lbl">Servicio Requerido:</span>
                    <span className="cp-summary-val">{serviceLabels[plannerService] || 'No seleccionado'}</span>
                  </div>
                  <div className="cp-summary-item">
                    <span className="cp-summary-lbl">Material Solicitado:</span>
                    <span className="cp-summary-val">
                      {plannerMaterial === 'otro' 
                        ? (plannerCustomMaterial ? `Otro: ${plannerCustomMaterial}` : 'Otro (Sin especificar)')
                        : (materialLabels[plannerMaterial] || 'No seleccionado')
                      }
                    </span>
                  </div>
                  <div className="cp-summary-item">
                    <span className="cp-summary-lbl">Ubicación:</span>
                    <span className="cp-summary-val">{locationLabels[plannerLocation] || 'No seleccionado'}</span>
                  </div>
                </div>

                <div className="cp-result-divider" />

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
              src="https://maps.google.com/maps?q=Av.+P.%C2%BA+de+la+Reforma+284,+Ju%C3%A1rez,+Cuauht%C3%A9moc,+06600+Ciudad+de+M%C3%A9xico,+CDMX&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%" height="100%" style={{border:0,filter:'saturate(0.5) contrast(1.1)'}} allowFullScreen="" loading="lazy"
              title="Studio CAB Location"
            />
          </div>
          <div className="cp-contact-info">
            <h3 className="cp-info-title">Visítanos</h3>
            <div className="cp-info-items">
              <div className="cp-info-item">
                <span className="cp-info-label">[SHOWROOM & TALLER]</span>
                <span className="cp-info-value">Av. P.º de la Reforma 284, Juárez, Cuauhtémoc, 06600 Ciudad de México, CDMX</span>
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
