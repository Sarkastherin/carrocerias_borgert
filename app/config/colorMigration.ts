/**
 * Script de migración para actualizar clases de colores primary
 * 
 * Este script te ayuda a migrar de las clases antiguas al nuevo sistema de tokens.
 * Ejecuta este script para obtener una lista de archivos que necesitan actualización.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { CSS_CLASSES } from './colorSystem';

// Mapeo de migraciones automáticas
const AUTO_MIGRATIONS = {
  // Clases básicas
  'bg-primary-600/90': 'bg-[var(--color-primary)]/90',
  'hover:bg-primary-700': 'hover:bg-[var(--color-primary-hover)]',
  'border-primary-500': 'border-[var(--color-primary)]',
  'hover:border-primary-400': 'hover:border-[var(--color-primary-hover)]',
  'text-primary-light': 'text-[var(--color-primary-muted-foreground)]',
  'bg-primary-100': 'bg-[var(--color-primary-muted)]',
  'hover:bg-primary-100': 'hover:bg-[var(--color-primary-muted)]',
  'hover:text-primary-light': 'hover:text-[var(--color-primary-muted-foreground)]',
  
  // Patrones específicos de la aplicación
  'bg-primary hover:bg-primary-hover': CSS_CLASSES.BUTTON_PRIMARY,
  'text-primary': 'text-[var(--color-primary)]',
  'border border-primary': 'border border-[var(--color-primary)]',
  'focus:ring-primary-focus': 'focus:ring-[var(--color-primary-focus)]',
};

// Función para encontrar archivos recursivamente
function findFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  function walkDir(currentPath: string) {
    try {
      const items = readdirSync(currentPath);
      
      for (const item of items) {
        const fullPath = join(currentPath, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Evitar node_modules y .git
          if (!item.startsWith('.') && item !== 'node_modules') {
            walkDir(fullPath);
          }
        } else {
          // Verificar extensión
          const ext = fullPath.split('.').pop();
          if (ext && extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Ignorar errores de permisos
    }
  }
  
  walkDir(dir);
  return files;
}

// Función para escanear archivos
export function scanFiles(): Promise<{ file: string; matches: string[] }[]> {
  return new Promise((resolve) => {
    try {
      // Buscar archivos desde el directorio app
      const files = findFiles('app', ['tsx', 'ts', 'jsx', 'js']);
      const results: { file: string; matches: string[] }[] = [];
      
      for (const file of files) {
        try {
          const content = readFileSync(file, 'utf8');
          const matches: string[] = [];
          
          // Buscar patrones que necesitan migración
          for (const [oldPattern, newPattern] of Object.entries(AUTO_MIGRATIONS)) {
            if (content.includes(oldPattern)) {
              matches.push(`${oldPattern} → ${newPattern}`);
            }
          }
          
          // Buscar clases primary específicas
          const primaryClassRegex = /\b(bg|text|border|ring)-primary-(\d+)\b/g;
          let match;
          while ((match = primaryClassRegex.exec(content)) !== null) {
            const fullMatch = match[0];
            const prefix = match[1];
            const number = match[2];
            const suggestion = `${prefix}-[var(--brand-primary-${number})]`;
            matches.push(`${fullMatch} → ${suggestion}`);
          }
          
          if (matches.length > 0) {
            results.push({ file, matches });
          }
        } catch (error) {
          console.warn(`Error leyendo archivo ${file}:`, error);
        }
      }
      
      resolve(results);
    } catch (error) {
      console.error('Error escaneando archivos:', error);
      resolve([]);
    }
  });
}

// Función para aplicar migraciones automáticas
export function applyMigrations(filePath: string, dryRun: boolean = true): string[] {
  const content = readFileSync(filePath, 'utf8');
  let newContent = content;
  const changes: string[] = [];
  
  for (const [oldPattern, newPattern] of Object.entries(AUTO_MIGRATIONS)) {
    if (newContent.includes(oldPattern)) {
      newContent = newContent.replaceAll(oldPattern, newPattern);
      changes.push(`${oldPattern} → ${newPattern}`);
    }
  }
  
  if (!dryRun && changes.length > 0) {
    writeFileSync(filePath, newContent, 'utf8');
  }
  
  return changes;
}

// Función para generar reporte de migración
export async function generateMigrationReport(): Promise<void> {
  console.log('🔍 Escaneando archivos para migración de colores...\n');
  
  try {
    const results = await scanFiles();
    
    if (results.length === 0) {
      console.log('✅ No se encontraron clases que necesiten migración.');
      return;
    }
    
    console.log(`📋 Se encontraron ${results.length} archivos que necesitan migración:\n`);
    
    for (const { file, matches } of results) {
      console.log(`📄 ${file}`);
      for (const match of matches) {
        console.log(`   • ${match}`);
      }
      console.log('');
    }
    
    console.log('🛠️  Para aplicar las migraciones automáticas:');
    console.log('   npm run migrate-colors');
    console.log('\n💡 Revisa manualmente cada cambio antes de confirmar.');
    
  } catch (error) {
    console.error('❌ Error durante el escaneo:', error);
  }
}

// Función principal para uso en Node.js
export async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'scan':
      await generateMigrationReport();
      break;
    case 'migrate':
      // Implementar migración automática aquí
      console.log('🚧 Función de migración automática en desarrollo...');
      break;
    default:
      console.log('Uso: tsx colorMigration.ts [scan|migrate]');
      console.log('  scan    - Escanea archivos para encontrar clases que necesitan migración');
      console.log('  migrate - Aplica migraciones automáticas (¡cuidado!)');
  }
}

// Solo ejecutar si es el archivo principal
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error);
}

export default {
  scanFiles,
  applyMigrations,
  generateMigrationReport,
  AUTO_MIGRATIONS,
};