const WIX_CLIENT_ID = '8f4920b3-137c-4fd6-a0a5-dc4957f08701';

async function check() {
  try {
    console.log('Fetching OAuth token...');
    const tokenRes = await fetch('https://www.wixapis.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: WIX_CLIENT_ID,
        grantType: 'anonymous'
      })
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;
    console.log('Token acquired!');

    const fs = await import('fs');
    const results = {};

    for (const col of ['Servicios', 'Subservicios']) {
      console.log(`\nQuerying "${col}"...`);
      const qRes = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dataCollectionId: col,
          query: { paging: { limit: 100 } }
        })
      });

      if (qRes.ok) {
        const data = await qRes.json();
        const items = data.dataItems || data.items || [];
        console.log(`SUCCESS! Found ${items.length} items in ${col}.`);
        results[col] = items.map(it => it.data || it);
      } else {
        const err = await qRes.json();
        console.error(`FAILED on "${col}":`, err.message || err.details?.applicationError?.description);
      }
    }

    fs.writeFileSync('wixData.json', JSON.stringify(results, null, 2));
    console.log('\nSaved collections data to wixData.json');
  } catch (error) {
    console.error('Script Error:', error);
  }
}

check();
