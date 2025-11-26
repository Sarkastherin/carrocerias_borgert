// Script de prueba para verificar los parámetros de la API Georef
// Ejecutar en consola del navegador para debug

console.log('🔧 Probando parámetros de API Georef...');

// Probar URL de provincias
const testProvinciaUrl = new URL('https://apis.datos.gob.ar/georef/api/provincias');
testProvinciaUrl.searchParams.append('campos', 'estandar');
testProvinciaUrl.searchParams.append('max', '25');
testProvinciaUrl.searchParams.append('orden', 'nombre');

console.log('📍 URL Provincias:', testProvinciaUrl.toString());

// Probar URL de localidades
const testLocalidadesUrl = new URL('https://apis.datos.gob.ar/georef/api/localidades');
testLocalidadesUrl.searchParams.append('provincia', '06'); // Buenos Aires
testLocalidadesUrl.searchParams.append('campos', 'estandar');
testLocalidadesUrl.searchParams.append('max', '100');
testLocalidadesUrl.searchParams.append('orden', 'nombre');

console.log('🏘️  URL Localidades:', testLocalidadesUrl.toString());

// Función para probar manualmente
async function testGeorefAPI() {
  try {
    console.log('🚀 Probando API de provincias...');
    const provinciaResponse = await fetch(testProvinciaUrl.toString());
    console.log('📊 Status Provincias:', provinciaResponse.status);
    
    if (provinciaResponse.ok) {
      const provinciaData = await provinciaResponse.json();
      console.log('✅ Provincias OK:', provinciaData.cantidad, 'resultados');
    }
    
    console.log('🚀 Probando API de localidades...');
    const localidadResponse = await fetch(testLocalidadesUrl.toString());
    console.log('📊 Status Localidades:', localidadResponse.status);
    
    if (localidadResponse.ok) {
      const localidadData = await localidadResponse.json();
      console.log('✅ Localidades OK:', localidadData.cantidad, 'resultados');
    }
    
  } catch (error) {
    console.error('❌ Error en prueba:', error);
  }
}

// Ejecutar prueba automáticamente
testGeorefAPI();

// Exportar para uso manual
window.testGeorefAPI = testGeorefAPI;