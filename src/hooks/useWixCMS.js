import { useState, useEffect } from 'react';
import { fetchWixCollection, fetchWixStoreProducts, fetchWixStoreCollections } from '../lib/wixCMS';

export function useWixCMSData() {
  const [data, setData] = useState({ servicios: [], subservicios: [], proyectos: [], productos: [], colecciones: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [servs, subServs, proys, prods, cols] = await Promise.all([
          fetchWixCollection('Servicios'),
          fetchWixCollection('Subservicios'),
          fetchWixCollection('Proyectos'),
          fetchWixStoreProducts(),
          fetchWixStoreCollections()
        ]);
        if (!cancelled) {
          setData({ servicios: servs, subservicios: subServs, proyectos: proys, productos: prods, colecciones: cols });
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { ...data, loading, error };
}
