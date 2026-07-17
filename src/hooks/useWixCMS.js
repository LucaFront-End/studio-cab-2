import { useState, useEffect } from 'react';
import { fetchWixCollection, fetchWixStoreProducts } from '../lib/wixCMS';

export function useWixCMSData() {
  const [data, setData] = useState({ servicios: [], subservicios: [], proyectos: [], productos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [servs, subServs, proys, prods] = await Promise.all([
          fetchWixCollection('Servicios'),
          fetchWixCollection('Subservicios'),
          fetchWixCollection('Proyectos'),
          fetchWixStoreProducts()
        ]);
        if (!cancelled) {
          setData({ servicios: servs, subservicios: subServs, proyectos: proys, productos: prods });
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
