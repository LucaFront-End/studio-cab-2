const WIX_CLIENT_ID = '8f4920b3-137c-4fd6-a0a5-dc4957f08701';

// Rich fallback mock database representing the Wix CMS schema
export const mockServicios = [
  { _id: 'comercial', title: 'Diseño Comercial', description: 'Transformamos locales comerciales en experiencias de marca que generan resultados medibles.' },
  { _id: 'residencial', title: 'Interiorismo Residencial', description: 'Diseñamos espacios habitacionales sofisticados con materiales nobles y acabados impecables.' },
  { _id: 'produccion', title: 'Producción e Instalación', description: 'Gestionamos la fabricación, montaje e instalación de cada proyecto con altos estándares.' }
];

export const mockSubservicios = [
  {
    _id: 'sub-lockers',
    title: 'Lockers y Vestidores de Alto Rendimiento',
    description: 'Fabricados en paneles hidrófugos resistentes a la humedad, ideales para áreas wellness y equipados con herrajes y cerraduras de seguridad.',
    servicioMayor: 'comercial',
    subcategoria: 'gimnasios',
    slug: 'lockers-vestidores-alto-rendimiento',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre el subservicio de Lockers y Vestidores de Alto Rendimiento para Gimnasios.'
  },
  {
    _id: 'sub-barras-recepcion',
    title: 'Barras de Recepción Escultóricas',
    description: 'Puntos de contacto inicial monolíticos en maderas macizas combinadas con piedras sinterizadas, mármol travertino e iluminación LED.',
    servicioMayor: 'comercial',
    subcategoria: 'gimnasios',
    slug: 'barras-recepcion-escultoricas',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre el subservicio de Barras de Recepción Escultóricas.'
  },
  {
    _id: 'sub-juntas-oficinas',
    title: 'Mesas de Juntas y Escritorios Ejecutivos',
    description: 'Mesas de gran escala con acabados de chapa de madera natural, canalizaciones de red invisibles e integraciones de voz/datos.',
    servicioMayor: 'comercial',
    subcategoria: 'oficinas',
    slug: 'mesas-juntas-escritorios-ejecutivos',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre Mesas de Juntas y Escritorios para Oficinas.'
  },
  {
    _id: 'sub-booths-restaurantes',
    title: 'Booths y Banquetas Corridas Ergonómicas',
    description: 'Estructuras de madera sólida con tapicería retardante al fuego y confort ergonómico superior para comensales en restaurantes.',
    servicioMayor: 'comercial',
    subcategoria: 'restaurantes',
    slug: 'booths-banquetas-corridas-ergonomicas',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre Booths y Asientos para mi Restaurante.'
  },
  {
    _id: 'sub-cocinas-premium',
    title: 'Cocinas y Vestidores Residenciales',
    description: 'Diseño inteligente de cocinas premium con herrajes europeos invisibles, cajones amortiguados e iluminación integrada.',
    servicioMayor: 'residencial',
    subcategoria: 'hogar',
    slug: 'cocinas-vestidores-residenciales',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre Cocinas y Vestidores Residenciales.'
  },
  {
    _id: 'sub-lambrines',
    title: 'Lambrines y Revestimientos Acústicos',
    description: 'Paneles de madera sólida de encino y nogal para revestimiento de muros y plafones con propiedades termoacústicas.',
    servicioMayor: 'carpinteria',
    subcategoria: 'oficinas',
    slug: 'lambrines-revestimientos-acusticos',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre Lambrines y Revestimientos Acústicos.'
  },
  {
    _id: 'sub-hospitalidad-camas',
    title: 'FF&E y Cabeceros de Cama para Hoteles',
    description: 'Estandarización y fabricación masiva de mobiliario para habitaciones de hotel bajo normativas internacionales y barnices ignífugos.',
    servicioMayor: 'carpinteria',
    subcategoria: 'hoteles',
    slug: 'ffe-cabeceros-cama-hoteles',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre mobiliario de Hospitalidad FF&E.'
  },
  {
    _id: 'sub-montaje-estructural',
    title: 'Instalación Monumental y Herrería Fina',
    description: 'Montaje especializado en obra de elementos de madera de gran formato, techos de vigas expuestas y detalles metálicos integrados.',
    servicioMayor: 'produccion',
    subcategoria: 'hoteles',
    slug: 'instalacion-monumental-herreria-fina',
    whatsappText: 'Hola Studio CAB. Me interesa información sobre la Instalación de Mobiliario y Herrería Fina.'
  }
];

export const mockProyectos = [
  {
    _id: 'basilio',
    title: 'Basilio Roma',
    servicioPrincipal: '0833db22-4b3b-45bf-9056-94834fbe0e11', // comercial
    zonaDelProyecto: 'Roma Norte, CDMX',
    imagenPrincipal: 'wix:image://v1/45119e_.../IMG.jpg#originWidth=600&originHeight=800',
    apareceEnProyecto: 'Sí',
    elReto: 'Optimizar un espacio reducido en un restaurante de alto flujo.',
    laSolucin: 'Distribución en L con barras integradas.',
    elImpacto: 'Aumento del 30% en capacidad.',
    duracin: '3 meses',
    ao: '2023',
    mediagallery: []
  }
];

