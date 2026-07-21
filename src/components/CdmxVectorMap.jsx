import './CdmxVectorMap.css';

export default function CdmxVectorMap() {
  return (
    <svg 
      viewBox="0 0 800 600" 
      className="cdmx-vector-svg" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mapa Vectorial de Proyectos CDMX Studio CAB"
    >
      <defs>
        {/* Fine Architectural Grid Pattern */}
        <pattern id="cdmxGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
          <circle cx="40" cy="40" r="1" fill="rgba(239, 191, 4, 0.2)" />
        </pattern>

        {/* Glow Effects */}
        <linearGradient id="reformaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#efbf04" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#efbf04" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#efbf04" stopOpacity="0.1" />
        </linearGradient>

        <filter id="svgGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. Base Map Background & Grid */}
      <rect width="800" height="600" fill="#0d0e11" rx="16" />
      <rect width="800" height="600" fill="url(#cdmxGrid)" rx="16" />

      {/* 2. Topography / Parks */}
      {/* Bosque de Chapultepec */}
      <path 
        d="M 280 230 C 330 215, 370 240, 355 285 C 330 305, 275 295, 260 265 Z" 
        fill="#131e17" 
        stroke="rgba(46, 117, 74, 0.4)" 
        strokeWidth="1.5" 
      />
      <text x="290" y="262" fill="#386e4b" fontSize="8.5" fontWeight="700" letterSpacing="1.8">
        BOSQUE DE CHAPULTEPEC
      </text>

      {/* Parque México & España (Condesa) */}
      <circle cx="345" cy="318" r="12" fill="#131e17" stroke="rgba(46, 117, 74, 0.3)" strokeWidth="1" />

      {/* 3. Major CDMX Avenues (Arterias Principales) */}
      {/* Anillo Periférico */}
      <path 
        d="M 110 90 C 180 190, 150 370, 270 560" 
        fill="none" 
        stroke="rgba(255, 255, 255, 0.08)" 
        strokeWidth="3.5" 
        strokeDasharray="6 4" 
      />
      <text x="130" y="150" fill="rgba(255, 255, 255, 0.25)" fontSize="8" fontFamily="monospace" transform="rotate(58 130 150)">
        ANILLO PERIFÉRICO
      </text>

      {/* Circuito Interior Ring */}
      <path 
        d="M 240 100 C 430 100, 500 240, 450 460 C 340 490, 250 390, 240 100 Z" 
        fill="none" 
        stroke="rgba(255, 255, 255, 0.12)" 
        strokeWidth="2" 
      />

      {/* Av. Paseo de la Reforma (Gold Glow) */}
      <path 
        d="M 230 300 L 370 235 L 460 180 L 530 145" 
        fill="none" 
        stroke="url(#reformaGlow)" 
        strokeWidth="3" 
        filter="url(#svgGlow)" 
      />
      <text x="380" y="218" fill="#efbf04" fontSize="8.5" fontWeight="800" letterSpacing="1.5" transform="rotate(-22 380 218)">
        AV. PASEO DE LA REFORMA
      </text>

      {/* Av. Insurgentes Sur / Norte */}
      <path 
        d="M 440 70 L 415 240 L 395 380 L 365 560" 
        fill="none" 
        stroke="rgba(255, 255, 255, 0.22)" 
        strokeWidth="2.5" 
      />
      <text x="425" y="110" fill="rgba(255, 255, 255, 0.4)" fontSize="8" fontWeight="700" letterSpacing="1.5" transform="rotate(82 425 110)">
        AV. INSURGENTES
      </text>

      {/* Viaducto Miguel Alemán */}
      <path 
        d="M 160 345 L 600 345" 
        fill="none" 
        stroke="rgba(255, 255, 255, 0.15)" 
        strokeWidth="2" 
      />
      <text x="490" y="338" fill="rgba(255, 255, 255, 0.3)" fontSize="8" fontFamily="monospace">
        VIADUCTO MIGUEL ALEMÁN
      </text>

      {/* Eje Central Lázaro Cárdenas */}
      <path 
        d="M 480 80 L 455 530" 
        fill="none" 
        stroke="rgba(255, 255, 255, 0.08)" 
        strokeWidth="1.5" 
      />

      {/* Av. Constituyentes (Santa Fe Connector) */}
      <path 
        d="M 280 295 L 110 350" 
        fill="none" 
        stroke="rgba(255, 255, 255, 0.12)" 
        strokeWidth="2" 
      />

      {/* 4. Real CDMX Zones & Neighborhood Labels */}
      {/* POLANCO */}
      <g transform="translate(290, 160)">
        <rect x="0" y="0" width="85" height="36" fill="rgba(239, 191, 4, 0.05)" stroke="rgba(239, 191, 4, 0.4)" strokeDasharray="3 3" rx="4" />
        <text x="12" y="22" fill="#efbf04" fontSize="11" fontWeight="900" letterSpacing="2">
          POLANCO
        </text>
      </g>

      {/* ROMA NORTE */}
      <g transform="translate(395, 252)">
        <text x="0" y="0" fill="#ffffff" fontSize="10" fontWeight="800" letterSpacing="2" opacity="0.9">
          ROMA NORTE
        </text>
      </g>

      {/* CONDESA */}
      <g transform="translate(315, 305)">
        <text x="0" y="0" fill="#ffffff" fontSize="10" fontWeight="800" letterSpacing="2" opacity="0.9">
          CONDESA
        </text>
      </g>

      {/* JUÁREZ / CUAUHTÉMOC */}
      <g transform="translate(425, 198)">
        <text x="0" y="0" fill="rgba(255, 255, 255, 0.75)" fontSize="9" fontWeight="700" letterSpacing="1.5">
          JUÁREZ
        </text>
      </g>

      {/* SANTA FE */}
      <g transform="translate(85, 305)">
        <rect x="0" y="0" width="85" height="32" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.25)" strokeDasharray="2 2" rx="4" />
        <text x="10" y="20" fill="rgba(255, 255, 255, 0.85)" fontSize="10" fontWeight="800" letterSpacing="2">
          SANTA FE
        </text>
      </g>

      {/* DEL VALLE */}
      <g transform="translate(370, 395)">
        <text x="0" y="0" fill="rgba(255, 255, 255, 0.6)" fontSize="9" fontWeight="700" letterSpacing="1.5">
          DEL VALLE
        </text>
      </g>

      {/* COYOACÁN */}
      <g transform="translate(385, 485)">
        <text x="0" y="0" fill="#efbf04" fontSize="10" fontWeight="800" letterSpacing="2" opacity="0.85">
          COYOACÁN
        </text>
      </g>

      {/* SAN ÁNGEL */}
      <g transform="translate(260, 475)">
        <text x="0" y="0" fill="rgba(255, 255, 255, 0.6)" fontSize="9" fontWeight="700" letterSpacing="1.5">
          SAN ÁNGEL
        </text>
      </g>

      {/* 5. Architectural HUD Elements */}
      <g transform="translate(25, 555)">
        <text x="0" y="0" fill="#efbf04" fontSize="9" fontFamily="monospace" fontWeight="700" letterSpacing="1.5">
          [MASTERPLAN CDMX // URBAN VECTOR SCALE 1:40,000]
        </text>
        <text x="0" y="16" fill="rgba(255, 255, 255, 0.35)" fontSize="8" fontFamily="monospace">
          ZONAS DE INTERVENCIÓN // STUDIO CAB ARCHITECTURE & WOODWORK
        </text>
      </g>
    </svg>
  );
}
