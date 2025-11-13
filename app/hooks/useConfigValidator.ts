import { useCallback } from "react";
import type { UseConfigValidatorProps, ValidationResult, SettingsItem } from "~/types/settingsManager";

export const useConfigValidator = ({ validationRules, currentData }: UseConfigValidatorProps) => {
  
  // Validar si un nombre es único antes de crear
  const validateUniqueNameBeforeCreate = useCallback((
    name: string,
    configType: string
  ): boolean => {
    try {
      const rules = validationRules[configType];
      
      // Si no hay reglas de validación de nombres únicos, permitir
      if (!rules?.uniqueNameValidation) {
        return true;
      }

      // Normalizar el nombre para comparación
      const normalizedName = name.trim().toLowerCase();
      
      if (!normalizedName) {
        return false; // Nombre vacío no es válido
      }

      // Obtener los datos actuales del tipo de configuración
      const data = currentData[configType] || [];
      
      // Verificar si ya existe un elemento con el mismo nombre
      const exists = data.some((item: SettingsItem) =>
        item.nombre && item.nombre.trim().toLowerCase() === normalizedName
      );

      return !exists; // Retorna true si NO existe (es único)
    } catch (error) {
      console.error("Error validando nombre único:", error);
      return false; // En caso de error, no permitir por seguridad
    }
  }, [validationRules, currentData]);

  // Validar si un elemento está siendo usado
  const validateElementInUse = useCallback(async (
    elementId: string,
    configType: string
  ): Promise<ValidationResult> => {
    try {
      const rules = validationRules[configType];
      
      // Si no hay reglas de validación de uso, asumir que no está en uso
      if (!rules?.usageValidation) {
        return { inUse: false, count: 0 };
      }

      let totalUsages = 0;

      // Verificar uso en cada API especificada
      for (const apiConfig of rules.usageValidation.apis) {
        for (const columnName of apiConfig.columnNames) {
          try {
            const response = await apiConfig.api.read({
              columnName,
              value: elementId,
              multiple: true,
            });

            if (response.success && response.data) {
              const count = Array.isArray(response.data) 
                ? response.data.length 
                : 1;
              totalUsages += count;
            }
          } catch (apiError) {
            console.error(`Error checking usage in ${columnName}:`, apiError);
            // En caso de error en una API específica, continuar con las otras
          }
        }
      }

      return { inUse: totalUsages > 0, count: totalUsages };
    } catch (error) {
      console.error("Error validando uso del elemento:", error);
      // En caso de error, asumir que está en uso por seguridad
      return { inUse: true, count: 1 };
    }
  }, [validationRules]);

  // Validar antes de eliminar
  const validateBeforeDelete = useCallback(async (
    elementId: string,
    configType: string
  ): Promise<{ canDelete: boolean; reason?: string; usageCount?: number }> => {
    const usageResult = await validateElementInUse(elementId, configType);
    
    if (usageResult.inUse) {
      return {
        canDelete: false,
        reason: `Este ${configType.slice(0, -1)} está siendo usado en ${usageResult.count} registro(s)`,
        usageCount: usageResult.count
      };
    }

    return { canDelete: true };
  }, [validateElementInUse]);

  return {
    validateUniqueNameBeforeCreate,
    validateElementInUse,
    validateBeforeDelete,
  };
};