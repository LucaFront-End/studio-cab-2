import { useEffect, useRef, useState } from 'react';
import './WhyUs.css';

const differentiators = [
  {
    id: 1,
    num: '01',
    title: 'Diseño Estratégico',
    subtitle: 'Ergonomía, flujo y comportamiento de compra.',
    description:
      'Cada barra, mostrador y pasillo se planifica con planos de flujo precisos. Optimizamos los recorridos del cliente y la comodidad operativa del personal, transformando el diseño en una herramienta que reduce tiempos de espera y eleva el ticket promedio.'
  },
  {
    id: 2,
    num: '02',
    title: 'Fabricación Propia',
    subtitle: 'Taller de carpintería y herrería de alta costura.',
    description:
      'Contamos con taller especializado en CDMX. Cortamos, ensamblamos y detallamos cada mueble con maquinaria CNC y mano de obra artesanal. Al no subcontratar, garantizamos un control absoluto sobre la veta de la madera, las uniones y los plazos de entrega.'
  },
  {
    id: 3,
    num: '03',
    title: 'Soluciones Integrales',
    subtitle: 'Coordinación sin fisuras del plano a la llave en mano.',
    description:
      'Asumimos la responsabilidad total: diseño técnico, fabricación de mobiliario, obra civil e instalación en sitio. Evitamos las fricciones clásicas donde el diseñador culpa al constructor. Con nosotros, un solo equipo responde por todo el proyecto.'
  },
  {
    id: 4,
    num: '04',
    title: 'Optimización de Espacios',
    subtitle: 'Máxima funcionalidad en locales comerciales compactos.',
    description:
      'Somos expertos en hacer que locales pequeños operen con la capacidad y presencia de una gran marca. Creamos mobiliario multifuncional empotrado y sistemas de almacenamiento ocultos que aprovechan hasta el último centímetro cuadrado disponible.'
  }
];

