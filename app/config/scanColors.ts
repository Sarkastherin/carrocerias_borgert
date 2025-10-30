/**
 * Script simple para encontrar usos de clases primary que necesitan migración
 * 
 * Para usar:
 * npm run tsx app/config/scanColors.ts
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

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

// Patrones a buscar - corregidos para evitar falsos positivos
const PATTERNS_TO_FIND = [
  /\bbg-primary-\d+(?![\w-])/g,      // bg-primary-600 pero no bg-primary-600-hover
  /(?<![\w-])text-primary-\d+(?![\w-])/g,    // text-primary-600 pero no text-text-primary-600
  /\bborder-primary-\d+(?![\w-])/g,  // border-primary-500 pero no border-primary-500-dark
  /\bring-primary-\d+(?![\w-])/g,    // ring-primary-300 pero no ring-primary-300-light
  /\bhover:bg-primary-\d+(?![\w-])/g,
  /(?<![\w-])hover:text-primary-\d+(?![\w-])/g,
  /\bhover:border-primary-\d+(?![\w-])/g,
  /\bfocus:ring-primary-\d+(?![\w-])/g,
  /\bbg-primary(?!\-|[\w])/g,        // bg-primary pero no bg-primary-600 o bg-primary-light
  /(?<![\w-])text-primary(?!\-|[\w])/g,      // text-primary pero no text-text-primary
  /\bborder-primary(?!\-|[\w])/g,    // border-primary pero no border-primary-500
];

// Sugerencias de reemplazo
const SUGGESTIONS: Record<string, string> = {
  'bg-primary-50': 'bg-[var(--brand-primary-50)]',
  'bg-primary-100': 'bg-[var(--color-primary-muted)]',
  'bg-primary-200': 'bg-[var(--brand-primary-200)]',
  'bg-primary-300': 'bg-[var(--brand-primary-300)]',
  'bg-primary-400': 'bg-[var(--brand-primary-400)]',
  'bg-primary-500': 'bg-[var(--brand-primary-500)]',
  'bg-primary-600': 'bg-[var(--color-primary)]',
  'bg-primary-700': 'bg-[var(--brand-primary-700)]',
  'bg-primary-800': 'bg-[var(--brand-primary-800)]',
  'bg-primary-900': 'bg-[var(--brand-primary-900)]',
  'bg-primary-950': 'bg-[var(--brand-primary-950)]',
  
  'hover:bg-primary-700': 'hover:bg-[var(--color-primary-hover)]',
  'hover:bg-primary-600': 'hover:bg-[var(--color-primary-hover)]',
  'hover:bg-primary-100': 'hover:bg-[var(--color-primary-muted)]',
  
  'text-primary': 'text-[var(--color-primary)]',
  'text-primary-light': 'text-[var(--color-primary-muted-foreground)]',
  
  'border-primary': 'border-[var(--color-primary)]',
  'border-primary-500': 'border-[var(--color-primary)]',
  'hover:border-primary-400': 'hover:border-[var(--color-primary-hover)]',
  
  'focus:ring-primary-focus': 'focus:ring-[var(--color-primary-focus)]',
  'ring-primary-300': 'ring-[var(--color-primary-focus)]',
};

function scanFile(filePath: string): { matches: string[]; suggestions: string[] } {
  try {
    const content = readFileSync(filePath, 'utf8');
    const matches: string[] = [];
    const suggestions: string[] = [];
    
    for (const pattern of PATTERNS_TO_FIND) {
      const found = content.match(pattern);
      if (found) {
        for (const match of found) {
          if (!matches.includes(match)) {
            matches.push(match);
            const suggestion = SUGGESTIONS[match] || `${match} → Revisar manualmente`;
            suggestions.push(suggestion);
          }
        }
      }
    }
    
    return { matches, suggestions };
  } catch (error) {
    return { matches: [], suggestions: [] };
  }
}

function main() {
  console.log('🔍 Escaneando archivos para clases primary...\n');
  
  // Buscar archivos en el directorio app
  const files = findFiles('app', ['tsx', 'ts', 'jsx', 'js']);
  
  // Filtrar archivos de configuración y herramientas
  const filteredFiles = files.filter(file => {
    const fileName = file.split(/[\\\/]/).pop() || '';
    return !['colorMigration.ts', 'scanColors.ts', 'colorSystem.ts'].includes(fileName);
  });
  
  let totalMatches = 0;
  const fileResults: { file: string; matches: string[]; suggestions: string[] }[] = [];
  
  for (const file of filteredFiles) {
    const { matches, suggestions } = scanFile(file);
    
    if (matches.length > 0) {
      fileResults.push({ file, matches, suggestions });
      totalMatches += matches.length;
    }
  }
  
  if (totalMatches === 0) {
    console.log('✅ No se encontraron clases primary que necesiten migración.');
    return;
  }
  
  console.log(`📋 Se encontraron ${totalMatches} clases en ${fileResults.length} archivos:\n`);
  
  for (const { file, matches, suggestions } of fileResults) {
    console.log(`📄 ${file}`);
    for (let i = 0; i < matches.length; i++) {
      console.log(`   ❌ ${matches[i]}`);
      console.log(`   ✅ ${suggestions[i]}`);
      console.log('');
    }
  }
  
  console.log('💡 Para migrar:');
  console.log('1. Reemplaza las clases manualmente siguiendo las sugerencias');
  console.log('2. Usa los tokens semánticos cuando sea posible');
  console.log('3. Revisa la guía en COLOR_SYSTEM_GUIDE.md');
}

// Ejecutar función principal
main();

export { main, scanFile, findFiles };