import { useEffect, useState } from 'react';
import { precargarProvincias, getGeorefSystemInfo } from '~/services/georefService';

export function useGeorefPreloader() {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [systemInfo, setSystemInfo] = useState(getGeorefSystemInfo());

  useEffect(() => {
    const precargar = async () => {
      try {
        await precargarProvincias();
        setIsPreloaded(true);
      } catch (error) {
        console.warn('No se pudieron precargar los datos de Georef:', error);
        // No importa si falla, el sistema usará fallback
        setIsPreloaded(true);
      }
    };

    precargar();
  }, []);

  return {
    isPreloaded,
    systemInfo
  };
}