const WhyUs = () => {
  const sectionRef = useRef(null);
  const floorRef = useRef(null);
  const structureRef = useRef(null);
  const woodRef = useRef(null);
  const detailsRef = useRef(null);

  const [activeDiff, setActiveDiff] = useState(1);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      // Enable smooth scroll animations on all screens

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Scroll progress (0 to 1)
      const scrolled = Math.max(0, -sectionTop);
      const totalScrollable = sectionHeight - windowHeight;
      const progress = Math.min(1, scrolled / totalScrollable);

      // --- SVG ANIMATION LOGIC (Exploded View Assembly) ---

      // Phase 1 (0 to 0.25): Structure (metal skeleton) falls from top
      const progressP1 = Math.max(0, Math.min(1, progress / 0.25));
      const structY = (1 - progressP1) * -180;
      const structOpacity = progressP1;

      if (structureRef.current) {
        structureRef.current.style.transform = `translateY(${structY}px)`;
        structureRef.current.style.opacity = structOpacity.toString();
      }

      // Phase 2 (0.25 to 0.50): Wood cladding panels slide in from front-left
      const progressP2 = Math.max(0, Math.min(1, (progress - 0.25) / 0.25));
      const woodX = (1 - progressP2) * -140;
      const woodY = (1 - progressP2) * 70;
      const woodOpacity = progressP2;

      if (woodRef.current) {
        woodRef.current.style.transform = `translate(${woodX}px, ${woodY}px)`;
        woodRef.current.style.opacity = woodOpacity.toString();
      }

      // Phase 3 (0.50 to 0.75): Details (Marble top, glass riser, pendant) fall down
      const progressP3 = Math.max(0, Math.min(1, (progress - 0.50) / 0.25));
      const detailsY = (1 - progressP3) * -120;
      const detailsOpacity = progressP3;

      if (detailsRef.current) {
        detailsRef.current.style.transform = `translateY(${detailsY}px)`;
        detailsRef.current.style.opacity = detailsOpacity.toString();
      }

      // --- TEXT HIGHLIGHTING LOGIC ---
      if (progress < 0.25) {
        setActiveDiff(1);
      } else if (progress >= 0.25 && progress < 0.50) {
        setActiveDiff(2);
      } else if (progress >= 0.50 && progress < 0.75) {
        setActiveDiff(3);
      } else {
        setActiveDiff(4);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="whyus-section" ref={sectionRef} id="por-que-cab">
      <div className="whyus-sticky-container">
        
        {/* Left Column: Differentiators */}
        <div className="whyus-left-column">
          <span className="whyus-eyebrow">Diferenciales</span>
          <h2 className="whyus-heading">
            No solo diseñamos espacios.<br />
            <em>Los hacemos funcionar</em><span className="whyus-dot">.</span>
          </h2>

          {/* Absolute Stack Container */}
          <div className="whyus-cards-container">
            {differentiators.map((diff) => (
              <div 
                key={diff.id}
                className={`whyus-card-pane ${activeDiff === diff.id ? 'active' : ''}`}
              >
                <div className="whyus-card-header">
                  <span className="whyus-card-num">{diff.num}</span>
                  <h3 className="whyus-card-title">{diff.title}</h3>
                </div>
                <div className="whyus-card-body">
                  <p className="whyus-card-subtitle">{diff.subtitle}</p>
                  <p className="whyus-card-desc">{diff.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Uniform High-End Isometric Model */}
        <div className="whyus-right-column">
          <div className="whyus-blueprint-canvas">
            
            {/* Technical grid dots */}
            <div className="canvas-grid-dots"></div>
            
            <svg 
              viewBox="0 0 600 520" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="exploded-svg"
            >
              <defs>
                <linearGradient id="led-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF8719" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#FF8719" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Layer 1: Floor guidelines and Grid Axis */}
              <g ref={floorRef} className="svg-layer svg-floor">
                {/* Isometric Grid Floor Box */}
                <polygon points="40,320 300,450 560,320 300,190" stroke="rgba(13, 15, 18, 0.08)" strokeWidth="1.5" strokeDasharray="4,4" />
                <line x1="160" y1="250" x2="440" y2="390" stroke="rgba(13, 15, 18, 0.04)" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="160" y1="390" x2="440" y2="250" stroke="rgba(13, 15, 18, 0.04)" strokeWidth="1" strokeDasharray="2,2" />
                {/* Central vertical axis reference */}
                <line x1="300" y1="190" x2="300" y2="450" stroke="rgba(13, 15, 18, 0.05)" strokeWidth="1" strokeDasharray="3,3" />
              </g>

              {/* Layer 2: Metal Skeleton / Structure */}
              <g ref={structureRef} className="svg-layer svg-structure">
                {/* Back Shelving Structure - Detailed Uprights */}
                <path d="M 360 230 L 360 70 M 430 265 L 430 105 M 500 230 L 500 70" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                <path d="M 360 120 L 500 50 M 360 170 L 500 100 M 360 220 L 500 150" stroke="#64748B" strokeWidth="2" />
                {/* Cross-bracing details */}
                <line x1="360" y1="70" x2="430" y2="105" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="430" y1="105" x2="500" y2="70" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2,2" />

                {/* Reception Counter Internal Frame (Fits neatly inside wood cladding, doesn't protrude) */}
                <path d="M 120 330 L 120 250 M 216 376 L 216 300 M 316 330 L 316 250" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 120 295 L 216 343 M 216 343 L 316 295" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3,3" />
                <path d="M 120 250 L 216 292 M 216 292 L 316 250 M 120 250 L 216 205 M 216 205 L 316 250" stroke="#475569" strokeWidth="2" />
              </g>

              {/* Layer 3: Wood Cladding Panels (Crafted in workshop - COHESIVE SLATTED STYLE) */}
              <g ref={woodRef} className="svg-layer svg-wood">
                {/* BACK WALL PANELING (Lambrín backing the shelves for design uniformity) */}
                <polygon points="360,230 500,160 500,60 360,130" fill="#9C6644" stroke="var(--colors--theme-black)" strokeWidth="1" opacity="0.9" />
                {/* Slat lines on the back shelving wall (High density 10px spacing for design uniformity) */}
                <line x1="370" y1="125" x2="370" y2="225" stroke="rgba(13, 15, 18, 0.25)" strokeWidth="1" />
                <line x1="380" y1="120" x2="380" y2="220" stroke="rgba(13, 15, 18, 0.25)" strokeWidth="1" />
                <line x1="390" y1="115" x2="390" y2="215" stroke="rgba(13, 15, 18, 0.25)" strokeWidth="1" />
                <line x1="400" y1="110" x2="400" y2="210" stroke="rgba(13, 15, 18, 0.25)" strokeWidth="1" />
                <line x1="410" y1="105" x2="410" y2="205" stroke="rgba(13, 15, 18, 0.25)" strokeWidth="1" />
                <line x1="420" y1="100" x2="420" y2="200" stroke="rgba(13, 15, 18, 0.25)" strokeWidth="1" />
                <line x1="430" y1="95" x2="430" y2="195" stroke="rgba(13, 15, 18, 0.25)" strokeWidth="1" />
                <line x1="440" y1="90" x2="440" y2="190" stroke="rgba(13, 15, 18, 0.25)" strokeWidth="1" />
                <line x1="450" y1="85" x2="450" y2="185" stroke="rgba(13, 15, 18, 0.25)" strokeWidth="1" />
                <line x1="460" y1="80" x2="460" y2="180" stroke="rgba(13, 15, 18, 0.25)" strokeWidth="1" />
                <line x1="470" y1="75" x2="470" y2="175" stroke="rgba(13, 15, 18, 0.25)" strokeWidth="1" />
                <line x1="480" y1="70" x2="480" y2="170" stroke="rgba(13, 15, 18, 0.25)" strokeWidth="1" />
                <line x1="490" y1="65" x2="490" y2="165" stroke="rgba(13, 15, 18, 0.25)" strokeWidth="1" />

                {/* Back Shelving Thick Wooden Boards */}
                <polygon points="358,120 502,48 502,56 358,128" fill="#D6A374" stroke="var(--colors--theme-black)" strokeWidth="1.5" />
                <polygon points="358,170 502,98 502,106 358,178" fill="#D6A374" stroke="var(--colors--theme-black)" strokeWidth="1.5" />
                <polygon points="358,220 502,148 502,156 358,228" fill="#D6A374" stroke="var(--colors--theme-black)" strokeWidth="1.5" />

                {/* Counter Wooden Body (Left face) */}
                <polygon points="118,252 214,300 214,380 118,332" fill="#5C3A21" stroke="var(--colors--theme-black)" strokeWidth="1" />
                
                {/* 10 Detailed Wood Slats (Lambrín Fino) on Left Face */}
                <polygon points="120,253 126,256 126,336 120,333" fill="#D6A374" stroke="var(--colors--theme-black)" strokeWidth="0.8" />
                <polygon points="130,258 136,261 136,341 130,338" fill="#D6A374" stroke="var(--colors--theme-black)" strokeWidth="0.8" />
                <polygon points="140,263 146,266 146,346 140,343" fill="#D6A374" stroke="var(--colors--theme-black)" strokeWidth="0.8" />
                <polygon points="150,268 156,271 156,351 150,348" fill="#D6A374" stroke="var(--colors--theme-black)" strokeWidth="0.8" />
                <polygon points="160,273 166,276 166,356 160,353" fill="#D6A374" stroke="var(--colors--theme-black)" strokeWidth="0.8" />
                <polygon points="170,278 176,281 176,361 170,358" fill="#D6A374" stroke="var(--colors--theme-black)" strokeWidth="0.8" />
                <polygon points="180,283 186,286 186,366 180,363" fill="#D6A374" stroke="var(--colors--theme-black)" strokeWidth="0.8" />
                <polygon points="190,288 196,291 196,371 190,368" fill="#D6A374" stroke="var(--colors--theme-black)" strokeWidth="0.8" />
                <polygon points="200,293 206,296 206,376 200,373" fill="#D6A374" stroke="var(--colors--theme-black)" strokeWidth="0.8" />
                <polygon points="210,298 212,299 212,379 210,378" fill="#D6A374" stroke="var(--colors--theme-black)" strokeWidth="0.8" />

                {/* Right Face: Premium Calacatta Marble Waterfall Side Panel */}
                <polygon points="218,295 318,250 318,332 218,382" fill="#FFFFFF" stroke="var(--colors--theme-black)" strokeWidth="1.5" />
                {/* Thick front edge of the marble waterfall side panel */}
                <polygon points="214,297 218,295 218,382 214,380" fill="#F1F1F1" stroke="var(--colors--theme-black)" strokeWidth="1" />
                {/* Marble veins on the side panel */}
                <path d="M 230 300 Q 250 340 280 320 M 270 280 Q 290 310 310 290" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />

                {/* Recessed Plinth Base (Kickplate) under the wooden body */}
                <polygon points="123,332 214,378 214,386 123,340" fill="#2E3540" stroke="var(--colors--theme-black)" strokeWidth="1" />

                {/* Minimalist objects on the back shelves */}
                {/* Books Stack */}
                <polygon points="380,95 415,77 415,83 380,101" fill="#FF8719" stroke="var(--colors--theme-black)" strokeWidth="1" />
                <polygon points="380,101 415,83 415,89 380,107" fill="#EADCC9" stroke="var(--colors--theme-black)" strokeWidth="1" />
                {/* Small Plant Pot */}
                <polygon points="450,120 470,110 470,122 450,132" fill="#7F5539" stroke="var(--colors--theme-black)" strokeWidth="1" />
                <path d="M 456,108 Q 446,95 452,90 M 464,106 Q 474,94 468,87" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Layer 4: Details (Marble Riser, Tablet POS, Lights) */}
              <g ref={detailsRef} className="svg-layer svg-details">
                {/* LED Under-counter light strip glow */}
                <polygon points="116,255 214,302 214,312 116,265" fill="url(#led-glow)" opacity="0.65" />

                {/* Countertop Calacatta Marble Slab */}
                <polygon points="116,250 216,205 316,250 216,295" fill="#FFFFFF" stroke="var(--colors--theme-black)" strokeWidth="2" />
                <polygon points="116,250 216,295 216,301 116,256" fill="#F1F1F1" stroke="var(--colors--theme-black)" strokeWidth="1.5" />
                <polygon points="216,295 316,250 316,256 216,301" fill="#E5E5E5" stroke="var(--colors--theme-black)" strokeWidth="1.5" />
                
                {/* Marble veins details */}
                <path d="M 140 250 Q 180 245 220 255 M 180 225 Q 220 235 270 230" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
                
                {/* Fluted glass divider screen */}
                <polygon points="135,240 216,204 216,154 135,190" fill="rgba(255,135,25,0.08)" stroke="var(--colors--theme-orange)" strokeWidth="1.5" />
                <polygon points="216,204 290,237 290,187 216,154" fill="rgba(255,135,25,0.08)" stroke="var(--colors--theme-orange)" strokeWidth="1.5" />
                {/* Fluted stripes */}
                <line x1="155" y1="218" x2="155" y2="188" stroke="var(--colors--theme-orange)" strokeWidth="0.8" opacity="0.6" />
                <line x1="175" y1="227" x2="175" y2="197" stroke="var(--colors--theme-orange)" strokeWidth="0.8" opacity="0.6" />
                <line x1="195" y1="236" x2="195" y2="206" stroke="var(--colors--theme-orange)" strokeWidth="0.8" opacity="0.6" />
                <line x1="236" y1="222" x2="236" y2="192" stroke="var(--colors--theme-orange)" strokeWidth="0.8" opacity="0.6" />
                <line x1="256" y1="231" x2="256" y2="201" stroke="var(--colors--theme-orange)" strokeWidth="0.8" opacity="0.6" />
                <line x1="276" y1="240" x2="276" y2="210" stroke="var(--colors--theme-orange)" strokeWidth="0.8" opacity="0.6" />

                {/* Metal mounting clamps/brackets for glass partition */}
                <polygon points="158,228 162,226 162,232 158,234" fill="#334155" stroke="var(--colors--theme-black)" strokeWidth="0.8" />
                <polygon points="188,215 192,213 192,219 188,221" fill="#334155" stroke="var(--colors--theme-black)" strokeWidth="0.8" />
                <polygon points="238,219 242,217 242,223 238,225" fill="#334155" stroke="var(--colors--theme-black)" strokeWidth="0.8" />
                <polygon points="268,232 272,230 272,236 268,238" fill="#334155" stroke="var(--colors--theme-black)" strokeWidth="0.8" />

                {/* Sleek Tablet POS on Counter */}
                <polygon points="180,270 205,258 205,264 180,276" fill="#475569" stroke="var(--colors--theme-black)" strokeWidth="1.2" />
                <line x1="192" y1="264" x2="192" y2="246" stroke="var(--colors--theme-black)" strokeWidth="2" />
                <polygon points="185,246 198,240 205,246 192,252" fill="#1E293B" stroke="var(--colors--theme-black)" strokeWidth="1" />
                {/* Sleek support cable grommet hole */}
                <ellipse cx="192" cy="265" rx="3" ry="1.5" fill="#0D0F12" />

                {/* Dual Globe Pendant Light Fixture */}
                <line x1="216" y1="20" x2="216" y2="110" stroke="var(--colors--theme-black)" strokeWidth="1" />
                <circle cx="216" cy="118" r="9" fill="rgba(255,135,25,0.25)" stroke="var(--colors--theme-orange)" strokeWidth="1.5" />
                <circle cx="216" cy="118" r="3" fill="var(--colors--theme-orange)" />

                <line x1="438" y1="15" x2="438" y2="45" stroke="var(--colors--theme-black)" strokeWidth="1" />
                <circle cx="438" cy="51" r="7" fill="rgba(255,135,25,0.25)" stroke="var(--colors--theme-orange)" strokeWidth="1.5" />
                <circle cx="438" cy="51" r="2.5" fill="var(--colors--theme-orange)" />
              </g>

              {/* Dynamic Annotation Lines & CAD Dimensions */}
              {/* Annotation 1: Diseño Estratégico (Heights, grid reference) */}
              <g className={`svg-annotations ann-1 ${activeDiff === 1 ? 'active' : ''}`}>
                <line x1="120" y1="340" x2="60" y2="340" stroke="var(--colors--theme-orange)" strokeWidth="1.2" strokeDasharray="3,3" />
                <line x1="120" y1="250" x2="60" y2="250" stroke="var(--colors--theme-orange)" strokeWidth="1.2" strokeDasharray="3,3" />
                {/* Dimension Arrow */}
                <line x1="70" y1="340" x2="70" y2="250" stroke="var(--colors--theme-orange)" strokeWidth="1.2" />
                <polygon points="70,340 73,334 67,334" fill="var(--colors--theme-orange)" />
                <polygon points="70,250 73,256 67,256" fill="var(--colors--theme-orange)" />
                <text x="35" y="300" fill="var(--colors--theme-orange)" fontSize="11" fontWeight="700" fontFamily="Urbanist">H: 90 cm</text>
                <text x="85" y="355" fill="var(--colors--theme-gray)" fontSize="9" fontWeight="600" fontFamily="Urbanist">EJE ERGONÓMICO DE ATENCIÓN</text>
              </g>

              {/* Annotation 2: Fabricación Propia (Wood joins, grain specs) */}
              <g className={`svg-annotations ann-2 ${activeDiff === 2 ? 'active' : ''}`}>
                <path d="M 216 340 L 270 370 L 330 370" stroke="var(--colors--theme-orange)" strokeWidth="1.2" fill="none" />
                <circle cx="216" cy="340" r="3" fill="var(--colors--theme-orange)" />
                <text x="335" y="374" fill="var(--colors--theme-orange)" fontSize="10" fontWeight="700" fontFamily="Urbanist">LIGADURA A 45° EN ESQUINA</text>
                
                <path d="M 438 100 L 470 100 L 490 115" stroke="var(--colors--theme-orange)" strokeWidth="1.2" fill="none" />
                <circle cx="438" cy="100" r="3" fill="var(--colors--theme-orange)" />
                <text x="495" y="119" fill="var(--colors--theme-orange)" fontSize="10" fontWeight="700" fontFamily="Urbanist">LAMBRÍN CON CHAPADO OAK 10mm</text>
              </g>

              {/* Annotation 3: Soluciones Integrales (Pendants, services line) */}
              <g className={`svg-annotations ann-3 ${activeDiff === 3 ? 'active' : ''}`}>
                <path d="M 216 118 L 160 118 L 120 100" stroke="var(--colors--theme-orange)" strokeWidth="1.2" fill="none" />
                <circle cx="216" cy="118" r="3" fill="var(--colors--theme-orange)" />
                <text x="20" y="96" fill="var(--colors--theme-orange)" fontSize="10" fontWeight="700" fontFamily="Urbanist">LUMINARIA EXPUESTA COLGANTE</text>

                <path d="M 250 230 L 290 190 L 360 190" stroke="var(--colors--theme-orange)" strokeWidth="1.2" fill="none" />
                <circle cx="250" cy="230" r="3" fill="var(--colors--theme-orange)" />
                <text x="365" y="194" fill="var(--colors--theme-orange)" fontSize="10" fontWeight="700" fontFamily="Urbanist">CUBIERTA DE MÁRMOL EN CASCADA</text>
              </g>

              {/* Annotation 4: Optimización de Espacio (Footprint dimensions) */}
              <g className={`svg-annotations ann-4 ${activeDiff === 4 ? 'active' : ''}`}>
                <path d="M 120 395 L 320 295" stroke="var(--colors--theme-black)" strokeWidth="1.2" />
                <polygon points="120,395 127,392 124,398" fill="var(--colors--theme-black)" />
                <polygon points="320,295 313,292 316,298" fill="var(--colors--theme-black)" />
                <text x="190" y="355" fill="var(--colors--theme-black)" fontSize="11" fontWeight="700" fontFamily="Urbanist" transform="rotate(-26.5 190 355)">ANCHO DESK: 2.00 m</text>

                <text x="240" y="435" fill="var(--colors--theme-orange)" fontSize="11" fontWeight="800" fontFamily="Urbanist">ESCALA 1:20 | DETALLE DE RECEPCIÓN</text>
              </g>
            </svg>

          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyUs;
