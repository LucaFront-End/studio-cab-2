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
      let allItems = [];
      let offset = 0;
      const limit = 100;
      let hasMore = true;

      while (hasMore) {
        const qRes = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            dataCollectionId: col,
            query: {
              paging: { limit, offset }
            }
          })
        });

        if (qRes.ok) {
          const data = await qRes.ok ? await qRes.json() : {};
          const items = data.dataItems || data.items || [];
          allItems = allItems.concat(items.map(it => it.data || it));

          const pagingMetadata = data.pagingMetadata;
          if (pagingMetadata) {
            hasMore = pagingMetadata.hasNext === true;
          } else {
            hasMore = items.length === limit;
          }

          if (hasMore) {
            offset += limit;
          }
        } else {
          const err = await qRes.json();
          console.error(`FAILED on "${col}":`, err.message || err.details?.applicationError?.description);
          hasMore = false;
        }
      }

      console.log(`SUCCESS! Found ${allItems.length} items in ${col}.`);
      results[col] = allItems;
    }

    fs.writeFileSync('wixData.json', JSON.stringify(results, null, 2));
    console.log('\nSaved collections data to wixData.json');
  } catch (error) {
    console.error('Script Error:', error);
  }
}

check();
