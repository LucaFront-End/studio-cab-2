import { useParams, Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { useDocumentSEO } from '../hooks/useDocumentSEO';
import './BusinessDetailPage.css';

const INDUSTRIES_DATA = {
  gimnasios: {
    plannerType: 'hotelero',
    title: 'Gimnasios y Centros Wellness',
    niche: 'Carpintería para Gimnasios',
    subtitle: 'Mobiliario de alto tráfico y ebanistería premium para clubes deportivos y centros de salud.',
    heroImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80',
    intro: 'Diseñamos y fabricamos mobiliario personalizado que resiste el uso continuo y las condiciones de humedad, sin perder la sofisticación que exige tu marca. Desde áreas de recepción de mármol y madera hasta lockers inteligentes integrados.',
    benefits: [
      { title: 'Lockers de Alto Tráfico', desc: 'Fabricados en MDF hidrófugo y chapas naturales tratadas contra humedad, equipados con cerraduras electrónicas integradas.' },
      { title: 'Barras de Recepción e Hitos', desc: 'Diseños escultóricos monolíticos combinando maderas macizas, piedras sinterizadas y sistemas de iluminación LED.' },
      { title: 'Zonas Funcionales y Racks', desc: 'Estructuras modulares a medida para equipamiento, paneles acústicos de roble y detalles ergonómicos para usuarios.' }
    ],
    metrics: [
      { val: '+3,500', lbl: 'Lockers Fabricados', sub: 'Instalados en CDMX y área metropolitana' },
      { val: '100%', lbl: 'Materiales Antihumedad', sub: 'Certificación hidrófuga en vestidores' },
      { val: 'Grade 5', lbl: 'Resistencia Estructural', sub: 'Apto para tráfico comercial continuo' }
    ],
    materials: [
      { name: 'MDF Hidrófugo', spec: 'Resistencia extrema a la absorción de humedad y hongos', use: 'Estructuras de lockers, vestidores y repisas' },
      { name: 'Piedra Sinterizada', spec: 'Porosidad cero, higiene quirúrgica y alta resistencia a rayado', use: 'Cubiertas de lavabos y barras de recepción' },
      { name: 'Encino Hidrorrepelente', spec: 'Tratado con barniz acrílico sellado de alta densidad', use: 'Lambrines divisorios y bancos modulares' }
    ],
    phases: [
      { step: '01', title: 'Levantamiento Láser 3D', desc: 'Escaneo milimétrico en obra para asegurar que la carpintería modular encaje a la perfección sin ajustes en sitio.' },
      { step: '02', title: 'Ingeniería CAD/CAM', desc: 'Desglose constructivo digital en planos de taller para corte asistido por computadora CNC.' },
      { step: '03', title: 'Montaje y Ajustes en Obra', desc: 'Logística de transporte y ensamblado por nuestro personal en sitio, garantizando herrajes perfectos.' }
    ],
    ctaText: 'Solicitar propuesta para Gimnasio'
  },
  hoteles: {
    plannerType: 'hotelero',
    title: 'Hoteles y Hospitalidad',
    niche: 'Mobiliario para Hoteles',
    subtitle: 'Soluciones de carpintería y acabados de lujo para habitaciones, lobbys y áreas comunes.',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80',
    intro: 'Producción a escala hotelera manteniendo rigurosos estándares de calidad artesanal. Nos especializamos en equipamiento de habitaciones (cabeceros, clósets, escritorios) y mobiliario monumental para lobbys.',
    benefits: [
      { title: 'Equipamiento de Habitaciones (FF&E)', desc: 'Producción masiva homologada de mobiliario fijo y móvil con acabados retardantes al fuego y de alta durabilidad.' },
      { title: 'Lobbys y Áreas Comunes', desc: 'Revestimientos monumentales de madera en muros y plafones, barras de bar y áreas de check-in de diseño exclusivo.' },
      { title: 'Estandarización y Garantía', desc: 'Procesos de control de calidad CNC para asegurar que cada habitación mantenga la misma precisión milimétrica.' }
    ],
    metrics: [
      { val: '+12', lbl: 'Hoteles Equipados', sub: 'Habitaciones y lobbys monumentales' },
      { val: 'FF&E', lbl: 'Estándar Internacional', sub: 'Garantía de homologación hotelera' },
      { val: 'Class A', lbl: 'Retardante de Fuego', sub: 'Aplicación de barnices ignífugos certificados' }
    ],
    materials: [
      { name: 'Nogal Natural Seleccionado', spec: 'Veta continua emparejada a mano, textura mate de tacto sedoso', use: 'Cabeceros monumentales y escritorios ejecutivos' },
      { name: 'Laminado de Alta Presión (HPL)', spec: 'Protección extrema contra impactos y rayaduras comunes de maletas', use: 'Clósets, interiores de cajones y maleteros' },
      { name: 'Mármol Travertino Imperial', spec: 'Corte a veta sellado con protector hidrófugo mate', use: 'Mesetas de tocador e hitos de recepción' }
    ],
    phases: [
      { step: '01', title: 'Levantamiento Láser 3D', desc: 'Escaneo milimétrico en obra para asegurar que la carpintería modular encaje a la perfección sin ajustes en sitio.' },
      { step: '02', title: 'Ingeniería CAD/CAM', desc: 'Desglose constructivo digital en planos de taller para corte asistido por computadora CNC.' },
      { step: '03', title: 'Montaje y Ajustes en Obra', desc: 'Logística de transporte y ensamblado por nuestro personal en sitio, garantizando herrajes perfectos.' }
    ],
    ctaText: 'Solicitar propuesta para Hotel'
  },
  oficinas: {
    plannerType: 'oficina',
    title: 'Oficinas Corporativas y Coworkings',
    niche: 'Mobiliario para Oficinas',
    subtitle: 'Espacios de trabajo ergonómicos que fomentan la colaboración, la concentración y proyectan la identidad corporativa.',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
    intro: 'Creamos entornos de oficina contemporáneos optimizando la acústica, la ergonomía y la conectividad. Fabricamos mesas de junta monumentales, cabinas de privacidad acústicas y recepciones corporativas.',
    benefits: [
      { title: 'Mesas de Junta y Conectividad', desc: 'Diseños de gran formato en maderas seleccionadas con sistemas integrados de gestión de cableado y conectividad oculta.' },
      { title: 'Panelería Acústica y Lambrín', desc: 'Sistemas de revestimiento ranurado de roble o nogal con aislamiento acústico posterior para salas de reuniones y zonas privadas.' },
      { title: 'Estaciones de Trabajo y Almacenaje', desc: 'Soluciones modulares ergonómicas para personal operativo y ejecutivos, optimizando la distribución del espacio.' }
    ],
    metrics: [
      { val: '-18dB', lbl: 'Absorción Acústica', sub: 'Lograda en panelería ranurada y lambrín' },
      { val: '100%', lbl: 'Ergonomía Activa', sub: 'Certificación en mesas y estaciones modulares' },
      { val: 'CNC', lbl: 'Corte de Conectividad', sub: 'Gestión limpia de cables integrada' }
    ],
    materials: [
      { name: 'Triplay de Abedul Multicapa', spec: 'Núcleo multi-capas de alta estabilidad, cantos expuestos pulidos', use: 'Escritorios de trabajo y mesas de juntas corporativas' },
      { name: 'Fieltro Acústico PET', spec: 'Fibras recicladas de poliéster con alta absorción de ruido', use: 'Mamparas divisorias, cabinas telefónicas y biombos' },
      { name: 'Acero Electropintado', spec: 'Recubrimiento en polvo curado a horno, resistente a abrasión', use: 'Estructuras de mesa y soportes de conectividad' }
    ],
    phases: [
      { step: '01', title: 'Levantamiento Láser 3D', desc: 'Escaneo milimétrico en obra para asegurar que la carpintería modular encaje a la perfección sin ajustes en sitio.' },
      { step: '02', title: 'Ingeniería CAD/CAM', desc: 'Desglose constructivo digital en planos de taller para corte asistido por computadora CNC.' },
      { step: '03', title: 'Montaje y Ajustes en Obra', desc: 'Logística de transporte y ensamblado por nuestro personal en sitio, garantizando herrajes perfectos.' }
    ],
    ctaText: 'Solicitar propuesta para Oficinas'
  },
  restaurantes: {
    plannerType: 'restaurante',
    title: 'Restaurantes, Cafeterías y Bares',
    niche: 'Mobiliario para Restaurantes',
    subtitle: 'Interiorismo comercial y mobiliario sobre diseño que define la experiencia gastronómica y maximiza la rotación.',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=80',
    intro: 'Entendemos que el mobiliario en alimentos y bebidas es una pieza clave de la operación. Diseñamos barras monumentales que resisten el derrame de líquidos y booths ergonómicos que invitan a la permanencia.',
    benefits: [
      { title: 'Barras de Bar de Alto Impacto', desc: 'Cubiertas de madera tratada o piedra sinterizada, con subestructuras metálicas preparadas para instalaciones de baristas.' },
      { title: 'Booths y Banquetas a Medida', desc: 'Sistemas de asientos fijos tapizados en pieles sintéticas de grado comercial y estructuras internas reforzadas.' },
      { title: 'Mesas y Sillas de Autor', desc: 'Fabricación propia de mobiliario de comedor coordinado con el concepto estético y la paleta de materiales del lugar.' }
    ],
    metrics: [
      { val: '+80', lbl: 'Barras de Bar Ejecutadas', sub: 'Diseñadas e instaladas en CDMX' },
      { val: 'Anti-Stain', lbl: 'Tratamiento Especial', sub: 'Piedras y maderas tratadas contra ácidos' },
      { val: 'Grade-A', lbl: 'Barniz Poliuretano', sub: 'Resistente a derrames térmicos y alcohol' }
    ],
    materials: [
      { name: 'Mármol Tecnológico', spec: 'Resistencia total a manchas de limón, vino y grasas comunes', use: 'Cubiertas de barra principal y contrabarras' },
      { name: 'Madera de Tzalam Maciza', spec: 'Especie tropical de alta densidad con secado al horno controlado', use: 'Mesas de comensales y frentes de barra escultóricos' },
      { name: 'Piel Sintética Grado Náutico', spec: 'Fácil limpieza, antibacterial y retardante al fuego', use: 'Tapicería fina de booths fijos y barstools' }
    ],
    phases: [
      { step: '01', title: 'Levantamiento Láser 3D', desc: 'Escaneo milimétrico en obra para asegurar que la carpintería modular encaje a la perfección sin ajustes en sitio.' },
      { step: '02', title: 'Ingeniería CAD/CAM', desc: 'Desglose constructivo digital en planos de taller para corte asistido por computadora CNC.' },
      { step: '03', title: 'Montaje y Ajustes en Obra', desc: 'Logística de transporte y ensamblado por nuestro personal en sitio, garantizando herrajes perfectos.' }
    ],
    ctaText: 'Solicitar propuesta para Restaurante'
  },
  retail: {
    plannerType: 'retail',
    title: 'Retail, Tiendas y Boutiques',
    niche: 'Mobiliario para Retail',
    subtitle: 'Sistemas de exhibición de lujo que destacan la mercancía y elevan el valor percibido de la marca.',
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80',
    intro: 'Diseñamos vitrinas, percheros flotantes y mesas de exhibición donde la iluminación integrada y la materialidad sofisticada atraen la atención del cliente hacia el producto.',
    benefits: [
      { title: 'Vitrinas e Iluminación Focalizada', desc: 'Estructuras de herrería fina y vidrio templado con iluminación LED integrada de alto índice de reproducción cromática (CRI).' },
      { title: 'Percheros y Displays Flotantes', desc: 'Sistemas modulares ajustables en acero inoxidable cepillado, latón o acabados en pintura electrostática mate.' },
      { title: 'Puntos de Venta y Cashwraps', desc: 'Muebles de caja con diseño premium y áreas funcionales ocultas para empaque, cableado y sistemas de cobro.' }
    ],
    metrics: [
      { val: '+120', lbl: 'Displays y Vitrinas', sub: 'Instalados en zonas de alto tráfico' },
      { val: 'Overnight', lbl: 'Montaje Nocturno', sub: 'Evitamos detener las operaciones comerciales' },
      { val: 'High-CRI', lbl: 'Sistemas LED', sub: 'Fidelidad total del color en exhibición' }
    ],
    materials: [
      { name: 'Acero Inoxidable 304', spec: 'Pulido espejo o satinado fino, alta resistencia a corrosión', use: 'Racks perimetrales y percheros de colgado' },
      { name: 'Vidrio Extra-Claro Templado', spec: 'Bajo contenido de hierro, eliminación del tinte verde', use: 'Campanas de exhibición de joyería y vitrinas cerradas' },
      { name: 'Laminado Italiano Texturizado', spec: 'Acabado tridimensional táctil imitación concreto o madera', use: 'Paneles de muro ranurado e islas de cobro' }
    ],
    phases: [
      { step: '01', title: 'Levantamiento Láser 3D', desc: 'Escaneo milimétrico en obra para asegurar que la carpintería modular encaje a la perfección sin ajustes en sitio.' },
      { step: '02', title: 'Ingeniería CAD/CAM', desc: 'Desglose constructivo digital en planos de taller para corte asistido por computadora CNC.' },
      { step: '03', title: 'Montaje y Ajustes en Obra', desc: 'Logística de transporte y ensamblado por nuestro personal en sitio, garantizando herrajes perfectos.' }
    ],
    ctaText: 'Solicitar propuesta para Boutique'
  }
};

const BUSINESS_SEO = {
  gimnasios: {
    title: 'Diseño de Gimnasios en CDMX | Grupo CAB Studio',
    description: 'Diseñamos gimnasios en CDMX con mobiliario sobre diseño, carpintería, recepciones, lockers y espacios funcionales que mejoran la experiencia de los usuarios.'
  },
  hoteles: {
    title: 'Diseño de Hoteles en CDMX | Grupo CAB Studio',
    description: 'Grupo CAB Studio desarrolla proyectos de diseño para hoteles en CDMX con carpintería fina, mobiliario sobre diseño, lobby, habitaciones y áreas comunes.'
  },
  oficinas: {
    title: 'Diseño de Oficinas en CDMX | Grupo CAB Studio',
    description: 'Creamos oficinas modernas en CDMX con carpintería sobre diseño, mobiliario corporativo y espacios colaborativos que impulsan productividad e imagen empresarial.'
  },
  restaurantes: {
    title: 'Diseño de Restaurantes en CDMX | Grupo CAB Studio',
    description: 'Especialistas en diseño de restaurantes en CDMX. Integramos interiorismo, carpintería, tapicería y muebles sobre diseño para crear espacios que venden y generan experiencias.'
  },
  retail: {
    title: 'Diseño de Boutiques y Retail en CDMX | Grupo CAB Studio',
    description: 'Grupo CAB Studio diseña boutiques y espacios retail en CDMX con exhibidores, mostradores, carpintería fina y muebles sobre diseño para potenciar la experiencia de compra.'
  }
};

export default function BusinessDetailPage() {
  const { id } = useParams();
  const industry = INDUSTRIES_DATA[id];

  const seo = BUSINESS_SEO[id] || {
    title: industry ? `${industry.title} en CDMX | Grupo CAB Studio` : 'Negocios | Grupo CAB Studio',
    description: industry ? industry.subtitle : 'Proyectos de diseño e interiorismo para negocios por Grupo CAB Studio.'
  };
  useDocumentSEO(seo.title, seo.description);

  const [heroRef, heroVis] = useInView({ threshold: 0.1 });
  const [metricsRef, metricsVis] = useInView({ threshold: 0.1 });
  const [contentRef, contentVis] = useInView({ threshold: 0.15 });
  const [specsRef, specsVis] = useInView({ threshold: 0.15 });
  const [phasesRef, phasesVis] = useInView({ threshold: 0.15 });

  if (!industry) {
    return (
      <div className="industry-not-found container-default page-enter">
        <h1 className="not-found-title">Industria no encontrada</h1>
        <p className="not-found-desc">El segmento de negocio solicitado no está registrado.</p>
        <Link to="/" className="not-found-link">← Volver al Inicio</Link>
      </div>
    );
  }

  return (
    <div className="business-detail-page page-enter">
      {/* ═══ 1: HERO SECTION ═══ */}
      <section className="ind-hero-section" ref={heroRef}>
        <div className="ind-hero-bg">
          <img src={industry.heroImage} alt={industry.title} className="ind-hero-img" />
          <div className="ind-hero-overlay" />
          <div className="ind-hero-grid" />
        </div>
        
        <div className="ind-hero-container container-default">
          <div className={`ind-hero-content ${heroVis ? 'in-view' : ''}`}>
            <span className="ind-hero-eyebrow">[SOLUCIÓN PARA NEGOCIOS]</span>
            <h1 className="ind-hero-title">
              {industry.title}
            </h1>
            <p className="ind-hero-desc">
              {industry.subtitle}
            </p>
            <div className="ind-tech-frame">
              <span className="ind-cross top-left">+</span>
              <span className="ind-cross top-right">+</span>
              <span className="ind-cross bottom-left">+</span>
              <span className="ind-cross bottom-right">+</span>
              <span className="ind-code">CAB-SPEC-2026 // SEO_PROD</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2: TECHNICAL METRICS GRID (NEW) ═══ */}
      <section className="ind-metrics-section" ref={metricsRef}>
        <div className="container-default">
          <div className={`ind-metrics-grid ${metricsVis ? 'in-view' : ''}`}>
            {industry.metrics.map((metric, i) => (
              <div key={i} className="ind-metric-card">
                <span className="ind-metric-val">{metric.val}</span>
                <span className="ind-metric-lbl">{metric.lbl}</span>
                <span className="ind-metric-sub">{metric.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3: CONTENT SECTION ═══ */}
      <section className="ind-content-section" ref={contentRef}>
        <div className="container-default">
          <div className={`ind-content-grid ${contentVis ? 'in-view' : ''}`}>
            
            {/* Left Block: Intro text & capacity */}
            <div className="ind-content-left">
              <span className="ind-section-tag">[CAPACIDAD INDUSTRIAL]</span>
              <h2 className="ind-section-title">Ingeniería y Manufactura Directa</h2>
              <p className="ind-section-text">
                {industry.intro}
              </p>
              <p className="ind-section-subtext">
                En Studio CAB controlamos el 100% de la cadena de suministro y producción. Contamos con maquinaria CNC, personal de ebanistería calificado e instaladores propios en CDMX para evitar cualquier retraso o fricción con subcontratistas.
              </p>
            </div>

            {/* Right Block: Niche specifics list */}
            <div className="ind-content-right">
              <h3 className="ind-list-title">Soluciones Específicas para {industry.title}</h3>
              <div className="ind-benefits-list">
                {industry.benefits.map((benefit, i) => (
                  <div key={i} className="ind-benefit-card">
                    <span className="ind-benefit-num">0{i+1} //</span>
                    <div className="ind-benefit-info">
                      <h4>{benefit.title}</h4>
                      <p>{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ 4: ARCHITECTURAL SPECS (NEW) ═══ */}
      <section className="ind-specs-section" ref={specsRef}>
        <div className="container-default">
          <div className={`ind-specs-header ${specsVis ? 'in-view' : ''}`}>
            <span className="ind-specs-eyebrow">[FICHA DE MATERIALES]</span>
            <h2 className="ind-specs-title">Materialidad &amp; Especificación Técnica</h2>
            <p className="ind-specs-desc">
              Seleccionamos y tratamos los materiales según las demandas físicas del espacio comercial. Cada componente responde a un análisis de tráfico, desgaste e higiene.
            </p>
          </div>
          
          <div className={`ind-materials-grid ${specsVis ? 'in-view' : ''}`}>
            {industry.materials.map((mat, i) => (
              <div key={i} className="ind-material-row">
                <div className="ind-mat-header">
                  <span className="ind-mat-num">M-0{i+1}</span>
                  <h3 className="ind-mat-name">{mat.name}</h3>
                </div>
                <div className="ind-mat-body">
                  <div className="ind-mat-col">
                    <span className="ind-mat-lbl">PROPIEDAD</span>
                    <p className="ind-mat-val-txt">{mat.spec}</p>
                  </div>
                  <div className="ind-mat-col">
                    <span className="ind-mat-lbl">APLICACIÓN</span>
                    <p className="ind-mat-val-txt">{mat.use}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5: EXECUTION PHASES (NEW) ═══ */}
      <section className="ind-phases-section" ref={phasesRef}>
        <div className="container-default">
          <div className={`ind-phases-header ${phasesVis ? 'in-view' : ''}`}>
            <span className="ind-phases-eyebrow">[PLAN DE OBRA]</span>
            <h2 className="ind-phases-title">Fases Operativas de Entrega</h2>
          </div>
          
          <div className={`ind-phases-timeline ${phasesVis ? 'in-view' : ''}`}>
            {industry.phases.map((phase, i) => (
              <div key={i} className="ind-phase-node">
                <div className="ind-phase-line-decor" />
                <div className="ind-phase-badge">{phase.step}</div>
                <h4 className="ind-phase-node-title">{phase.title}</h4>
                <p className="ind-phase-node-desc">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6: CTA BOX ═══ */}
      <div className="ind-cta-box-wrapper">
        <div className="container-default">
          <div className="ind-cta-box">
            <Link 
              to="/contacto" 
              state={{ selectedType: industry.plannerType }}
              className="ind-cta-btn"
            >
              {industry.ctaText}
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 1L13.5 6L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 6H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
