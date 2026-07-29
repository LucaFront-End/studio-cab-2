/* global process */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://studiocab.mx';
const WIX_CLIENT_ID = '8f4920b3-137c-4fd6-a0a5-dc4957f08701';

// Format Date YYYY-MM-DD
const currentDate = new Date().toISOString().split('T')[0];

function formatLastModDate(dateVal) {
  if (!dateVal) return currentDate;
  try {
    if (typeof dateVal === 'object' && dateVal.$date) {
      return new Date(dateVal.$date).toISOString().split('T')[0];
    }
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch {
    // fallback
  }
  return currentDate;
}

function generateUrlSetXml(urls) {
  const urlNodes = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || currentDate}</lastmod>
    <changefreq>${u.changefreq || 'weekly'}</changefreq>
    <priority>${u.priority || '0.8'}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>`;
}

function generateSitemapIndexXml(sitemaps) {
  const sitemapNodes = sitemaps.map(s => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod || currentDate}</lastmod>
  </sitemap>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapNodes}
</sitemapindex>`;
}

async function getWixAccessToken() {
  try {
    const res = await fetch('https://www.wixapis.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: WIX_CLIENT_ID, grantType: 'anonymous' })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token;
  } catch {
    return null;
  }
}

async function fetchLiveProducts(token) {
  if (!token) return [];
  try {
    const res = await fetch('https://www.wixapis.com/stores/v1/products/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ query: {} })
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function fetchWixCollectionItems(token, collectionId) {
  if (!token) return [];
  try {
    const res = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ dataCollectionId: collectionId, query: { paging: { limit: 1000 } } })
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.dataItems || [];
  } catch {
    return [];
  }
}

async function main() {
  console.log('[Sitemap Generator] Starting dynamic sitemap generation...');

  const token = await getWixAccessToken();
  const liveProducts = await fetchLiveProducts(token);
  const liveSubservices = await fetchWixCollectionItems(token, 'Subservicios');
  const liveProjects = await fetchWixCollectionItems(token, 'Proyectos');
  const liveCityLandings = await fetchWixCollectionItems(token, 'LandingsdeCiudad');

  console.log(`[Sitemap Generator] Fetched ${liveProducts.length} products, ${liveSubservices.length} subservices, ${liveProjects.length} projects, ${liveCityLandings.length} city landings from Wix CMS.`);

  // 1. Static Sitemap
  const staticUrls = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/nosotros`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/servicios`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${BASE_URL}/tienda`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/proyectos`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/contacto`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/zonas-de-cobertura`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/politica-de-privacidad`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${BASE_URL}/terminos-y-condiciones`, priority: '0.3', changefreq: 'yearly' },
  ];
  const staticXml = generateUrlSetXml(staticUrls);

  // 2. Services Sitemap
  const servicesUrls = [
    { loc: `${BASE_URL}/servicios/comercial`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${BASE_URL}/servicios/residencial`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${BASE_URL}/servicios/carpinteria`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${BASE_URL}/servicios/tapiceria`, priority: '0.9', changefreq: 'weekly' },
  ];
  const servicesXml = generateUrlSetXml(servicesUrls);

  // 3. Subservices Sitemap (100% Dynamic from Wix CMS Subservicios collection)
  let subservicesUrls = [];
  if (liveSubservices.length > 0) {
    const uniqueSlugs = new Set();
    liveSubservices.forEach(item => {
      const data = item.data || item;
      const slug = data.slug || data._id;
      const val = data.aparecenEnCategora || data.aparecenEnCategoria;
      let isPublished = false;
      if (val) {
        const str = String(val).trim().toLowerCase();
        if (str === 'sí' || str === 'si' || str === 'true') {
          isPublished = true;
        }
      }

      if (isPublished && slug && !uniqueSlugs.has(slug)) {
        uniqueSlugs.add(slug);
        const lastModDate = data._updatedDate || data._createdDate;
        subservicesUrls.push({
          loc: `${BASE_URL}/subservicios/${slug}`,
          priority: '0.85',
          changefreq: 'weekly',
          lastmod: formatLastModDate(lastModDate)
        });
      }
    });
  } else {
    // Fallback subservices list
    const fallbackSlugs = [
      'lockers-vestidores-alto-rendimiento',
      'barras-recepcion-escultoricas',
      'mesas-juntas-escritorios-ejecutivos',
      'booths-banquetas-corridas-ergonomicas',
      'cocinas-vestidores-residenciales',
      'lambrines-revestimientos-acusticos',
      'ffe-cabeceros-cama-hoteles',
      'instalacion-monumental-herreria-fina',
      'tapiceria-muebles-fine-retail'
    ];
    subservicesUrls = fallbackSlugs.map(slug => ({
      loc: `${BASE_URL}/subservicios/${slug}`,
      priority: '0.85',
      changefreq: 'weekly'
    }));
  }
  const subservicesXml = generateUrlSetXml(subservicesUrls);

  // 4. City Landings Sitemap (100% Dynamic from Wix CMS LandingsdeCiudad collection)
  let cityLandingsUrls = [];
  if (liveCityLandings.length > 0) {
    const uniqueSlugs = new Set();
    liveCityLandings.forEach(item => {
      const data = item.data || item;
      const slug = data.slug || item._id;
      if (slug && !uniqueSlugs.has(slug)) {
        uniqueSlugs.add(slug);
        const lastModDate = data._updatedDate || data._createdDate;
        cityLandingsUrls.push({
          loc: `${BASE_URL}/ciudad/${slug}`,
          priority: '0.8',
          changefreq: 'weekly',
          lastmod: formatLastModDate(lastModDate)
        });
      }
    });
  }
  const cityLandingsXml = generateUrlSetXml(cityLandingsUrls);

  // 5. Products Sitemap (100% Dynamic from Wix Stores API + Fallback)
  const productUrls = liveProducts.length > 0
    ? liveProducts.map(p => ({
        loc: `${BASE_URL}/tienda/${p.id || p._id}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: formatLastModDate(p.lastUpdated)
      }))
    : [
        { loc: `${BASE_URL}/tienda/ab84a5e1-1959-1c59-baa3-ecc634b7f52f`, priority: '0.8' },
        { loc: `${BASE_URL}/tienda/ee27743f-3569-8286-70e5-7266e62cf483`, priority: '0.8' },
        { loc: `${BASE_URL}/tienda/d5e57831-3481-3adf-d857-2ba34ed1fabc`, priority: '0.8' },
        { loc: `${BASE_URL}/tienda/9412b68c-f9a3-0f76-303c-62dc441f8ab7`, priority: '0.8' }
      ];
  const productsXml = generateUrlSetXml(productUrls);

  // 6. Projects Sitemap (Dynamic Portfolio from Wix CMS Proyectos collection + Fallback)
  const projectsUrls = liveProjects.length > 0
    ? liveProjects.map(item => {
        const data = item.data || item;
        const id = data._id || data.slug || data.title?.toLowerCase().replace(/\s+/g, '-');
        const lastModDate = data._updatedDate || data._createdDate;
        return {
          loc: `${BASE_URL}/proyectos/${id}`,
          priority: '0.8',
          changefreq: 'monthly',
          lastmod: formatLastModDate(lastModDate)
        };
      })
    : ['basilio', 'condesa', 'polanco', 'madrigal', 'corporativo-santa-fe'].map(id => ({
        loc: `${BASE_URL}/proyectos/${id}`,
        priority: '0.8',
        changefreq: 'monthly'
      }));
  const projectsXml = generateUrlSetXml(projectsUrls);

  // 7. Sitemap Index
  const sitemapIndex = [
    { loc: `${BASE_URL}/sitemap-estatico.xml` },
    { loc: `${BASE_URL}/sitemap-servicios.xml` },
    { loc: `${BASE_URL}/sitemap-subservicios.xml` },
    { loc: `${BASE_URL}/sitemap-landings.xml` },
    { loc: `${BASE_URL}/sitemap-productos.xml` },
    { loc: `${BASE_URL}/sitemap-proyectos.xml` },
  ];
  const sitemapIndexXml = generateSitemapIndexXml(sitemapIndex);

  // 8. Robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

  // Write to public directory
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndexXml);
  fs.writeFileSync(path.join(publicDir, 'sitemap-estatico.xml'), staticXml);
  fs.writeFileSync(path.join(publicDir, 'sitemap-servicios.xml'), servicesXml);
  fs.writeFileSync(path.join(publicDir, 'sitemap-subservicios.xml'), subservicesXml);
  fs.writeFileSync(path.join(publicDir, 'sitemap-landings.xml'), cityLandingsXml);
  fs.writeFileSync(path.join(publicDir, 'sitemap-productos.xml'), productsXml);
  fs.writeFileSync(path.join(publicDir, 'sitemap-proyectos.xml'), projectsXml);
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);

  console.log('[Sitemap Generator] ✅ Successfully generated all 7 sitemap XML files and robots.txt!');
}

main().catch(err => {
  console.error('[Sitemap Generator Error]', err);
  process.exit(1);
});
