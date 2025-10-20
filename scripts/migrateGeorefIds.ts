/**
 * Script de Migración para Agregar IDs de Provincia y Localidad
 * 
 * Este script busca los IDs oficiales de Georef para las provincias y localidades
 * existentes en tu base de datos y los actualiza.
 * 
 * INSTRUCCIONES:
 * 1. Primero agrega los campos provincia_id y localidad_id a tu tabla (nullable)
 * 2. Ejecuta este script para poblar los IDs
 * 3. Una vez completado, puedes hacer los campos obligatorios si lo deseas
 */

import { georefService } from "~/services/georefService";
import type { ClientesBD } from "~/types/clientes";

interface MigrationResult {
  success: boolean;
  processed: number;
  updated: number;
  errors: string[];
}

/**
 * Busca el ID de una provincia por su nombre
 */
async function findProvinciaId(nombreProvincia: string): Promise<string | null> {
  try {
    const provincias = await georefService.getProvincias(nombreProvincia, 5);
    
    // Buscar coincidencia exacta o muy similar
    const exactMatch = provincias.find(p => 
      p.nombre.toLowerCase() === nombreProvincia.toLowerCase() ||
      p.nombre_largo.toLowerCase().includes(nombreProvincia.toLowerCase())
    );
    
    return exactMatch?.id || null;
  } catch (error) {
    console.error(`Error buscando provincia "${nombreProvincia}":`, error);
    return null;
  }
}

/**
 * Busca el ID de una localidad por su nombre y provincia
 */
async function findLocalidadId(
  nombreLocalidad: string, 
  provinciaId: string
): Promise<string | null> {
  try {
    const localidades = await georefService.getLocalidades(provinciaId, nombreLocalidad, 10);
    
    // Buscar coincidencia exacta
    const exactMatch = localidades.find(l => 
      l.nombre.toLowerCase() === nombreLocalidad.toLowerCase()
    );
    
    return exactMatch?.id || null;
  } catch (error) {
    console.error(`Error buscando localidad "${nombreLocalidad}":`, error);
    return null;
  }
}

/**
 * Migra un cliente individual
 */
async function migrateCliente(cliente: ClientesBD): Promise<{
  success: boolean;
  updated: boolean;
  provinciaId?: string;
  localidadId?: string;
  error?: string;
}> {
  try {
    let updated = false;
    let provinciaId = cliente.provincia_id;
    let localidadId = cliente.localidad_id;

    // Solo buscar si no tiene provincia_id
    if (!provinciaId && cliente.provincia) {
      const foundProvinciaId = await findProvinciaId(cliente.provincia);
      if (foundProvinciaId) {
        provinciaId = foundProvinciaId;
        updated = true;
        console.log(`✓ Encontrada provincia "${cliente.provincia}" → ID: ${provinciaId}`);
      } else {
        console.warn(`⚠ No se encontró provincia: "${cliente.provincia}"`);
      }
    }

    // Solo buscar localidad si tenemos provincia_id y no tenemos localidad_id
    if (provinciaId && !localidadId && cliente.localidad) {
      const foundLocalidadId = await findLocalidadId(cliente.localidad, provinciaId);
      if (foundLocalidadId) {
        localidadId = foundLocalidadId;
        updated = true;
        console.log(`✓ Encontrada localidad "${cliente.localidad}" → ID: ${localidadId}`);
      } else {
        console.warn(`⚠ No se encontró localidad: "${cliente.localidad}" en provincia ID: ${provinciaId}`);
      }
    }

    return {
      success: true,
      updated,
      provinciaId: provinciaId || undefined,
      localidadId: localidadId || undefined
    };

  } catch (error) {
    return {
      success: false,
      updated: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Función principal de migración
 * 
 * NOTA: Necesitas implementar las funciones de base de datos según tu sistema
 * (Google Sheets, SQL, etc.)
 */
export async function migrateClientesGeorefIds(
  // Función para obtener clientes (implementar según tu base de datos)
  getClientes: () => Promise<ClientesBD[]>,
  // Función para actualizar cliente (implementar según tu base de datos)
  updateCliente: (id: string, updates: Partial<ClientesBD>) => Promise<boolean>
): Promise<MigrationResult> {
  
  console.log('🚀 Iniciando migración de IDs de Georef...');
  
  const result: MigrationResult = {
    success: true,
    processed: 0,
    updated: 0,
    errors: []
  };

  try {
    // Obtener todos los clientes
    const clientes = await getClientes();
    console.log(`📊 Se encontraron ${clientes.length} clientes para procesar`);

    // Procesar cada cliente
    for (const cliente of clientes) {
      result.processed++;
      
      console.log(`\n📝 Procesando cliente ${result.processed}/${clientes.length}: ${cliente.razon_social}`);
      
      const migrationResult = await migrateCliente(cliente);
      
      if (migrationResult.success && migrationResult.updated) {
        // Actualizar en la base de datos
        const updates: Partial<ClientesBD> = {};
        
        if (migrationResult.provinciaId) {
          updates.provincia_id = migrationResult.provinciaId;
        }
        
        if (migrationResult.localidadId) {
          updates.localidad_id = migrationResult.localidadId;
        }

        const updateSuccess = await updateCliente(cliente.id, updates);
        
        if (updateSuccess) {
          result.updated++;
          console.log(`✅ Cliente actualizado exitosamente`);
        } else {
          result.errors.push(`Error actualizando cliente ${cliente.id}: ${cliente.razon_social}`);
        }
        
      } else if (!migrationResult.success) {
        result.errors.push(`Error procesando cliente ${cliente.id}: ${migrationResult.error}`);
      }

      // Pausa pequeña para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n🎉 Migración completada');
    console.log(`📊 Estadísticas:`);
    console.log(`   - Clientes procesados: ${result.processed}`);
    console.log(`   - Clientes actualizados: ${result.updated}`);
    console.log(`   - Errores: ${result.errors.length}`);
    
    if (result.errors.length > 0) {
      console.log(`\n❌ Errores encontrados:`);
      result.errors.forEach(error => console.log(`   - ${error}`));
    }

  } catch (error) {
    result.success = false;
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    result.errors.push(`Error general: ${errorMsg}`);
    console.error('💥 Error en la migración:', error);
  }

  return result;
}

/**
 * Ejemplo de uso:
 * 
 * // Para Google Sheets (ejemplo)
 * import { clientesAPI } from "~/backend/sheetServices";
 * 
 * const migration = await migrateClientesGeorefIds(
 *   () => clientesAPI.getAll(),
 *   (id, updates) => clientesAPI.update(id, updates)
 * );
 * 
 * console.log('Resultado:', migration);
 */

/**
 * CAMPOS A AGREGAR EN TU TABLA:
 * 
 * SQL:
 * ALTER TABLE clientes ADD COLUMN provincia_id VARCHAR(10);
 * ALTER TABLE clientes ADD COLUMN localidad_id VARCHAR(15);
 * 
 * Google Sheets:
 * - Agregar columnas "provincia_id" y "localidad_id" en tu hoja
 * 
 * Otros:
 * - Agregar campos provincia_id (string, nullable) y localidad_id (string, nullable)
 */