import { useState, useEffect, useRef } from "react";

export interface LoaderConfig {
  /**
   * Función o array de funciones a ejecutar para cargar datos
   */
  loaders: (() => Promise<any>) | (() => Promise<any>)[];
  
  /**
   * Datos que se deben verificar antes de cargar (opcional)
   * Si se proporciona, solo carga si alguno de estos datos es null/undefined
   */
  dependencies?: any[];
  
  /**
   * Si true, siempre ejecuta los loaders independientemente de las dependencies
   * Por defecto: false
   */
  forceLoad?: boolean;
  
  /**
   * Mensaje personalizado para logging de errores
   */
  errorMessage?: string;
}

/**
 * Hook personalizado para manejar la carga de datos con estado de loading
 * 
 * @param config Configuración del loader
 * @returns objeto con isLoading y función para recargar
 */
export function useDataLoader(config: LoaderConfig) {
  const { 
    loaders, 
    dependencies = [], 
    forceLoad = false, 
    errorMessage = "Error loading data" 
  } = config;
  
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedRef = useRef(false);
  const loadersRef = useRef(loaders);
  
  // Actualizar la referencia de loaders cuando cambien
  loadersRef.current = loaders;

  useEffect(() => {
    const shouldLoad = forceLoad || 
      dependencies.length === 0 || 
      dependencies.some(dep => dep == null);

    if (shouldLoad && !hasLoadedRef.current) {
      const runLoaders = async () => {
        try {
          setIsLoading(true);
          const loadersArray = Array.isArray(loadersRef.current) ? loadersRef.current : [loadersRef.current];
          await Promise.all(loadersArray.map(loader => loader()));
          hasLoadedRef.current = true;
        } catch (error) {
          console.error(`${errorMessage}:`, error);
        } finally {
          setIsLoading(false);
        }
      };
      runLoaders();
    } else if (!shouldLoad) {
      setIsLoading(false);
    }
  }, [dependencies, forceLoad, errorMessage]); // Solo incluimos las dependencias esenciales

  const reload = () => {
    hasLoadedRef.current = false;
    setIsLoading(true);
    
    const runLoaders = async () => {
      try {
        const loadersArray = Array.isArray(loadersRef.current) ? loadersRef.current : [loadersRef.current];
        await Promise.all(loadersArray.map(loader => loader()));
        hasLoadedRef.current = true;
      } catch (error) {
        console.error(`${errorMessage}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    runLoaders();
  };

  return { isLoading, reload };
}