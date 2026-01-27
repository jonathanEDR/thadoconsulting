/**
 * 🔔 COMPONENTE DE DEMOSTRACIÓN - SISTEMA DE NOTIFICACIONES
 * Página de ejemplo para probar el sistema de notificaciones
 */

import { useNotification } from '../../hooks/useNotification';

export const NotificationDemo = () => {
  const { success, error, warning, info, showNotification } = useNotification();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🔔 Sistema de Notificaciones
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Demostración del sistema de toast notifications con diferentes tipos y configuraciones
          </p>
        </div>

        {/* Grid de ejemplos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Notificaciones básicas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Notificaciones Básicas
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => success('¡Éxito!', 'La operación se completó correctamente')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Success
              </button>
              <button
                onClick={() => error('Error', 'Algo salió mal. Por favor intenta de nuevo')}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Error
              </button>
              <button
                onClick={() => warning('Advertencia', 'Debes completar todos los campos')}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Warning
              </button>
              <button
                onClick={() => info('Información', 'Los cambios se aplicarán en unos minutos')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Info
              </button>
            </div>
          </div>

          {/* Notificaciones con duración personalizada */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Duración Personalizada
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => success('Rápido', 'Esta notificación dura 2 segundos', 2000)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                2 segundos
              </button>
              <button
                onClick={() => info('Normal', 'Esta notificación dura 5 segundos', 5000)}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                5 segundos (default)
              </button>
              <button
                onClick={() => warning('Largo', 'Esta notificación dura 10 segundos', 10000)}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                10 segundos
              </button>
              <button
                onClick={() => showNotification({
                  type: 'info',
                  title: 'Permanente',
                  message: 'Esta notificación no se auto-cierra',
                  duration: 0
                })}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Sin auto-cerrar
              </button>
            </div>
          </div>

          {/* Notificaciones con acciones */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Con Acciones
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => showNotification({
                  type: 'success',
                  title: 'Archivo guardado',
                  message: 'El archivo se guardó correctamente',
                  action: {
                    label: 'Ver archivo',
                    onClick: () => alert('Abriendo archivo...')
                  }
                })}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Con acción - Success
              </button>
              <button
                onClick={() => showNotification({
                  type: 'error',
                  title: 'Error al eliminar',
                  message: 'No se pudo eliminar el elemento',
                  action: {
                    label: 'Reintentar',
                    onClick: () => alert('Reintentando...')
                  },
                  duration: 7000
                })}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Con acción - Error
              </button>
            </div>
          </div>

          {/* Notificaciones múltiples */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Múltiples Notificaciones
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  success('Notificación 1', 'Primera notificación');
                  setTimeout(() => info('Notificación 2', 'Segunda notificación'), 500);
                  setTimeout(() => warning('Notificación 3', 'Tercera notificación'), 1000);
                }}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Múltiples en secuencia
              </button>
              <button
                onClick={() => {
                  for (let i = 1; i <= 5; i++) {
                    setTimeout(() => {
                      info(`Notificación ${i}`, `Mensaje número ${i}`, 3000);
                    }, i * 300);
                  }
                }}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                5 notificaciones
              </button>
            </div>
          </div>

        </div>

        {/* Información de uso */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📚 Cómo usar en tus componentes
          </h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { useNotification } from '../../hooks/useNotification';

const MyComponent = () => {
  const { success, error, warning, info } = useNotification();

  const handleSave = async () => {
    try {
      await api.save();
      success('¡Guardado!', 'Los cambios se guardaron');
    } catch (err) {
      error('Error', 'No se pudo guardar');
    }
  };

  return <button onClick={handleSave}>Guardar</button>;
};`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;
