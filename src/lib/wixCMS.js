const WIX_CLIENT_ID = '8f4920b3-137c-4fd6-a0a5-dc4957f08701';

// Rich fallback mock database representing the Wix CMS schema
export const mockServicios = [
  { _id: 'comercial', title: 'Diseño Comercial', description: 'Transformamos locales comerciales en experiencias de marca que generan resultados medibles.' },
  { _id: 'residencial', title: 'Interiorismo Residencial', description: 'Diseñamos espacios habitacionales sofisticados con materiales nobles y acabados impecables.' },
  { _id: 'carpinteria', title: 'Carpintería sobre Diseño', description: 'Fabricamos con maquinaria CNC y mano artesanal, cocinas, closets y mobiliario premium.' },
  { _id: 'produccion', title: 'Producción e Instalación', description: 'Gestionamos la fabricación, montaje e instalación de cada proyecto con altos estándares.' }
];

export const mockSubservicios = [
  {
    _id: 'sub-lockers',
    title: 'Lockers y Vestidores de Alto Rendimiento',
    description: 'Fabricados en paneles hidrófugos resistentes a la humedad, ideales para áreas wellness y equipados con herrajes y cerraduras de seguridad.',
    servicioMayor: 'comercial',
    subcategoria: 'gimnasios',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre el subservicio de Lockers y Vestidores de Alto Rendimiento para Gimnasios.'
  },
  {
    _id: 'sub-barras-recepcion',
    title: 'Barras de Recepción Escultóricas',
    description: 'Puntos de contacto inicial monolíticos en maderas macizas combinadas con piedras sinterizadas, mármol travertino e iluminación LED.',
    servicioMayor: 'comercial',
    subcategoria: 'gimnasios',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre el subservicio de Barras de Recepción Escultóricas.'
  },
  {
    _id: 'sub-juntas-oficinas',
    title: 'Mesas de Juntas y Escritorios Ejecutivos',
    description: 'Mesas de gran escala con acabados de chapa de madera natural, canalizaciones de red invisibles e integraciones de voz/datos.',
    servicioMayor: 'comercial',
    subcategoria: 'oficinas',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre Mesas de Juntas y Escritorios para Oficinas.'
  },
  {
    _id: 'sub-booths-restaurantes',
    title: 'Booths y Banquetas Corridas Ergonómicas',
    description: 'Estructuras de madera sólida con tapicería retardante al fuego y confort ergonómico superior para comensales en restaurantes.',
    servicioMayor: 'comercial',
    subcategoria: 'restaurantes',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre Booths y Asientos para mi Restaurante.'
  },
  {
    _id: 'sub-cocinas-premium',
    title: 'Cocinas y Vestidores Residenciales',
    description: 'Diseño inteligente de cocinas premium con herrajes europeos invisibles, cajones amortiguados e iluminación integrada.',
    servicioMayor: 'residencial',
    subcategoria: 'hogar',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre Cocinas y Vestidores Residenciales.'
  },
  {
    _id: 'sub-lambrines',
    title: 'Lambrines y Revestimientos Acústicos',
    description: 'Paneles de madera sólida de encino y nogal para revestimiento de muros y plafones con propiedades termoacústicas.',
    servicioMayor: 'carpinteria',
    subcategoria: 'oficinas',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre Lambrines y Revestimientos Acústicos.'
  },
  {
    _id: 'sub-hospitalidad-camas',
    title: 'FF&E y Cabeceros de Cama para Hoteles',
    description: 'Estandarización y fabricación masiva de mobiliario para habitaciones de hotel bajo normativas internacionales y barnices ignífugos.',
    servicioMayor: 'carpinteria',
    subcategoria: 'hoteles',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre mobiliario de Hospitalidad FF&E.'
  },
  {
    _id: 'sub-montaje-estructural',
    title: 'Instalación Monumental y Herrería Fina',
    description: 'Montaje especializado en obra de elementos de madera de gran formato, techos de vigas expuestas y detalles metálicos integrados.',
    servicioMayor: 'produccion',
    subcategoria: 'hoteles',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre la Instalación de Mobiliario y Herrería Fina.'
  }
];

let cachedToken = null;
let tokenExpiresAt = null;

async function getWixAccessToken() {
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const response = await fetch('https://www.wixapis.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: WIX_CLIENT_ID,
        grantType: 'anonymous'
      })
    });

    if (!response.ok) {
      throw new Error(`OAuth failed: ${response.statusText}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    const expiresInMs = (data.expires_in || 14400) * 1000;
    tokenExpiresAt = Date.now() + expiresInMs - (5 * 60 * 1000);
    return cachedToken;
  } catch (error) {
    console.error('Error fetching Wix Access Token:', error);
    throw error;
  }
}

export async function fetchWixCollection(collectionId) {
  try {
    const token = await getWixAccessToken();
    let allItems = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dataCollectionId: collectionId,
          query: {
            paging: { limit, offset }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`);
      }

      const res = await response.json();
      const rawItems = res.dataItems || res.items || [];
      allItems = allItems.concat(rawItems.map(item => item.data || item));

      const pagingMetadata = res.pagingMetadata;
      if (pagingMetadata) {
        hasMore = pagingMetadata.hasNext === true;
      } else {
        hasMore = rawItems.length === limit;
      }

      if (hasMore) {
        offset += limit;
      }
    }

    return allItems;
  } catch (error) {
    console.warn(`[Wix CMS] Failed to query ${collectionId}. Falling back to local database.`, error);
    // Graceful fallback to mock DB
    if (collectionId === 'Servicios') return mockServicios;
    if (collectionId === 'Subservicios') return mockSubservicios;
    return [];
  }
}
