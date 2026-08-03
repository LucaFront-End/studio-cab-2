import { useParams, Link } from 'react-router-dom';
import { useInView, useStaggerInView } from '../hooks/useInView';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useWixCMSData } from '../hooks/useWixCMS';
import { useDocumentSEO } from '../hooks/useDocumentSEO';
import { resolveWixImage } from '../lib/wixCMS';
import './ServiceDetailPage.css';

const allServices = {
  comercial: {
    title: 'Diseño Comercial', subtitle: 'Espacios que venden, experiencias que conectan.',
    tag: 'Retail · Oficinas · Restaurantes', heroImage: '/diseno_comercial.png',
    description: 'En Studio CAB diseñamos espacios comerciales que trascienden la estética para convertirse en herramientas estratégicas de negocio.',
    longText: 'Nuestro equipo combina arquitectura de interiores, diseño gráfico ambiental y ergonomía comercial para crear entornos que maximizan la experiencia del cliente y, en consecuencia, los ingresos.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80', caption: 'Basilio Roma — Barra principal' },
      { src: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80', caption: 'Café Juárez — Zona de degustación' },
      { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', caption: 'Restaurante Condesa — Salón principal' },
      { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', caption: 'Boutique Polanco — Exhibición' },
    ],
    materials: [
      { name: 'Mármol Travertino', desc: 'Aporta sofisticación e inercia térmica en barras de alto tránsito.', src: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=300&q=80' },
      { name: 'Acero Cepillado', desc: 'Tratado con lacas protectoras para un look industrial e imperecedero.', src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80' },
      { name: 'Vidrio Estriado', desc: 'Filtra la luz natural dividiendo espacios sin bloquear visuales.', src: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=300&q=80' },
    ],
    process: [
      { num: '01', title: 'Diagnóstico', desc: 'Análisis del giro, competencia, flujo de clientes y requerimientos técnicos del espacio.', icon: '⊙' },
      { num: '02', title: 'Concepto Creativo', desc: 'Desarrollo del concepto visual alineado a la identidad de marca y objetivos comerciales.', icon: '◎' },
      { num: '03', title: 'Diseño Ejecutivo', desc: 'Planos constructivos, renders 3D fotorrealistas, paleta de materiales y especificaciones técnicas.', icon: '◈' },
      { num: '04', title: 'Producción', desc: 'Fabricación de mobiliario, coordinación de obra, instalación y entrega llave en mano.', icon: '◇' },
    ],
    stats: [
      { value: '40+', label: 'Proyectos comerciales' },
      { value: '98%', label: 'Clientes satisfechos' },
      { value: '180', label: 'Días promedio' },
    ],
    testimonial: {
      quote: '"Triplicamos nuestros ingresos tras la remodelación. El diseño no solo se ve increíble, funciona."',
      author: 'Carlos Mendoza', role: 'Dueño — Basilio Roma',
    },
    benefits: [
      { icon: '◎', title: 'Diseño centrado en ventas', text: 'Layouts que optimizan recorridos y elevan conversiones.' },
      { icon: '◈', title: 'Identidad de marca espacial', text: 'Tu marca vive en cada pared, mostrador y textura.' },
      { icon: '◇', title: 'Materialidad premium', text: 'Piedra, madera y metal de primer nivel con acabados de lujo.' },
      { icon: '△', title: 'Plazos garantizados', text: 'Entrega en tiempo contractual o ajustamos presupuesto.' },
    ],
  },
  residencial: {
    title: 'Interiorismo Residencial', subtitle: 'Tu hogar, tu identidad personal.',
    tag: 'Casas · Departamentos · Penthouses', heroImage: '/interiorismo_residencial.png',
    description: 'Diseñamos espacios habitacionales sofisticados donde cada rincón refleja la personalidad del habitante.',
    longText: 'Desde departamentos de diseño en la Condesa hasta residencias de lujo en Bosques de las Lomas, cada detalle — desde la veta de la madera hasta la temperatura de la iluminación — está cuidadosamente curado.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', caption: 'Casa Condesa — Sala principal' },
      { src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', caption: 'Loft Santa Fe — Cocina' },
      { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', caption: 'Residencia Coyoacán — Fachada' },
      { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', caption: 'Penthouse Reforma — Terraza' },
    ],
    materials: [
      { name: 'Nogal Americano', desc: 'Madera noble de veta profunda para aportar calidez en salas.', src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80' },
      { name: 'Piedra Volcánica', desc: 'Textura rugosa y oscura para muros de acento que dialogan con el exterior.', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80' },
      { name: 'Latón Cepillado', desc: 'Detalles dorados en luminarias y herrajes para destellos elegantes.', src: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=300&q=80' },
    ],
    process: [
      { num: '01', title: 'Consulta Inicial', desc: 'Entendemos tu estilo de vida, necesidades funcionales y aspiraciones estéticas.', icon: '⊙' },
      { num: '02', title: 'Propuesta Creativa', desc: 'Moodboards, paleta de materiales, renders 3D y presupuesto detallado.', icon: '◎' },
      { num: '03', title: 'Desarrollo Técnico', desc: 'Planos ejecutivos, especificaciones de carpintería e iluminación.', icon: '◈' },
      { num: '04', title: 'Ejecución', desc: 'Supervisión de obra, fabricación e instalación hasta el último detalle.', icon: '◇' },
    ],
    stats: [
      { value: '60+', label: 'Hogares transformados' },
      { value: '100%', label: 'Diseño a medida' },
      { value: '5', label: 'Años de garantía' },
    ],
    testimonial: {
      quote: '"Superó todas nuestras expectativas. Cada mañana despertamos en un espacio que realmente nos representa."',
      author: 'Ana y Roberto Vega', role: 'Clientes — Casa Condesa',
    },
    benefits: [
      { icon: '◎', title: 'Diseño personalizado', text: 'Cada proyecto es único, adaptado a tu estilo de vida.' },
      { icon: '◈', title: 'Materiales nobles', text: 'Mármol, nogal, roble y piedra natural de primera calidad.' },
      { icon: '◇', title: 'Iluminación escénica', text: 'Diseño lumínico integrado para cada ambiente y hora del día.' },
      { icon: '△', title: 'Carpintería a medida', text: 'Mobiliario fabricado en nuestro taller, milimétrico.' },
    ],
  },
  carpinteria: {
    title: 'Carpintería sobre Diseño', subtitle: 'Mobiliario hecho a medida, pieza por pieza.',
    tag: 'Muebles · Cocinas · Closets', heroImage: '/carpinteria_diseno.png',
    description: 'Fabricamos cocinas, closets, barras y elementos arquitectónicos de madera con acabados premium y diseño milimétrico.',
    longText: 'Con maquinaria CNC de última generación y mano de obra artesanal, cada pieza lleva la precisión digital y el alma del trabajo manual.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80', caption: 'Cocina integral — Nogal americano' },
      { src: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80', caption: 'Vestidor — Sistema modular' },
      { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', caption: 'Cocina Narvarte — Gabinetes superiores' },
      { src: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80', caption: 'Estantería industrial — Acero + nogal' },
    ],
    materials: [
      { name: 'Encinos Selectos', desc: 'Maderas duras ideales para cubiertas y puertas macizas de alta resistencia.', src: 'https://images.unsplash.com/photo-1595526051245-4506e0005bd0?w=300&q=80' },
      { name: 'Lacas Poliuretano', desc: 'Capas satinadas impermeables y resistentes al rayado.', src: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&q=80' },
      { name: 'Herrajes Blum', desc: 'Sistemas de cierre suave alemanes ocultos de precisión.', src: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=300&q=80' },
    ],
    process: [
      { num: '01', title: 'Levantamiento', desc: 'Medición milimétrica del espacio con herramientas láser de precisión.', icon: '⊙' },
      { num: '02', title: 'Diseño 3D', desc: 'Modelado paramétrico con selección de materiales, herrajes y acabados.', icon: '◎' },
      { num: '03', title: 'Fabricación', desc: 'Corte CNC, ensamble manual, acabado de laca y control de calidad.', icon: '◈' },
      { num: '04', title: 'Instalación', desc: 'Montaje profesional con ajuste perfecto y limpieza del espacio.', icon: '◇' },
    ],
    stats: [
      { value: '500+', label: 'Piezas fabricadas' },
      { value: 'CNC', label: 'Precisión digital' },
      { value: '5', label: 'Años de garantía' },
    ],
    testimonial: {
      quote: '"La cocina quedó perfecta al milímetro. La calidad es de otro nivel, mejor que cualquier marca importada."',
      author: 'Mariana Torres', role: 'Cliente — Cocina Narvarte',
    },
    benefits: [
      { icon: '◎', title: 'Taller propio', text: 'Control total de fabricación sin intermediarios.' },
      { icon: '◈', title: 'CNC + artesanía', text: 'Precisión digital combinada con acabado manual.' },
      { icon: '◇', title: 'Materiales certificados', text: 'Maderas FSC, herrajes Blum, lacas Sherwin-Williams.' },
      { icon: '△', title: 'Garantía extendida', text: '5 años de garantía en estructura y mecanismos.' },
    ],
  },
  produccion: {
    title: 'Producción e Instalación', subtitle: 'Del plano a la realidad, sin excusas.',
    tag: 'Obra · Acabados · Supervisión', heroImage: '/produccion_instalacion.png',
    description: 'Gestionamos la fabricación, montaje e instalación de cada proyecto en CDMX y área metropolitana con altos estándares de calidad y atención al detalle.',
    longText: 'Nuestro equipo coordina cada aspecto: instalaciones, acabados y entrega llave en mano. Un solo equipo de principio a fin.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', caption: 'Obra en proceso — Estructura' },
      { src: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80', caption: 'Instalación de acabados' },
      { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80', caption: 'Supervisión en sitio' },
      { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', caption: 'Resultado final — Oficinas Reforma' },
    ],
    materials: [
      { name: 'Concreto Texturizado', desc: 'Acabado contemporáneo texturizado a mano con selladores ópticos.', src: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&q=80' },
      { name: 'Acero Estructural', desc: 'Acero al carbón para soportar dobles alturas y volados.', src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80' },
      { name: 'Piedra Caliza', desc: 'Revestimiento térmico ideal para exteriores y fachadas ventiladas.', src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&q=80' },
    ],
    process: [
      { num: '01', title: 'Planeación', desc: 'Cronograma detallado, presupuesto cerrado y plan de contingencias.', icon: '⊙' },
      { num: '02', title: 'Obra Civil', desc: 'Demolición, estructura, instalaciones eléctricas e hidráulicas.', icon: '◎' },
      { num: '03', title: 'Acabados', desc: 'Pisos, muros, plafones, pintura y carpintería fina.', icon: '◈' },
      { num: '04', title: 'Entrega', desc: 'Limpieza profunda, checklist de calidad y entrega llave en mano.', icon: '◇' },
    ],
    stats: [
      { value: '12K', label: 'm² construidos' },
      { value: '0', label: 'Retrasos en 2024' },
      { value: '100%', label: 'Presupuesto respetado' },
    ],
    testimonial: {
      quote: '"Entregaron exactamente en fecha y presupuesto. Su nivel de supervisión es impecable."',
      author: 'Grupo Restaurantero MX', role: 'Cliente corporativo',
    },
    benefits: [
      { icon: '◎', title: 'Llave en mano', text: 'Un solo punto de contacto para todo el proyecto.' },
      { icon: '◈', title: 'Supervisión en sitio', text: 'Presencia diaria de nuestro equipo en la obra.' },
      { icon: '◇', title: 'Control de costos', text: 'Presupuesto cerrado con desglose transparente.' },
      { icon: '△', title: 'Acabados premium', text: 'Cada detalle ejecutado con estándar de alta costura.' },
    ],
  },
  tapiceria: {
    title: 'Tapicería de Muebles', subtitle: 'Restauración, acojinado y confección textil de alta gama.',
    tag: 'Tapicería · Rellenos · Estructura · Costuras', heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=80',
    description: 'Renovamos y transformamos mobiliario comercial y residencial con técnicas artesanales de tapicería, revisión estructural y acabados de lujo.',
    longText: 'Servicio especializado en evaluación técnica, restauración y rediseño de piezas. Abordamos cada mueble de forma integral: desde la estructura interna de madera hasta el rediseño de costuras y acojinados de alta resistencia.',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', caption: 'Sillón de autor — Tapicería textil bouclé' },
      { src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', caption: 'Restauración de banqueta — Piel de alta densidad' },
      { src: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80', caption: 'Booths gastronómicos — Tapicería náutica de alto tráfico' },
      { src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', caption: 'Silla ejecutiva — Capitoné artesanal y costuras' },
    ],
    materials: [
      { name: 'Pieles & Cueros Náuticos', desc: 'Resistentes al desgaste comercial, abrasión y humedad.', src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80' },
      { name: 'Espumas HR & Plumón', desc: 'Acojinados ergonómicos de alta densidad y resiliencia prolongada.', src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80' },
      { name: 'Textiles Antimanchas & Terciopelos', desc: 'Tejidos con protección contra líquidos y manchas para alto tráfico.', src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&q=80' },
    ],
    process: [
      { num: '01', title: 'Tapicería Fine & Retail', desc: 'Confección a medida, retapizado completo y selección de textiles o cueros importados.', icon: '⊙' },
      { num: '02', title: 'Revisión de Relleno', desc: 'Diagnóstico y sustitución de espumas de alta densidad, aglomerados y mezclas de plumón.', icon: '◎' },
      { num: '03', title: 'Resortes y Bandas', desc: 'Reparación, cambio y tensionado de bandas elásticas, resortes en zig-zag y espirales.', icon: '◈' },
      { num: '04', title: 'Madera y Estructura', desc: 'Refuerzo de armazones, resanado de maderas macizas, ajuste de ensamble y nivelación.', icon: '◇' },
      { num: '05', title: 'Rediseños de Costuras', desc: 'Confección de vivos, pespuntes de autor, patrones en capitoné y detalles estéticos a medida.', icon: '△' },
    ],
    stats: [
      { value: '350+', label: 'Piezas restauradas' },
      { value: '100%', label: 'Materiales probados' },
      { value: '3', label: 'Años de garantía' },
    ],
    testimonial: {
      quote: '"Restauraron nuestras banquetas y sillerías comerciales dejándolas mejores que nuevas. La atención en el armado estructural y las costuras es fantástica."',
      author: 'Rodrigo Alarcón', role: 'Director Operativo — Grupo Gastronómico MX',
    },
    benefits: [
      { 
        icon: '🛡️', 
        title: 'Garantía Total de Satisfacción', 
        text: 'Garantizamos cada pieza con respaldo absoluto. Si algún ensamble, acabado o textura no supera tus expectativas, lo ajustamos de inmediato sin costo.' 
      },
      { 
        icon: '🧵', 
        title: 'Textiles & Pieles Selección', 
        text: 'Catálogo exclusivo con más de 200 opciones importadas: lino natural, terciopelo antimanchas, piel náutica y tejidos de autor para cada espacio.' 
      },
      { 
        icon: '📐', 
        title: 'Maestría Artesanal & Precisión', 
        text: 'Más de 15 años de trayectoria. Nuestros maestros unifican técnicas tradicionales de capitoné y costuras de alta costura con precisión digital.' 
      },
      { 
        icon: '🚚', 
        title: 'Logística Integral Gratuita', 
        text: 'Nos encargamos del retiro, embalaje especializado y entrega final de tus piezas sin cargo adicional en toda la CDMX y área metropolitana.' 
      },
      { 
        icon: '⚡', 
        title: 'Valoración Express WhatsApp', 
        text: 'Envía imágenes o medidas por WhatsApp y nuestro departamento técnico te enviará un presupuesto detallado en cuestión de minutos.' 
      },
      { 
        icon: '✨', 
        title: 'Transformaciones Reales', 
        text: 'Explora nuestros proyectos concluidos y comprueba la exactitud de acabados, volumen y firmeza antes de iniciar tu propuesta.' 
      },
    ],
  },
};

const SERVICE_SEO = {
  comercial: {
    title: 'Diseño Comercial en CDMX | Grupo CAB Studio',
    description: 'Grupo CAB Studio desarrolla proyectos de diseño comercial en CDMX para restaurantes, hoteles, oficinas, retail y franquicias con mobiliario sobre diseño y carpintería fina.'
  },
  residencial: {
    title: 'Interiorismo Residencial en CDMX | Grupo CAB Studio',
    description: 'Creamos proyectos de interiorismo residencial en CDMX con carpintería fina, tapicería y muebles sobre diseño para casas, departamentos y remodelaciones premium.'
  },
  carpinteria: {
    title: 'Carpintería sobre Diseño en CDMX | Grupo CAB Studio',
    description: 'Especialistas en carpintería sobre diseño en CDMX. Fabricamos muebles personalizados para negocios y residencias con maderas premium, acabados finos y producción propia.'
  },
  produccion: {
    title: 'Producción e Instalación de Mobiliario en CDMX | Grupo CAB Studio',
    description: 'Grupo CAB Studio fabrica e instala mobiliario sobre diseño en CDMX para proyectos comerciales y residenciales con supervisión especializada y acabados premium.'
  },
  tapiceria: {
    title: 'Tapicería de Muebles en CDMX | Grupo CAB Studio',
    description: 'Servicio profesional de tapicería de muebles en CDMX. Revisión de relleno, resortes, bandas, madera y estructura, y rediseños de costuras.'
  }
};

const tapTypes = [
  {
    icon: '⦿',
    title: 'Tapicería de Salas',
    desc: 'Sofás, love seats y sillones residenciales con espumas de alta densidad y textiles antimanchas de última tecnología.',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'
  },
  {
    icon: '◎',
    title: 'Tapicería de Muebles para Restaurantes',
    desc: 'Booths a medida, banquetas corridas y sillería gastronómica reforzada con vinilos o cueros náuticos retardantes al fuego.',
    img: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&q=80'
  },
  {
    icon: '⟡',
    title: 'Tapicería de Sillones para Cafetería',
    desc: 'Butacas compactas, sillones lounge y bancos tapizados que optimizan la rotación y brindan máximo confort.',
    img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80'
  },
  {
    icon: '◇',
    title: 'Tapicería de Cabeceras para Hoteles',
    desc: 'Cabeceros monumentales capitoné o lisos con anclaje a muro, telas ignífugas y espuma acústica integrada.',
    img: '/cabeceras_hoteles.webp'
  }
];

function formatSlugToTitle(slug) {
  if (!slug) return 'Tapicería de Muebles';
  const words = slug.split('-');
  const capitalized = words.map((w, i) => {
    const lower = w.toLowerCase();
    if (i > 0 && ['de', 'en', 'la', 'del', 'los', 'las', 'y', 'a', 'para', 'el'].includes(lower)) {
      return lower;
    }
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });
  return capitalized.join(' ');
}

export default function ServiceDetailPage() {
  const { id, slug } = useParams();
  const { subservicios, proyectos, landingTapicerias } = useWixCMSData();

  const [activeShowcase, setActiveShowcase] = useState(0);

  // Buscar landing de tapicería si hay slug o id de landing
  const targetSlug = slug || (id !== 'tapiceria' && id !== 'carpinteria' && id !== 'comercial' && id !== 'residencial' && id !== 'produccion' ? id : null);

  const tapiceriaLandingItem = targetSlug 
    ? (landingTapicerias || []).find(l => {
        const d = l.data || l;
        return d.slug === targetSlug || l._id === targetSlug;
      })
    : null;

  const landingData = tapiceriaLandingItem ? (tapiceriaLandingItem.data || tapiceriaLandingItem) : null;

  // Determinar la clave de servicio base (si es una landing de tapicería, usamos 'tapiceria')
  const baseKey = (landingData || targetSlug) ? 'tapiceria' : (id || 'tapiceria');
  const baseService = allServices[baseKey] || allServices['tapiceria'];

  // Crear valores dinámicos si proviene de LandingTapicerias o del slug
  const displayTitle = landingData?.tituloPgina || landingData?.title || (targetSlug ? formatSlugToTitle(targetSlug) : baseService.title);
  const displaySubtitle = landingData?.excerptPgina || landingData?.fraseCorta || baseService.subtitle;
  const displaySeoTitle = landingData?.tituloSeo || (landingData?.title ? `${landingData.title} | Studio CAB` : null);
  const displaySeoDesc = landingData?.metadescripcinSeo || landingData?.excerptPgina || null;
  const displayWhatsapp = landingData?.whatsapp || `https://wa.me/525516406963?text=${encodeURIComponent(`SW- Hola Studio CAB. Me interesa agendar una consulta para *${displayTitle}*.`)}`;

  useEffect(() => {
    setTimeout(() => {
      setActiveShowcase(0);
    }, 0);
  }, [baseKey, targetSlug]);

  // Construir la Galería de Proyectos usando prioritariamente el ítem "Galería General" del CMS de Wix
  const cmsGallery = useMemo(() => {
    const list = [];

    // 1. Buscar prioritariamente el ítem "Galería General" en la colección de Proyectos de Wix CMS
    const galeriaGeneralItem = (proyectos || []).find(p => {
      const d = p.data || p;
      const t = (d.title || d.nombre || '').toLowerCase().trim();
      return t.includes('galería general') || t.includes('galeria general');
    });

    if (galeriaGeneralItem) {
      const gData = galeriaGeneralItem.data || galeriaGeneralItem;
      const rawGallery = gData.mediagallery || [];
      rawGallery.forEach(item => {
        if (item.type !== 'video' && (item.src || item.slug)) {
          const imgUrl = resolveWixImage(item.src || item.slug, 1200);
          if (imgUrl && !list.some(x => x.src === imgUrl)) {
            list.push({
              src: imgUrl,
              caption: 'Galería General Studio CAB — Proyecto Real'
            });
          }
        }
      });
    }

    // 2. Si no se han cargado imágenes de Galería General, recopilar las de todos los proyectos de Wix CMS
    if (list.length === 0 && proyectos && proyectos.length > 0) {
      proyectos.forEach(proj => {
        const pData = proj.data || proj;
        const pTitle = pData.title || pData.nombre || 'Proyecto Studio CAB';
        if (pTitle.toLowerCase().includes('galería general') || pTitle.toLowerCase().includes('galeria general')) return;

        // Imagen principal
        if (pData.imagenPrincipal || pData.fotoConRelieves) {
          const imgUrl = resolveWixImage(pData.imagenPrincipal || pData.fotoConRelieves, 1200);
          if (imgUrl && !list.some(item => item.src === imgUrl)) {
            list.push({ src: imgUrl, caption: `${pTitle} — Proyecto Real Studio CAB` });
          }
        }
        
        // Mediagallery del proyecto
        if (Array.isArray(pData.mediagallery)) {
          pData.mediagallery.forEach(item => {
            if (item.type !== 'video' && (item.src || item.slug)) {
              const imgUrl = resolveWixImage(item.src || item.slug, 1200);
              if (imgUrl && !list.some(elem => elem.src === imgUrl)) {
                list.push({
                  src: imgUrl,
                  caption: `${pTitle} — Detalle de Ejecución`
                });
              }
            }
          });
        }
      });
    }

    if (list.length > 0) {
      return list;
    }

    // Fallback con fotografías reales del Taller Studio CAB
    return [
      { src: '/taller/DSC09051.jpg', caption: 'Taller Studio CAB — Maquinado y Precisión CNC' },
      { src: '/taller/DSC09054.jpg', caption: 'Taller Studio CAB — Ensamble de Estructuras y Maderas' },
      { src: '/taller/DSC09056.jpg', caption: 'Taller Studio CAB — Calibración Digital' },
      { src: '/taller/DSC09288.jpg', caption: 'Taller Studio CAB — Mobiliario Terminado y Control de Calidad' },
    ];
  }, [proyectos]);

  const service = {
    ...baseService,
    title: displayTitle,
    subtitle: displaySubtitle
  };

  const seo = {
    title: displaySeoTitle || SERVICE_SEO[baseKey]?.title || `${displayTitle} en CDMX | Grupo CAB Studio`,
    description: displaySeoDesc || SERVICE_SEO[baseKey]?.description || displaySubtitle
  };

  useDocumentSEO(seo.title, seo.description);
  
  const currentSubservices = (subservicios || []).filter(sub => {
    if (sub.servicioMayor === baseKey) return true;
    const cat = sub.categora || sub.categoria || '';
    if (!cat && !sub.subservicio) return false;
    if (baseKey === 'comercial' && cat === 'Diseño Comercial') return true;
    if (baseKey === 'residencial' && cat === 'Interiorismo Residencial') return true;
    if (baseKey === 'produccion' && cat === 'Producción e Instalación') return true;
    if (baseKey === 'carpinteria' && (cat === 'Carpintería y Mobiliario sobre Diseño' || cat === 'Carpintería sobre Diseño')) return true;
    if (baseKey === 'tapiceria' && (cat.toLowerCase().includes('tapicer') || (sub.subservicio && sub.subservicio.toLowerCase().includes('tapicer')))) return true;
    return false;
  });

  // Extraer las subcategorías únicas presentes en los subservicios cargados
  const uniqueSubcategories = Array.from(
    new Set(
      currentSubservices.map(sub => {
        const data = sub.data || sub;
        return data.subcategoria || data.subcategora || data.subcategory || 'General';
      })
    )
  ).sort();

  const [activeSubcat, setActiveSubcat] = useState('Todos');

  // Resetear el filtro al cambiar de sección de servicio
  useEffect(() => {
    setTimeout(() => {
      setActiveSubcat('Todos');
    }, 0);
  }, [id]);

  const filteredSubservices = activeSubcat === 'Todos'
    ? currentSubservices
    : currentSubservices.filter(sub => {
        const data = sub.data || sub;
        const cat = data.subcategoria || data.subcategora || data.subcategory || 'General';
        return cat === activeSubcat;
      });

  const [heroRef, heroVis] = useInView({ threshold: 0.05 });
  const [introRef, introVis] = useInView({ threshold: 0.15 });
  const [subsRef, subsVis] = useInView({ threshold: 0.15 });
  
  const procCount = service?.process?.length || 4;
  const [procRefs, procVis] = useStaggerInView(procCount, { staggerDelay: 200 });
  const [testRef, testVis] = useInView({ threshold: 0.2 });
  const benCount = service?.benefits?.length || 4;
  const [benRefs, benVis] = useStaggerInView(benCount, { staggerDelay: 120 });
  const [ctaRef, ctaVis] = useInView({ threshold: 0.2 });

  // Parallax on hero
  const heroImgRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      if (heroImgRef.current && window.scrollY < 1200) {
        heroImgRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0) scale(1.15)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!service) {
    return (
      <div className="page-enter" style={{ padding: '200px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: 'var(--colors--theme-black)' }}>Servicio no encontrado</h1>
        <Link to="/servicios" style={{ color: 'var(--colors--theme-orange)', fontWeight: 700, marginTop: 20, display: 'inline-block' }}>← Volver a Servicios</Link>
      </div>
    );
  }

  const otherServices = Object.entries(allServices).filter(([key]) => key !== id).slice(0, 3);

  return (
    <div className="service-detail page-enter">

      {/* ═══ 1: IMMERSIVE HERO ═══ */}
      <section className="sdv2-hero" ref={heroRef}>
        <div className="sdv2-hero-media">
          <img 
            ref={heroImgRef} 
            src={service.heroImage} 
            alt={seo.title || service.title} 
            title={seo.title || service.title} 
            className="sdv2-hero-img" 
          />
          <div className="sdv2-hero-overlay" />
          <div className="sdv2-hero-grain" />
        </div>
        <div className={`sdv2-hero-content ${heroVis ? 'in-view' : ''}`}>
          <span className="sdv2-hero-tag">{service.tag}</span>
          <h1 className="sdv2-hero-title">
            {service.title.split(' ').map((word, wi, arr) => (
              <span key={wi} className="sdv2-word">
                {word.split('').map((char, ci) => {
                  const idx = arr.slice(0, wi).join(' ').length + (wi > 0 ? 1 : 0) + ci;
                  return (
                    <span key={ci} className="sdv2-letter" style={{ animationDelay: `${0.4 + idx * 0.035}s` }}>
                      {char}
                    </span>
                  );
                })}
                {wi < arr.length - 1 && <span className="sdv2-letter">&nbsp;</span>}
              </span>
            ))}
          </h1>
          <p className="sdv2-hero-sub">{service.subtitle}</p>
          <div className="sdv2-hero-stats">
            {service.stats.map((s, i) => (
              <div key={i} className="sdv2-hero-stat">
                <span className="sdv2-stat-val">{s.value}</span>
                <span className="sdv2-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sdv2-scroll-indicator">
          <span>Scroll</span>
          <div className="sdv2-scroll-line" />
        </div>
      </section>

      {/* ═══ 2: INTRO SPLIT ═══ */}
      <section className="sdv2-intro" ref={introRef}>
        <div className="container-default">
          <div className={`sdv2-intro-grid ${introVis ? 'in-view' : ''}`}>
            <div className="sdv2-intro-left">
              <span className="section-eyebrow" style={{opacity:1,transform:'none'}}>Sobre el servicio</span>
              <h2 className="sdv2-intro-title">{service.description}</h2>
            </div>
            <div className="sdv2-intro-right">
              <p className="sdv2-intro-text">{service.longText}</p>
              <Link to="/contacto" className="sdv2-intro-cta" data-cursor="Cotizar">
                Cotizar Este Servicio
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2.5: SUBSERVICIOS DINÁMICOS O ESPECIALIDADES DE TAPICERÍA ═══ */}
      {(currentSubservices.length > 0 || id === 'tapiceria') && (
        <section className="sdv2-subservices" ref={subsRef}>
          <div className="container-default">
            <span className={`section-eyebrow ${subsVis ? 'in-view' : ''}`}>[02.1 // ESPECIALIZACIONES]</span>
            <h2 className={`section-heading ${subsVis ? 'in-view' : ''}`}>
              {id === 'tapiceria' ? (
                <>Especialidades de <em>Tapicería</em>.</>
              ) : (
                <>Subservicios de <em>{service.title}</em>.</>
              )}
            </h2>
            
            {/* Si es Tapicería (sin subservicios en Wix), mostramos la franja visual de especialidades en 2 columnas */}
            {id === 'tapiceria' ? (
              <div className={`sdv2-tap-grid ${subsVis ? 'in-view' : ''}`}>
                {tapTypes.map((type, i) => {
                  const waMessage = encodeURIComponent(`SW- Hola Studio CAB, me interesa cotizar el servicio de *${type.title}*.`);
                  const waLink = `https://wa.me/525516406963?text=${waMessage}`;
                  return (
                    <div key={i} className="sdv2-tap-card" style={{ transitionDelay: `${i * 0.08}s` }}>
                      <div className="sdv2-tap-card-img-wrapper">
                        <img 
                          src={type.img} 
                          alt={`${type.title} — ${seo.title || service.title}`} 
                          title={`${type.title} — ${seo.title || service.title}`} 
                          className="sdv2-tap-card-img" 
                        />
                        <div className="sdv2-tap-card-overlay" />
                      </div>
                      <div className="sdv2-tap-card-content">
                        <span className="sdv2-tap-card-code">[ESP // 0{i + 1}]</span>
                        <h3 className="sdv2-tap-card-title">{type.title}</h3>
                        <p className="sdv2-tap-card-desc">{type.desc}</p>
                        <div className="sdv2-tap-card-actions">
                          <a href={waLink} target="_blank" rel="noopener noreferrer" className="sdv2-tap-wa-btn">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: '6px' }}>
                              <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.812.48 3.564 1.392 5.124L2 22l5.004-1.308c1.512.828 3.204 1.272 4.992 1.272C17.52 22 22 17.52 22 12.012c0-2.676-1.044-5.184-2.928-7.08C17.184 3.036 14.688 2 12.012 2zm5.724 14.124c-.252.708-1.464 1.296-2.004 1.344-.492.048-.972.24-3.156-.624-2.772-1.104-4.524-3.924-4.656-4.104-.132-.18-1.092-1.452-1.092-2.772 0-1.32.684-1.968.936-2.232.252-.264.672-.384 1.08-.384.144 0 .276.012.396.012.348.012.516.036.744.576.228.552.792 1.932.864 2.076.072.144.12.312.024.504-.096.192-.144.312-.288.48-.144.168-.312.384-.444.516-.144.144-.3.3-.132.588.168.288.756 1.248 1.62 2.016.924.816 1.704 1.068 1.944 1.188.24.12.384.108.528-.06.144-.168.624-.72.792-.96.168-.24.336-.204.564-.12.228.084 1.452.684 1.704.816.252.132.42.192.48.3.06.108.06.624-.192 1.332z" />
                            </svg>
                            Cotizar {type.title.replace('Tapicería de ', '')}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                {/* Pestañas de Subcategorías */}
                {uniqueSubcategories.length > 0 && (
                  <div className="sdv2-subcat-tabs">
                    <button 
                      className={`sdv2-subcat-tab-btn ${activeSubcat === 'Todos' ? 'active' : ''}`}
                      onClick={() => setActiveSubcat('Todos')}
                    >
                      Todos <span className="tab-count">({currentSubservices.length})</span>
                    </button>
                    {uniqueSubcategories.map((subcat, idx) => {
                      const count = currentSubservices.filter(sub => {
                        const data = sub.data || sub;
                        const cat = data.subcategoria || data.subcategora || data.subcategory || 'General';
                        return cat === subcat;
                      }).length;
                      return (
                        <button
                          key={idx}
                          className={`sdv2-subcat-tab-btn ${activeSubcat === subcat ? 'active' : ''}`}
                          onClick={() => setActiveSubcat(subcat)}
                        >
                          {subcat} <span className="tab-count">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="sdv2-subs-grid">
                  {filteredSubservices.map((sub, idx) => {
                    const data = sub.data || sub;
                    const title = data.title || data.subservicio || '';
                    const description = data.descripcin || data.description || `Especialidad en ${title} con materiales premium y acabados de lujo.`;
                    let waLink = data.enlaceDeWhatsapp || '';
                    if (waLink) {
                      if (waLink.startsWith('https://wa.me/?text=')) {
                        waLink = waLink.replace('https://wa.me/?text=', 'https://wa.me/525516406963?text=SW-%20');
                      } else if (waLink.includes('text=') && !waLink.includes('text=SW-')) {
                        waLink = waLink.replace('text=', 'text=SW-%20');
                      }
                    } else {
                      const waMessage = encodeURIComponent(`SW- ${data.whatsappText || `Hola Studio CAB. Me interesa el subservicio de *${title}*.`}`);
                      waLink = `https://wa.me/525516406963?text=${waMessage}`;
                    }
                    
                    return (
                      <div key={data._id || idx} className="sdv2-sub-card">
                        <span className="sdv2-sub-code">[SUB // 0{idx + 1}]</span>
                        <h3 className="sdv2-sub-title">{title}</h3>
                        <p className="sdv2-sub-desc">{description}</p>
                        
                        <div className="sdv2-sub-actions">
                          <Link to={`/subservicios/${data.slug || ''}`} className="sdv2-sub-link">
                            Saber Más ↗
                          </Link>
                          
                          <a 
                            href={waLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="sdv2-sub-wa-btn"
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                              <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.812.48 3.564 1.392 5.124L2 22l5.004-1.308c1.512.828 3.204 1.272 4.992 1.272C17.52 22 22 17.52 22 12.012c0-2.676-1.044-5.184-2.928-7.08C17.184 3.036 14.688 2 12.012 2zm5.724 14.124c-.252.708-1.464 1.296-2.004 1.344-.492.048-.972.24-3.156-.624-2.772-1.104-4.524-3.924-4.656-4.104-.132-.18-1.092-1.452-1.092-2.772 0-1.32.684-1.968.936-2.232.252-.264.672-.384 1.08-.384.144 0 .276.012.396.012.348.012.516.036.744.576.228.552.792 1.932.864 2.076.072.144.12.312.024.504-.096.192-.144.312-.288.48-.144.168-.312.384-.444.516-.144.144-.3.3-.132.588.168.288.756 1.248 1.62 2.016.924.816 1.704 1.068 1.944 1.188.24.12.384.108.528-.06.144-.168.624-.72.792-.96.168-.24.336-.204.564-.12.228.084 1.452.684 1.704.816.252.132.42.192.48.3.06.108.06.624-.192 1.332z" />
                            </svg>
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ═══ 4: SHOWCASE GALLERY (PROYECTOS Y FOTOS REALES DEL CMS WIX) ═══ */}
      {cmsGallery.length > 0 && (
        <section className="sdv2-showcase">
          <div className="container-default">
            <div style={{ marginBottom: '32px' }}>
              <span className="section-eyebrow">[03.0 // GALERÍA DE PROYECTOS]</span>
              <h2 className="section-heading">
                Galería de <em>Resultados & Detalle</em>.
              </h2>
            </div>
            
            <div className={`sdv2-showcase-inner ${introVis ? 'in-view' : ''}`}>
              <div className="sdv2-showcase-main">
                <img 
                  src={cmsGallery[activeShowcase % cmsGallery.length]?.src} 
                  alt={`${cmsGallery[activeShowcase % cmsGallery.length]?.caption || service.title} — ${seo.title}`} 
                  title={`${cmsGallery[activeShowcase % cmsGallery.length]?.caption || service.title} — ${seo.title}`} 
                />
                <div className="sdv2-showcase-caption">
                  <span className="sdv2-cap-num">
                    {String((activeShowcase % cmsGallery.length) + 1).padStart(2, '0')} / {String(Math.min(cmsGallery.length, 8)).padStart(2, '0')}
                  </span>
                  <span className="sdv2-cap-text">
                    {cmsGallery[activeShowcase % cmsGallery.length]?.caption}
                  </span>
                </div>
              </div>

              {cmsGallery.length > 1 && (
                <div className="sdv2-showcase-thumbs">
                  {cmsGallery.slice(0, 8).map((img, idx) => (
                    <button
                      key={idx}
                      className={`sdv2-thumb ${idx === (activeShowcase % cmsGallery.length) ? 'active' : ''}`}
                      onClick={() => setActiveShowcase(idx)}
                    >
                      <img src={img.src} alt={img.caption} title={img.caption} />
                      <div className="sdv2-thumb-overlay">
                        <span>0{idx + 1}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 5: PROCESS / CAPACIDADES (VELVET TAPICERÍA TIMELINE DOTS) ═══ */}
      <section className="sdv2-process">
        <div className="container-default">
          <div className="sdv2-process-header-wrap">
            <div>
              <span className="section-eyebrow anim-fade-up in-view">
                {id === 'tapiceria' ? 'Capacidades' : 'Metodología'}
              </span>
              <h2 className="section-heading anim-fade-up in-view">
                {id === 'tapiceria' ? (
                  <>Lo que podemos <em>hacer</em>.</>
                ) : (
                  <>Nuestro <em>proceso</em>.</>
                )}
              </h2>
            </div>
            <div className="sdv2-timeline-badge">
              <span>{service.process.length} PASOS DE EJECUCIÓN</span>
            </div>
          </div>

          {/* Timeline Horizontal Track con Puntos Velvet */}
          <div className="sdv2-timeline-track" style={{ '--process-cols': service.process.length }}>
            {service.process.map((step, i) => (
              <div key={i} ref={el => procRefs.current[i] = el} className={`sdv2-timeline-step ${procVis[i] ? 'in-view' : ''}`}>
                
                {/* Header del Paso con Punto Velvet y Línea Conectora */}
                <div className="sdv2-timeline-step-header">
                  <div className="sdv2-velvet-dot">
                    <div className="sdv2-velvet-dot-inner" />
                  </div>
                  <span className="sdv2-timeline-step-num">0{i + 1}</span>
                  {i < service.process.length - 1 && (
                    <div className="sdv2-timeline-step-arrow">
                      <span className="sdv2-arrow-line" />
                    </div>
                  )}
                </div>

                {/* Tarjeta de Contenido */}
                <div className="sdv2-timeline-card">
                  <div className="sdv2-timeline-icon">{step.icon || '⦿'}</div>
                  <h3 className="sdv2-timeline-title">{step.title}</h3>
                  <p className="sdv2-timeline-desc">{step.desc}</p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6: TESTIMONIAL ═══ */}
      <section className="sdv2-testimonial" ref={testRef}>
        <div className={`container-default sdv2-test-inner ${testVis ? 'in-view' : ''}`}>
          <div className="sdv2-test-quote-mark">"</div>
          <blockquote className="sdv2-test-quote">{service.testimonial.quote}</blockquote>
          <div className="sdv2-test-author">
            <div className="sdv2-test-line" />
            <div>
              <span className="sdv2-test-name">{service.testimonial.author}</span>
              <span className="sdv2-test-role">{service.testimonial.role}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7: BENEFITS / POR QUÉ ELEGIRNOS (STUDIO CAB STYLE) ═══ */}
      <section className="sdv2-benefits">
        <div className="container-default">
          <div className="sdv2-benefits-header">
            <span className="sdv2-benefits-eyebrow">DIFERENCIALES // STUDIO CAB</span>
            <h2 className="sdv2-benefits-heading">Compromiso con la <em>excelencia</em>.</h2>
            <p className="sdv2-benefits-subheading">
              Garantizamos precisión técnica, materiales certificados y atención directa sin intermediarios.
            </p>
          </div>
          <div className="sdv2-benefits-grid">
            {service.benefits.map((b, i) => (
              <div key={i} ref={el => benRefs.current[i] = el} className={`sdv2-benefit ${benVis[i] ? 'in-view' : ''}`}>
                {/* Corner AutoCAD Ticks */}
                <div className="sdv2-ben-corner top-left">+</div>
                <div className="sdv2-ben-corner top-right">+</div>
                <div className="sdv2-ben-corner bottom-left">+</div>
                <div className="sdv2-ben-corner bottom-right">+</div>

                <div className="sdv2-ben-header">
                  <div className="sdv2-ben-icon-box">{b.icon}</div>
                  <span className="sdv2-ben-badge">[CAB-VAL // 0{i + 1}]</span>
                </div>
                <h3 className="sdv2-ben-title">{b.title}</h3>
                <p className="sdv2-ben-text">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8: CTA + OTHER SERVICES ═══ */}
      <section className="sdv2-cta" ref={ctaRef}>
        <div className={`container-default sdv2-cta-inner ${ctaVis ? 'in-view' : ''}`}>
          <div className="sdv2-cta-card">
            <h2 className="sdv2-cta-title">¿Listo para transformar tu espacio?</h2>
            <p className="sdv2-cta-text">Agendá una consulta gratuita y recibí tu propuesta en menos de 7 días.</p>
            <a
              href={displayWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="sdv2-cta-btn"
            >
              AGENDAR CONSULTA
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </a>
          </div>
          <div className="sdv2-other">
            <h3 className="sdv2-other-title">También ofrecemos</h3>
            {otherServices.map(([key, s]) => (
              <Link to={`/servicios/${key}`} key={key} className="sdv2-other-link">
                <span>{s.title}</span>
                <svg width="16" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