export const mockProducts = [
  {
    id: 'mesa-nogal',
    slug: 'mesa-rustica-nogal',
    name: 'Mesa Rústica Nogal',
    price: { formatted: { price: '$28,500.00' } },
    collectionIds: ['d5e57831-3481-3adf-d857-2ba34ed1fabc'],
    media: {
      mainMedia: { image: { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80' } },
      items: [
        { image: { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80' } },
        { image: { url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80' } }
      ]
    },
    description: 'Mesa de comedor tallada en una sola pieza de nogal negro americano.',
    additionalInfoSections: [
      { title: 'Material', description: 'Nogal macizo' },
      { title: 'Dimensiones', description: '200 × 90 × 75 cm' },
      { title: 'Acabado', description: 'Aceite natural' }
    ],
    weight: 45
  },
  {
    id: 'silla-roble',
    slug: 'silla-escultura-roble',
    name: 'Silla Escultura Roble',
    price: { formatted: { price: '$12,800.00' } },
    collectionIds: ['9412b68c-f9a3-0f76-303c-62dc441f8ab7'],
    media: {
      mainMedia: { image: { url: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80' } },
      items: [
        { image: { url: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80' } },
        { image: { url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80' } }
      ]
    },
    description: 'Silla de diseño esculpida en roble europeo con curvatura ergonómica.',
    additionalInfoSections: [
      { title: 'Material', description: 'Roble europeo' },
      { title: 'Dimensiones', description: '55 × 50 × 82 cm' },
      { title: 'Acabado', description: 'Laca satinada' }
    ],
    weight: 8
  }
];

export async function fetchWixStoreProducts() {
  try {
    const token = await getWixAccessToken();
    const response = await fetch('https://www.wixapis.com/stores/v1/products/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: {}
      })
    });

    if (!response.ok) {
      throw new Error(`Store products query failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.warn('[Wix Stores] Failed to query products. Falling back to local database.', error);
    return mockProducts;
  }
}

export const WIX_STORE_BASE_DOMAIN = 'https://dilodigitalmx.wixsite.com/website-23';

export async function createWixCheckoutSession(cartItems) {
  if (!cartItems || cartItems.length === 0) {
    return WIX_STORE_BASE_DOMAIN;
  }

  try {
    const token = await getWixAccessToken();
    const lineItems = cartItems.map(item => ({
      catalogReference: {
        catalogItemId: item.id,
        appId: '1380b703-ce81-ff05-f115-39571d94dfcd',
        options: { options: {} }
      },
      quantity: item.quantity || 1
    }));

    const response = await fetch('https://www.wixapis.com/ecom/v1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        channelType: 'WEB',
        lineItems
      })
    });

    if (!response.ok) {
      throw new Error(`Checkout creation failed with status ${response.status}`);
    }

    const data = await response.json();
    const checkoutId = data.checkout?.id;
    if (!checkoutId) {
      throw new Error('No checkoutId returned from Wix Ecom API');
    }

    const thankYouUrl = encodeURIComponent(window.location.origin + '/tienda');
    return `${WIX_STORE_BASE_DOMAIN}/__ecom/checkout?checkoutId=${checkoutId}&origin=${thankYouUrl}`;
  } catch (error) {
    console.warn('[Wix Stores] Failed to create API checkout session.', error);
    return WIX_STORE_BASE_DOMAIN;
  }
}

export async function fetchWixStoreCollections() {
  try {
    const token = await getWixAccessToken();
    const response = await fetch('https://www.wixapis.com/stores/v1/collections/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: {}
      })
    });

    if (!response.ok) {
      throw new Error(`Store collections query failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.collections || [];
  } catch (error) {
    console.warn('[Wix Stores] Failed to query collections.', error);
    return [];
  }
}

import { sendFormSubmit } from './formSubmit';

let cachedToken = null;
export async function submitWixLead(leadData) {
  // Always trigger FormSubmit to proyectos@studiocab.mx with clean white table template
  const formSubmitPayload = {
    'Nombre Completo': leadData.name || leadData.title || 'Consulta Sin Nombre',
    'Correo Electrónico': leadData.email || 'No proporcionado',
    'Teléfono': leadData.phone || leadData.telefono || 'No proporcionado',
    'Origen / Página': leadData.source || leadData.origen || 'Sitio Web Studio CAB',
    'Mensaje / Consulta': leadData.message || leadData.mensaje || 'Solicitud de cotización'
  };

  if (leadData.spaceType || leadData.tipoEspacio) {
    formSubmitPayload['Tipo de Espacio'] = leadData.spaceType || leadData.tipoEspacio;
  }
  if (leadData.styleTheme || leadData.estetica) {
    formSubmitPayload['Estilo / Acabado'] = leadData.styleTheme || leadData.estetica;
  }
  if (leadData.areaSize || leadData.area) {
    formSubmitPayload['Escala (m²)'] = `${leadData.areaSize || leadData.area} m²`;
  }
  if (leadData.service) {
    formSubmitPayload['Servicio Solicitado'] = leadData.service;
  }

  sendFormSubmit(
    formSubmitPayload,
    `Nueva Consulta [${leadData.source || 'Studio CAB'}] — ${leadData.name || leadData.title || 'Cliente'}`
  ).catch(err => console.warn('[FormSubmit Background Warning]', err));

  const payload = {
    title: leadData.name || leadData.title || 'Consulta Sin Nombre',
    nombre: leadData.name || leadData.title || 'Consulta Sin Nombre',
    email: leadData.email || '',
    telefono: leadData.phone || leadData.telefono || '',
    origen: leadData.source || leadData.origen || 'General',
    mensaje: leadData.message || leadData.mensaje || '',
    espacio: leadData.spaceType || leadData.tipoEspacio || '',
    estetica: leadData.styleTheme || leadData.estetica || '',
    area: leadData.areaSize ? String(leadData.areaSize) : (leadData.area ? String(leadData.area) : '')
  };

  try {
    console.log('[Wix CMS] Enviando consulta vía API REST v2 directo...');
    const token = await getWixAccessToken();
    const response = await fetch('https://www.wixapis.com/wix-data/v2/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        dataCollectionId: 'Consultas',
        dataItem: {
          data: payload
        }
      })
    });

    if (!response.ok) {
      throw new Error(`REST API failed with status: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[Wix CMS] Guardado en Wix con éxito.');
    return data.dataItem?.data || data.dataItem || null;
  } catch (error) {
    console.error('Error submitting lead to Wix CMS:', error);
    // Fallback to local storage for offline testing so no lead is lost!
    try {
      const offlineLeads = JSON.parse(localStorage.getItem('offline_leads') || '[]');
      offlineLeads.push({ ...leadData, timestamp: new Date().toISOString() });
      localStorage.setItem('offline_leads', JSON.stringify(offlineLeads));
      console.log('Saved lead to localStorage fallback.');
    } catch (e) {
      console.error('Failed to save lead to localStorage:', e);
    }
    throw error;
  }
}

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

    // Single & Multi-Reference field keys across Wix CMS collections
    const referenceFieldsToInclude = [
      'subservicios',
      'servicioPrincipal',
      'servicioMayor',
      'proyectos',
      'proyectosRelacionados',
      'subservicio',
      'servicios',
      'subserviciosAsociados',
      'mediagallery'
    ];

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
          },
          includeReferencedItems: referenceFieldsToInclude
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

    if (collectionId === 'Subservicios') {
      return allItems.filter(item => {
        const data = item.data || item;
        const val = data.aparecenEnCategora || data.aparecenEnCategoria;
        if (!val) return false;
        const str = String(val).trim().toLowerCase();
        return str === 'sí' || str === 'si' || str === 'true';
      });
    }

    return allItems;
  } catch (error) {
    console.warn(`[Wix CMS] Failed to query ${collectionId}. Falling back to local database.`, error);
    // Graceful fallback to mock DB
    if (collectionId === 'Servicios') return mockServicios;
    if (collectionId === 'Subservicios') return mockSubservicios;
    if (collectionId === 'Proyectos') return mockProyectos;
    return [];
  }
}

/**
 * Converts a Wix image URI (wix:image://v1/...) to a valid HTTPS URL.
 * Also supports regular absolute/relative URLs.
 */
export function resolveWixImage(wixUri, width = 800) {
  if (!wixUri) return '';
  if (wixUri.startsWith('http://') || wixUri.startsWith('https://') || wixUri.startsWith('/')) {
    return wixUri;
  }

  if (wixUri.startsWith('wix:image://v1/')) {
    // Format: wix:image://v1/<uri>/<filename>#originWidth=<w>&originHeight=<h>
    const match = wixUri.match(/wix:image:\/\/v1\/([^/]+)\/(.*?)(?:#|$)/);
    if (match) {
      const uri = match[1];
      const filename = match[2];
      if (width === 'original' || !width) {
        return `https://static.wixstatic.com/media/${uri}`;
      }
      // Generate standard Wix media URL. We don't apply dynamic resizing here for simplicity,
      // but Wix media supports transformations like: /v1/fill/w_800,h_800/...
      return `https://static.wixstatic.com/media/${uri}/v1/fit/w_${width},h_${width},q_80/${filename}`;
    }
  }

  return wixUri;
}

/**
 * Converts a Wix video URI (wix:video://v1/...) to a valid HTTPS URL.
 * Also supports regular absolute/relative URLs.
 */
export function resolveWixVideo(wixUri) {
  if (!wixUri) return '';
  if (wixUri.startsWith('http://') || wixUri.startsWith('https://') || wixUri.startsWith('/')) {
    return wixUri;
  }

  if (wixUri.startsWith('wix:video://v1/')) {
    // Format: wix:video://v1/<video_id>/<filename>#...
    const match = wixUri.match(/wix:video:\/\/v1\/([^/]+)\//);
    if (match) {
      const videoId = match[1];
      // Default to 1080p transcoded version
      return `https://video.wixstatic.com/video/${videoId}/1080p/mp4/file.mp4`;
    }
  }

  return wixUri;
}
