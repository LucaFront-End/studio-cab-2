import { useState, useEffect } from 'react';
import { fetchWixCollection } from '../lib/wixCMS';

export function useWixCMSData() {
  const [data, setData] = useState({ servicios: [], subservicios: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [servs, subServs] = await Promise.all([
          fetchWixCollection('Servicios'),
          fetchWixCollection('Subservicios')
        ]);
        if (!cancelled) {
          setData({ servicios: servs, subservicios: subServs });
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
