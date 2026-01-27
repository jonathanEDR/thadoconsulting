import { useAIService } from '../hooks/useAIService';

/**
 * Utilidades para testing del sistema de IA con autenticación Clerk
 */
export class AITestingUtilsWithAuth {
  private aiService: ReturnType<typeof useAIService>;

  constructor(aiService: ReturnType<typeof useAIService>) {
    this.aiService = aiService;
  }

  /**
   * Verificar conectividad completa del sistema con autenticación
   */
  async runConnectivityTest(): Promise<{
    success: boolean;
    results: Record<string, boolean>;
    errors: string[];
  }> {
    const results: Record<string, boolean> = {};
    const errors: string[] = [];

    console.log('🔍 Iniciando tests de conectividad AI con autenticación...');

    // Verificar autenticación primero
    if (!this.aiService.isAuthenticated) {
      errors.push('Usuario no está autenticado con Clerk');
      return {
        success: false,
        results: { authentication: false },
        errors
      };
    }

    console.log('✅ Usuario autenticado con Clerk');

    // Test 1: Health Check
    try {
      const health = await this.aiService.healthCheck();
      results.healthCheck = health.success;
      console.log('✅ Health Check:', health.status);
    } catch (error) {
      results.healthCheck = false;
      errors.push(`Health Check failed: ${error}`);
      console.error('❌ Health Check falló:', error);
    }

    // Test 2: Capacidades del sistema
    try {
      const capabilities = await this.aiService.getCapabilities();
      results.capabilities = !!capabilities;
      console.log('✅ Capacidades obtenidas');
    } catch (error) {
      results.capabilities = false;
      errors.push(`Capabilities failed: ${error}`);
      console.error('❌ Capacidades fallaron:', error);
    }

    // Test 3: Análisis rápido (CON AUTENTICACIÓN)
    try {
      const quickAnalysis = await this.aiService.quickAnalyze(
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

    // Test 4: Generación de tags (CON AUTENTICACIÓN)
    try {
      const tags = await this.aiService.generateTags({
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

    // Test 5: Métricas del sistema (CON AUTENTICACIÓN)
    try {
      const metrics = await this.aiService.getSystemMetrics();
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
   * Test de performance del sistema con autenticación
   */
  async runPerformanceTest(): Promise<{
    averageResponseTime: number;
    successfulRequests: number;
    failedRequests: number;
  }> {
    console.log('⚡ Iniciando test de performance con autenticación...');
    
    if (!this.aiService.isAuthenticated) {
      console.error('❌ Usuario no autenticado, no se puede ejecutar test de performance');
      return {
        averageResponseTime: 0,
        successfulRequests: 0,
        failedRequests: 5
      };
    }
    
    const testRequests = 5;
    const results: number[] = [];
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < testRequests; i++) {
      try {
        const startTime = Date.now();
        
        await this.aiService.quickAnalyze(
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
        console.log(`❌ Request ${i + 1}: Failed - ${error}`);
      }
    }

    const averageResponseTime = results.length > 0 
      ? results.reduce((a, b) => a + b, 0) / results.length 
      : 0;
    
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
   * Generar reporte de sistema con autenticación
   */
  async generateSystemReport(): Promise<string> {
    console.log('📋 Generando reporte del sistema con autenticación...');

    const connectivityResults = await this.runConnectivityTest();
    const performanceResults = await this.runPerformanceTest();

    const report = `
# 🤖 REPORTE DEL SISTEMA DE IA (CON AUTENTICACIÓN)
**Fecha**: ${new Date().toLocaleString()}

## 🔐 Estado de Autenticación
**Clerk Authentication**: ${this.aiService.isAuthenticated ? '✅ Conectado' : '❌ No autenticado'}

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
**Autenticación**: ${this.aiService.isAuthenticated ? '🟢 OK' : '🔴 Error'}
    `;

    console.log(report);
    return report;
  }
}

/**
 * Hook para testing con autenticación en componentes React
 */
export const useAITestingWithAuth = () => {
  const aiService = useAIService();
  const testingUtils = new AITestingUtilsWithAuth(aiService);

  const runQuickTest = async () => {
    return await testingUtils.runConnectivityTest();
  };

  const runPerformanceTest = async () => {
    return await testingUtils.runPerformanceTest();
  };

  const generateReport = async () => {
    return await testingUtils.generateSystemReport();
  };

  const runAdvancedSystemTest = async () => {
    try {
      console.log('🚀 Ejecutando test completo del sistema avanzado...');
      const result = await aiService.runAdvancedSystemTest();
      console.log('✅ Test avanzado completado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error en test avanzado:', error);
      throw error;
    }
  };

  const runAdvancedHealthCheck = async () => {
    try {
      console.log('🔍 Ejecutando health check avanzado...');
      const result = await aiService.advancedHealthCheck();
      console.log('✅ Health check avanzado completado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error en health check avanzado:', error);
      throw error;
    }
  };

  return {
    runQuickTest,
    runPerformanceTest,
    generateReport,
    runAdvancedSystemTest,
    runAdvancedHealthCheck,
    isAuthenticated: aiService.isAuthenticated,
    aiService
  };
};

export default AITestingUtilsWithAuth;