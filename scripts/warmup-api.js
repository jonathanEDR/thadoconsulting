/**
 * 🔥 API Warm-up Script
 * 
 * Este script "despierta" el backend en Render antes de ejecutar
 * los scripts de pre-rendering. Render free tier pone los servicios
 * a dormir después de 15 minutos de inactividad.
 * 
 * Ejecutar ANTES de prerender-*.js y generate-sitemap.js
 */

// IMPORTANTE: Normalizar la URL base - remover /api si ya está incluido para evitar /api/api
let rawApiUrl = process.env.VITE_API_URL || process.env.API_URL || 'https://web-scuticompany-back.onrender.com';
const baseApiUrl = rawApiUrl.replace(/\/api\/?$/, '');

const CONFIG = {
  apiUrl: baseApiUrl,
  maxRetries: 5,
  retryDelay: 10000, // 10 segundos entre reintentos
  timeout: 60000 // 60 segundos timeout (Render puede tardar en despertar)
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function warmupBackend() {
  console.log('═'.repeat(60));
  console.log('🔥 WARM-UP DEL BACKEND');
  console.log('═'.repeat(60));
  console.log(`\n📡 URL del Backend: ${CONFIG.apiUrl}`);
  console.log('⏳ El backend puede tardar hasta 60s en despertar...\n');

  for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
    try {
      console.log(`🔄 Intento ${attempt}/${CONFIG.maxRetries}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);

      const startTime = Date.now();
      
      // Hacer una petición simple para despertar el servidor
      const response = await fetch(`${CONFIG.apiUrl}/api/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Vercel-Build-Warmup/1.0'
        }
      });

      clearTimeout(timeoutId);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

      if (response.ok) {
        console.log(`   ✅ Backend respondió en ${elapsed}s`);
        console.log(`   📊 Status: ${response.status} ${response.statusText}`);
        
        // Verificar que servicios y blog estén accesibles
        console.log('\n🔍 Verificando endpoints principales...');
        
        // Verificar servicios
        const servicesResponse = await fetch(`${CONFIG.apiUrl}/api/servicios?limit=1`, {
          signal: AbortSignal.timeout(30000)
        });
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          console.log(`   ✅ /api/servicios: ${servicesData.total || 0} servicios disponibles`);
        } else {
          console.log(`   ⚠️ /api/servicios: ${servicesResponse.status} ${servicesResponse.statusText}`);
        }

        // Verificar blog
        const blogResponse = await fetch(`${CONFIG.apiUrl}/api/blog/posts?limit=1`, {
          signal: AbortSignal.timeout(30000)
        });
        if (blogResponse.ok) {
          const blogData = await blogResponse.json();
          console.log(`   ✅ /api/blog/posts: ${blogData.data?.pagination?.total || blogData.total || 0} posts disponibles`);
        } else {
          console.log(`   ⚠️ /api/blog/posts: ${blogResponse.status} ${blogResponse.statusText}`);
        }

        // Verificar categorías
        const categoriesResponse = await fetch(`${CONFIG.apiUrl}/api/blog/categories`, {
          signal: AbortSignal.timeout(30000)
        });
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          const count = categoriesData.data?.length || 0;
          console.log(`   ✅ /api/blog/categories: ${count} categorías disponibles`);
        } else {
          console.log(`   ⚠️ /api/blog/categories: ${categoriesResponse.status} ${categoriesResponse.statusText}`);
        }

        console.log('\n' + '═'.repeat(60));
        console.log('✅ WARM-UP COMPLETADO - Backend listo para pre-rendering');
        console.log('═'.repeat(60) + '\n');
        
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      const isAbort = error.name === 'AbortError';
      const message = isAbort ? 'Timeout - backend tardando en despertar' : error.message;
      
      console.log(`   ❌ Error: ${message}`);
      
      if (attempt < CONFIG.maxRetries) {
        console.log(`   ⏳ Esperando ${CONFIG.retryDelay/1000}s antes del siguiente intento...\n`);
        await sleep(CONFIG.retryDelay);
      }
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('⚠️ WARM-UP FALLÓ - El backend puede no estar disponible');
  console.log('   Los scripts de pre-rendering continuarán pero pueden fallar');
  console.log('═'.repeat(60) + '\n');
  
  // No fallar el build, dejar que los scripts intenten de todos modos
  return false;
}

// Ejecutar
warmupBackend()
  .then(success => {
    process.exit(success ? 0 : 0); // Siempre exit 0 para no romper el build
  })
  .catch(error => {
    console.error('Error inesperado:', error);
    process.exit(0); // No romper el build
  });
