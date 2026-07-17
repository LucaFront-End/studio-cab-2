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

    const allKeys = new Set();
    for (const col of ['Subservicios']) {
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
          const data = await qRes.json();
          const items = data.dataItems || data.items || [];
          items.forEach(it => {
            const keys = Object.keys(it.data || it);
            keys.forEach(k => allKeys.add(k));
          });
          allItems = allItems.concat(items);

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
          hasMore = false;
        }
      }
    }
    
    console.log('\nUnique keys in Subservicios:', Array.from(allKeys));
  } catch (error) {
    console.error('Script Error:', error);
  }
}

check();
