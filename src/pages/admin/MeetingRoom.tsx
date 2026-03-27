import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useClerk } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SERSI_APP_URL = 'https://scmeet.vercel.app';

interface SersiSpace {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  settings?: {
    allowGuests?: boolean;
    maxCapacity?: number;
  };
}

interface SersiConfig {
  configured: boolean;
  source: string | null;
  apiKey: string | null;
  apiSecret: string | null;
  updatedAt: string | null;
  hasEnvVars: boolean;
}

export default function MeetingRoom() {
  const { user, canAccessAdmin } = useAuth();
  const { session } = useClerk();
  const [spaces, setSpaces] = useState<SersiSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowOpen, setWindowOpen] = useState(false);
  const popupRef = useRef<Window | null>(null);

  // Config state (admin only)
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<SersiConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const [configSuccess, setConfigSuccess] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiSecretInput, setApiSecretInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  const getAuthToken = useCallback(async () => {
    const authToken = await session?.getToken();
    if (!authToken) throw new Error('No se pudo obtener el token de autenticacion');
    return authToken;
  }, [session]);

  // Cargar espacios disponibles
  const loadSpaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNotConfigured(false);

      const authToken = await getAuthToken();
      const response = await fetch(`${API_URL}/meeting/spaces`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      const data = await response.json();

      if (!data.success) {
        // Si no esta configurado o las credenciales son invalidas, mostrar panel de config para admins
        if (
          (response.status === 500 && data.message?.includes('no configurada')) ||
          (response.status === 502)
        ) {
          setNotConfigured(true);
          if (canAccessAdmin) setShowConfig(true);
          if (response.status === 502) {
            setError('Las credenciales API de SERSI son invalidas o han expirado. Actualiza la configuracion.');
          }
        } else {
          setError(data.message || 'Error al obtener espacios');
        }
        return;
      }

      setSpaces(data.data || []);
    } catch (err: any) {
      console.error('Error loading spaces:', err);
      setError(err.message || 'Error de conexion');
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, canAccessAdmin]);

  // Cargar configuracion (admin only)
  const loadConfig = useCallback(async () => {
    try {
      setConfigLoading(true);
      setConfigError(null);

      const authToken = await getAuthToken();
      const response = await fetch(`${API_URL}/meeting/config`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
      }
    } catch (err: any) {
      setConfigError('Error al cargar configuracion');
    } finally {
      setConfigLoading(false);
    }
  }, [getAuthToken]);

  // Guardar configuracion
  const saveConfig = useCallback(async () => {
    if (!apiKeyInput.trim() || !apiSecretInput.trim()) {
      setConfigError('Ambos campos son requeridos');
      return;
    }

    try {
      setSaving(true);
      setConfigError(null);
      setConfigSuccess(null);

      const authToken = await getAuthToken();
      const response = await fetch(`${API_URL}/meeting/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          apiKey: apiKeyInput.trim(),
          apiSecret: apiSecretInput.trim()
        })
      });

      const data = await response.json();

      if (!data.success) {
        setConfigError(data.message || 'Error al guardar');
        return;
      }

      setConfigSuccess('Configuracion guardada correctamente');
      setApiKeyInput('');
      setApiSecretInput('');
      setNotConfigured(false);

      // Recargar config y espacios
      await loadConfig();
      await loadSpaces();

      setTimeout(() => setConfigSuccess(null), 3000);
    } catch (err: any) {
      setConfigError('Error de conexion al guardar');
    } finally {
      setSaving(false);
    }
  }, [apiKeyInput, apiSecretInput, getAuthToken, loadConfig, loadSpaces]);

  // Eliminar configuracion de DB
  const deleteConfig = useCallback(async () => {
    try {
      setSaving(true);
      setConfigError(null);

      const authToken = await getAuthToken();
      const response = await fetch(`${API_URL}/meeting/config`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      const data = await response.json();
      if (data.success) {
        setConfigSuccess('Configuracion eliminada');
        await loadConfig();
        await loadSpaces();
        setTimeout(() => setConfigSuccess(null), 3000);
      }
    } catch (err: any) {
      setConfigError('Error al eliminar configuracion');
    } finally {
      setSaving(false);
    }
  }, [getAuthToken, loadConfig, loadSpaces]);

  // Abrir la sala en una ventana emergente
  const openSpace = useCallback((spaceId: string) => {
    const url = `${SERSI_APP_URL}/join/${spaceId}`;
    const width = Math.min(1200, window.screen.availWidth - 100);
    const height = Math.min(800, window.screen.availHeight - 100);
    const left = Math.round((window.screen.availWidth - width) / 2);
    const top = Math.round((window.screen.availHeight - height) / 2);

    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.focus();
      return;
    }

    const popup = window.open(
      url,
      'sersi-meeting-room',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,status=no,location=yes`
    );

    if (popup) {
      popupRef.current = popup;
      setWindowOpen(true);
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          popupRef.current = null;
          setWindowOpen(false);
        }
      }, 1000);
    }
  }, []);

  // Copiar enlace de invitacion
  const copyInviteLink = useCallback((spaceId: string) => {
    const url = `${SERSI_APP_URL}/join/${spaceId}`;
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById(`copy-btn-${spaceId}`);
      if (btn) {
        btn.textContent = 'Copiado!';
        setTimeout(() => { btn.textContent = 'Copiar enlace'; }, 2000);
      }
    });
  }, []);

  useEffect(() => {
    loadSpaces();
  }, [loadSpaces]);

  // Cargar config cuando se abre el panel
  useEffect(() => {
    if (showConfig && canAccessAdmin && !config) {
      loadConfig();
    }
  }, [showConfig, canAccessAdmin, config, loadConfig]);

  useEffect(() => {
    return () => {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current = null;
      }
    };
  }, []);

  // ─── Panel de Configuracion (Admin) ───
  const renderConfigPanel = () => {
    if (!canAccessAdmin || !showConfig) return null;

    return (
      <div className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">Configuracion de API</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {config?.configured
                  ? `Conectado (${config.source === 'database' ? 'Base de datos' : 'Variables de entorno'})`
                  : 'No configurada'}
              </p>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
          {configLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-xs text-gray-500 mt-2">Cargando...</p>
            </div>
          ) : (
            <>
              {/* Estado actual */}
              {config && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Estado:</span>
                    <span className={config.configured ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-500 font-medium'}>
                      {config.configured ? 'Configurada' : 'No configurada'}
                    </span>
                  </div>
                  {config.configured && (
                    <>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Fuente:</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {config.source === 'database' ? 'Base de datos' : 'Variables de entorno'}
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500 dark:text-gray-400">API Key:</span>
                        <span className="font-mono text-gray-700 dark:text-gray-300">{config.apiKey}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">API Secret:</span>
                        <span className="font-mono text-gray-700 dark:text-gray-300">{config.apiSecret}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Formulario */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="sk_live_..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    API Secret
                  </label>
                  <input
                    type="password"
                    value={apiSecretInput}
                    onChange={(e) => setApiSecretInput(e.target.value)}
                    placeholder="Secret key..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Mensajes */}
                {configError && (
                  <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">{configError}</p>
                )}
                {configSuccess && (
                  <p className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">{configSuccess}</p>
                )}

                {/* Botones */}
                <div className="flex gap-2">
                  <button
                    onClick={saveConfig}
                    disabled={saving || !apiKeyInput.trim() || !apiSecretInput.trim()}
                    className="flex-1 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
                  >
                    {saving ? 'Validando...' : 'Guardar claves'}
                  </button>
                  {config?.source === 'database' && (
                    <button
                      onClick={deleteConfig}
                      disabled={saving}
                      className="px-3 py-2 text-sm border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Las claves se validan contra la API de SERSI antes de guardarse.
                  {config?.hasEnvVars && ' Si eliminas las claves de la base de datos, se usaran las variables de entorno.'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // ─── Estado: Cargando ───
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-purple-600 dark:border-purple-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Cargando salas de reuniones...
          </p>
        </div>
      </div>
    );
  }

  // ─── Estado: No configurada ───
  if (notConfigured) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sala de Reuniones</h1>
        </div>

        {canAccessAdmin ? (
          <>
            {renderConfigPanel()}
            <div className="text-center p-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <svg className="w-12 h-12 mx-auto mb-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.999L13.732 4.001c-.77-1.333-2.694-1.333-3.464 0L3.34 16.001c-.77 1.332.192 2.999 1.732 2.999z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Configuracion requerida
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ingresa tus claves API de SERSI en el panel de configuracion de arriba para activar la sala de reuniones.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Sala de reuniones no disponible
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Un administrador necesita configurar la integracion con SERSI para habilitar esta funcion.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ─── Estado: Error ───
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sala de Reuniones</h1>
        </div>
        {canAccessAdmin && renderConfigPanel()}
        {canAccessAdmin && !showConfig && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowConfig(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurar API
            </button>
          </div>
        )}
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.999L13.732 4.001c-.77-1.333-2.694-1.333-3.464 0L3.34 16.001c-.77 1.332.192 2.999 1.732 2.999z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No se pudo conectar
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={loadSpaces}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Estado: No hay espacios ───
  if (spaces.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sala de Reuniones</h1>
        </div>
        {canAccessAdmin && renderConfigPanel()}
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center max-w-lg mx-auto p-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No hay espacios configurados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Para usar la sala de reuniones, primero necesitas crear un espacio virtual
              en tu panel de SERSI. Una vez creado, aparecera aqui automaticamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`${SERSI_APP_URL}/dashboard`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ir a SERSI Dashboard
              </a>
              <button
                onClick={loadSpaces}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Estado: Mostrar espacios disponibles ───
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sala de Reuniones
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user?.firstName ? `Hola ${user.firstName}` : 'Bienvenido'} — selecciona un espacio para ingresar
            </p>
          </div>
          <div className="flex items-center gap-2">
            {canAccessAdmin && (
              <button
                onClick={() => setShowConfig(!showConfig)}
                className={`p-2 rounded-lg transition-colors ${
                  showConfig
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Configuracion"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
            <button
              onClick={loadSpaces}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Actualizar espacios"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Panel de configuracion (admin) */}
      {renderConfigPanel()}

      {/* Notificacion: Ventana abierta */}
      {windowOpen && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse flex-shrink-0"></div>
          <p className="text-sm text-green-700 dark:text-green-300 flex-1">
            La sala de reuniones esta abierta en otra ventana.
          </p>
          <button
            onClick={() => popupRef.current?.focus()}
            className="text-sm font-medium text-green-700 dark:text-green-300 hover:underline"
          >
            Ir a la ventana
          </button>
        </div>
      )}

      {/* Grid de espacios */}
      <div className="grid gap-4 sm:grid-cols-2">
        {spaces.map((space) => (
          <div
            key={space._id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-24 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 relative flex items-end p-4">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <h3 className="text-lg font-semibold text-white">{space.name}</h3>
                {space.description && (
                  <p className="text-sm text-white/80 line-clamp-1">{space.description}</p>
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${space.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  {space.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
                {space.settings?.allowGuests && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Invitados permitidos
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openSpace(space._id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Entrar
                </button>
                {space.settings?.allowGuests && (
                  <button
                    id={`copy-btn-${space._id}`}
                    onClick={() => copyInviteLink(space._id)}
                    className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    title="Copiar enlace de invitacion"
                  >
                    Copiar enlace
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-900 dark:text-white mb-1">Sala de reuniones virtual con SERSI</p>
            <p>
              Al hacer clic en "Entrar", la oficina virtual se abrira en una nueva ventana.
              Podras compartir el enlace de invitacion con tus clientes para que se unan como invitados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
