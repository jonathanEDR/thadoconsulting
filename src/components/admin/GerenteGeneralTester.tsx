/**
 * GerenteGeneral System Tester
 * Componente para testing interactivo de coordinación y routing
 */

import React, { useState } from 'react';
import { Play, Copy, Trash2, Clock, CheckCircle, Brain } from 'lucide-react';
import { useGerenteGeneralTesting } from '../../hooks/useGerenteGeneral';

export const GerenteGeneralTester: React.FC = () => {
  const { testHistory, runTest, clearHistory } = useGerenteGeneralTesting();
  const [command, setCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleTest = async () => {
    if (!command.trim()) return;

    setIsLoading(true);
    try {
      await runTest(command);
    } finally {
      setIsLoading(false);
      setCommand('');
    }
  };

  const handleCopyCommand = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const presetCommands = [
    {
      category: 'Coordinación Multi-Agente',
      commands: [
        'analizar servicio para crear blog-publicacion',
        'crear blog del servicio de economía',
        'necesito crear un blog-publicacion sobre el servicio'
      ]
    },
    {
      category: 'Agentes Individuales',
      commands: [
        'crear un post sobre marketing digital',
        'analiza el servicio de desarrollo web',
        'optimiza el SEO de la página'
      ]
    },
    {
      category: 'Casos de Uso Complejos',
      commands: [
        'quiero que analices mi servicio y crees un artículo optimizado',
        'necesito mejorar la descripción del servicio y posicionarlo en google',
        'crea contenido blog basado en mis servicios'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Brain className="text-purple-600" size={24} />
          Testing del Sistema GerenteGeneral
        </h3>

        <div className="space-y-4">
          {/* Command Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ingresa un Comando
            </label>
            <div className="flex gap-2">
              <textarea
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTest();
                  }
                }}
                placeholder="Ejemplo: 'analizar servicio para crear blog-publicacion'&#10;Presiona Shift+Enter para nueva línea, Enter para enviar"
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50"
                rows={3}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleTest}
              disabled={isLoading || !command.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Play size={18} />
              {isLoading ? 'Testando...' : 'Ejecutar Test'}
            </button>

            <button
              onClick={clearHistory}
              disabled={testHistory.length === 0 || isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Trash2 size={18} />
              Limpiar Historial
            </button>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              💡 <strong>Tip:</strong> Prueba comandos que contengan palabras clave como "blog", "servicio", "seo" o combinaciones como "crear blog del servicio" para ver la coordinación multi-agente en acción.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Commands */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          📋 Comandos de Ejemplo
        </h3>

        <div className="space-y-4">
          {presetCommands.map((preset, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {preset.category}
              </h4>
              <div className="grid gap-2">
                {preset.commands.map((cmd, cmdIdx) => (
                  <button
                    key={cmdIdx}
                    onClick={() => setCommand(cmd)}
                    className="text-left px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    "{cmd}"
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Results */}
      {testHistory.length > 0 && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={20} />
            Historial de Testing ({testHistory.length})
          </h3>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {testHistory.map((test, idx) => {
              const isCoordination = test.result?.data?.agent === 'MULTI_AGENT';
              const isSuccess = test.result?.success;

              return (
                <div
                  key={idx}
                  className={`p-4 border rounded-lg transition-colors ${
                    isSuccess
                      ? isCoordination
                        ? 'border-purple-200 dark:border-purple-900/40 bg-purple-50 dark:bg-purple-900/10'
                        : 'border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-900/10'
                      : 'border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {isSuccess ? (
                          isCoordination ? (
                            <span className="px-2 py-1 text-xs font-bold bg-purple-200 dark:bg-purple-900/40 text-purple-900 dark:text-purple-300 rounded">
                              MULTI-AGENT 🔄
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-bold bg-green-200 dark:bg-green-900/40 text-green-900 dark:text-green-300 rounded">
                              INDIVIDUAL ✓
                            </span>
                          )
                        ) : (
                          <span className="px-2 py-1 text-xs font-bold bg-red-200 dark:bg-red-900/40 text-red-900 dark:text-red-300 rounded">
                            ERROR ✗
                          </span>
                        )}

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(test.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      {/* Command */}
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Comando: "{test.command}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyCommand(test.command, idx)}
                      className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      title="Copiar comando"
                    >
                      {copiedIndex === idx ? (
                        <CheckCircle size={18} className="text-green-600" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>

                  {/* Result Details */}
                  {isSuccess && test.result.data && (
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-gray-100 dark:bg-gray-900/50 rounded">
                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Agente Detectado: {test.result.data.agent}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Confianza: {Math.round((test.result.data.confidence || 0) * 100)}%
                        </p>
                      </div>

                      {test.result.data.reasoning && (
                        <div className="p-3 bg-gray-100 dark:bg-gray-900/50 rounded">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Razonamiento:
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {test.result.data.reasoning}
                          </p>
                        </div>
                      )}

                      {isCoordination && test.result.data.coordinationType && (
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded border border-purple-200 dark:border-purple-800">
                          <p className="text-xs font-medium text-purple-900 dark:text-purple-300">
                            Tipo de Coordinación: {test.result.data.coordinationType}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {!isSuccess && test.result.error && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
                      <p className="text-xs font-medium text-red-900 dark:text-red-300">
                        Error: {test.result.error}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      {testHistory.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {testHistory.length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Tests</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {testHistory.filter(t => t.result?.data?.agent === 'MULTI_AGENT').length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Coordinaciones</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {testHistory.filter(t => t.result?.success).length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Exitosos</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {testHistory.filter(t => !t.result?.success).length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Errores</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenteGeneralTester;
