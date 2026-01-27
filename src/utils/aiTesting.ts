import { aiService } from '../services/aiService';

/**
 * Utilidades para testing del sistema de IA
 */
export class AITestingUtils {
  /**
   * Verificar conectividad completa del sistema
   */
  static async runConnectivityTest(): Promise<{
    success: boolean;
    results: Record<string, boolean>;
    errors: string[];
  }> {
    const results: Record<string, boolean> = {};
    const errors: string[] = [];

    console.log('🔍 Iniciando tests de conectividad AI...');

    // Test 1: Health Check
    try {
      const health = await aiService.healthCheck();
      results.healthCheck = health.success;
      console.log('✅ Health Check:', health.status);
    } catch (error) {
      results.healthCheck = false;
      errors.push(`Health Check failed: ${error}`);
      console.error('❌ Health Check falló:', error);
    }

    // Test 2: Capacidades del sistema
    try {
      const capabilities = await aiService.getCapabilities();
      results.capabilities = !!capabilities;
      console.log('✅ Capacidades obtenidas');
    } catch (error) {
      results.capabilities = false;
      errors.push(`Capabilities failed: ${error}`);
      console.error('❌ Capacidades fallaron:', error);
    }

    // Test 3: Análisis rápido
    try {
      const quickAnalysis = await aiService.quickAnalyze(
        'Este es un contenido de prueba para el sistema de IA.',
        'Post de Prueba',
        'tecnologia'
      );
      results.quickAnalysis = quickAnalysis.success;
      console.log('✅ Análisis rápido completado');
    } catch (error) {
      results.quickAnalysis = false;
      errors.push(`Quick Analysis failed: ${error}`);
      console.error('❌ Análisis rápido falló:', error);
    }

    // Test 4: Generación de tags
    try {
      const tags = await aiService.generateTags({
        content: 'Este es un artículo sobre desarrollo web con React y TypeScript.',
        title: 'Desarrollo Web Moderno',
        category: 'tecnologia',
        maxTags: 5
      });
      results.tagGeneration = tags.success;
      console.log('✅ Generación de tags completada');
    } catch (error) {
      results.tagGeneration = false;
      errors.push(`Tag Generation failed: ${error}`);
      console.error('❌ Generación de tags falló:', error);
    }

    // Test 5: Métricas del sistema
    try {
      const metrics = await aiService.getSystemMetrics();
      results.systemMetrics = metrics.success;
      console.log('✅ Métricas del sistema obtenidas');
    } catch (error) {
      results.systemMetrics = false;
      errors.push(`System Metrics failed: ${error}`);
      console.error('❌ Métricas del sistema fallaron:', error);
    }

    const allPassed = Object.values(results).every(Boolean);
    
    console.log('📊 Resultados del test:', results);
    if (allPassed) {
      console.log('🎉 Todos los tests pasaron! Sistema listo para usar.');
    } else {
      console.log('⚠️ Algunos tests fallaron. Revisar errores.');
    }

    return {
      success: allPassed,
      results,
      errors
    };
  }

  /**
   * Test de performance del sistema
   */
  static async runPerformanceTest(): Promise<{
    averageResponseTime: number;
    successfulRequests: number;
    failedRequests: number;
  }> {
    console.log('⚡ Iniciando test de performance...');
    
    const testRequests = 5;
    const results: number[] = [];
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < testRequests; i++) {
      try {
        const startTime = Date.now();
        
        await aiService.quickAnalyze(
          `Contenido de prueba número ${i + 1}. Este es un texto de ejemplo para medir el rendimiento del sistema de análisis de IA.`,
          `Post de Prueba ${i + 1}`,
          'test'
        );
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        results.push(responseTime);
        successful++;
        
        console.log(`✅ Request ${i + 1}: ${responseTime}ms`);
      } catch (error) {
        failed++;
        console.log(`❌ Request ${i + 1}: Failed`);
      }
    }

    const averageResponseTime = results.reduce((a, b) => a + b, 0) / results.length;
    
    console.log(`📊 Performance Results:`);
    console.log(`   Average Response Time: ${averageResponseTime.toFixed(2)}ms`);
    console.log(`   Successful: ${successful}/${testRequests}`);
    console.log(`   Failed: ${failed}/${testRequests}`);

    return {
      averageResponseTime,
      successfulRequests: successful,
      failedRequests: failed
    };
  }

  /**
   * Generar reporte de sistema
   */
  static async generateSystemReport(): Promise<string> {
    console.log('📋 Generando reporte del sistema...');

    const connectivityResults = await this.runConnectivityTest();
    const performanceResults = await this.runPerformanceTest();

    const report = `
# 🤖 REPORTE DEL SISTEMA DE IA
**Fecha**: ${new Date().toLocaleString()}

## 🔍 Tests de Conectividad
${Object.entries(connectivityResults.results)
  .map(([test, passed]) => `- ${test}: ${passed ? '✅' : '❌'}`)
  .join('\n')}

## ⚡ Performance
- **Tiempo promedio de respuesta**: ${performanceResults.averageResponseTime.toFixed(2)}ms
- **Requests exitosos**: ${performanceResults.successfulRequests}
- **Requests fallidos**: ${performanceResults.failedRequests}

## 🚨 Errores Encontrados
${connectivityResults.errors.length > 0 
  ? connectivityResults.errors.map(error => `- ${error}`).join('\n')
  : 'No se encontraron errores.'
}

## 📊 Estado General
**Sistema**: ${connectivityResults.success ? '🟢 Operativo' : '🔴 Con problemas'}
**Rendimiento**: ${performanceResults.averageResponseTime < 3000 ? '🟢 Bueno' : '🟡 Aceptable'}
    `;

    console.log(report);
    return report;
  }
}

/**
 * Hook para testing en componentes React
 */
export const useAITesting = () => {
  const runQuickTest = async () => {
    return await AITestingUtils.runConnectivityTest();
  };

  const runPerformanceTest = async () => {
    return await AITestingUtils.runPerformanceTest();
  };

  const generateReport = async () => {
    return await AITestingUtils.generateSystemReport();
  };

  return {
    runQuickTest,
    runPerformanceTest,
    generateReport
  };
};

export default AITestingUtils;