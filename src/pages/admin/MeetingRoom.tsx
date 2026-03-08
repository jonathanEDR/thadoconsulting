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

export default function MeetingRoom() {
  const { user } = useAuth();
  const { session } = useClerk();
  const [spaces, setSpaces] = useState<SersiSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowOpen, setWindowOpen] = useState(false);
  const popupRef = useRef<Window | null>(null);

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

      const authToken = await getAuthToken();
      const response = await fetch(`${API_URL}/meeting/spaces`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Error al obtener espacios');
        return;
      }

      setSpaces(data.data || []);
    } catch (err: any) {
      console.error('Error loading spaces:', err);
      setError(err.message || 'Error de conexion');
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  // Abrir la sala en una ventana emergente
  const openSpace = useCallback((spaceId: string) => {
    const url = `${SERSI_APP_URL}/join/${spaceId}`;
    const width = Math.min(1200, window.screen.availWidth - 100);
    const height = Math.min(800, window.screen.availHeight - 100);
    const left = Math.round((window.screen.availWidth - width) / 2);
    const top = Math.round((window.screen.availHeight - height) / 2);

    // Cerrar ventana anterior si existe
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

      // Monitorear si se cierra la ventana
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
      // Feedback visual temporal
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

  // Limpiar referencia al desmontar
  useEffect(() => {
    return () => {
      if (popupRef.current && !popupRef.current.closed) {
        // No cerrar la ventana automaticamente - dejar que el usuario la cierre
        popupRef.current = null;
      }
    };
  }, []);

  // Estado: Cargando
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

  // Estado: Error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
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
    );
  }

  // Estado: No hay espacios
  if (spaces.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
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
    );
  }

  // Estado: Mostrar espacios disponibles
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sala de Reuniones
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user?.firstName ? `Hola ${user.firstName}` : 'Bienvenido'} — selecciona un espacio para ingresar
            </p>
          </div>
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
            {/* Espacio header con gradiente */}
            <div className="h-24 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 relative flex items-end p-4">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <h3 className="text-lg font-semibold text-white">
                  {space.name}
                </h3>
                {space.description && (
                  <p className="text-sm text-white/80 line-clamp-1">
                    {space.description}
                  </p>
                )}
              </div>
            </div>

            {/* Info y acciones */}
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

      {/* Footer con info */}
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
