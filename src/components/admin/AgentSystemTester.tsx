import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  RefreshCw,
  Clock
} from 'lucide-react';

// ===================================================
// COMPONENTE PARA TESTING DEL SISTEMA DE AGENTES
// ===================================================

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
  data?: any;
}

const AgentSystemTester = () => {
  const { getToken } = useAuth();
  
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const runSystemTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    setCurrentTest('Iniciando tests...');

    const tests = [
      {
        name: 'Conectividad API',
        endpoint: '/api/agents/health',
        expectedStatus: 200
      },
      {
        name: 'Sistema Avanzado',
        endpoint: '/api/agents/testing/health-advanced',
        expectedStatus: 200
      },
      {
        name: 'Métricas del Sistema',
        endpoint: '/api/agents/testing/system-metrics',
        expectedStatus: 200
      },
      {
        name: 'Test Completo de Agentes',
        endpoint: '/api/agents/testing/test-advanced-agents',
        expectedStatus: 200
      }
    ];

    const results: TestResult[] = [];

    try {
      const token = await getToken();
      
      for (const test of tests) {
        setCurrentTest(test.name);
        const startTime = Date.now();
        
        try {
          const response = await fetch(test.endpoint, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const duration = Date.now() - startTime;
          const data = await response.json();
          
          if (response.status === test.expectedStatus) {
            results.push({
              name: test.name,
              status: 'success',
              message: `✅ Test pasado correctamente (${response.status})`,
              duration,
              data
            });
          } else {
            results.push({
              name: test.name,
              status: 'warning',
              message: `⚠️ Status inesperado: ${response.status}`,
              duration,
              data
            });
          }
        } catch (error) {
          results.push({
            name: test.name,
            status: 'error',
            message: `❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
            duration: Date.now() - startTime
          });
        }
        
        // Actualizar progresivamente
        setTestResults([...results]);
        
        // Pequeña pausa entre tests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
    } catch (error) {
      results.push({
        name: 'Sistema General',
        status: 'error',
        message: `❌ Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
      setTestResults(results);
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600" size={16} />;
      case 'error':
        return <XCircle className="text-red-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TestTube className="text-blue-600" />
            Test del Sistema de Agentes
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Ejecuta tests completos para verificar el funcionamiento del sistema
          </p>
        </div>
        
        <button
          onClick={runSystemTest}
          disabled={isRunning}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Ejecutando...
            </>
          ) : (
            <>
              <Play size={16} />
              Ejecutar Tests
            </>
          )}
        </button>
      </div>

      {/* Estado Actual */}
      {isRunning && currentTest && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <RefreshCw size={16} className="animate-spin text-blue-600" />
            <span className="text-blue-800 font-medium">Ejecutando: {currentTest}</span>
          </div>
        </div>
      )}

      {/* Resultados */}
      {testResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 mb-3">
            Resultados de Tests ({testResults.length})
          </h3>
          
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${getStatusColor(result.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h4 className="font-medium">{result.name}</h4>
                    <p className="text-sm mt-1">{result.message}</p>
                    {result.duration && (
                      <p className="text-xs mt-1 opacity-75">
                        Tiempo: {result.duration}ms
                      </p>
                    )}
                  </div>
                </div>
                
                {result.data && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                      Ver datos
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}
          
          {!isRunning && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-700">
                <strong>Resumen:</strong>
                <span className="ml-2">
                  {testResults.filter(r => r.status === 'success').length} éxitos,
                </span>
                <span className="ml-1">
                  {testResults.filter(r => r.status === 'warning').length} advertencias,
                </span>
                <span className="ml-1">
                  {testResults.filter(r => r.status === 'error').length} errores
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estado vacío */}
      {testResults.length === 0 && !isRunning && (
        <div className="text-center py-8 text-gray-500">
          <TestTube size={48} className="mx-auto mb-4 text-gray-400" />
          <p>No hay resultados de tests</p>
          <p className="text-sm mt-1">Ejecuta los tests para verificar el sistema</p>
        </div>
      )}
    </div>
  );
};

export default AgentSystemTester;