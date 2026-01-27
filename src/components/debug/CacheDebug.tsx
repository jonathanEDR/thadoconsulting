/**
 * 🔍 Debug de Cache Público - Versión Mejorada
 * 
 * Muestra información detallada del cache en páginas públicas para debugging
 * Se puede activar/desactivar desde localStorage con: localStorage.setItem('cache-debug', 'true')
 * 
 * @author Web Scuti
 * @version 2.1.0
 */

import React, { useEffect, useState } from 'react';

interface CacheRequest {
  id: string;
  url: string;
  status: 'ACTIVE' | 'DESACTIVADO';
  response: 'HIT' | 'MISS' | 'UNKNOWN';
  httpStatus: number;
  maxAge?: string | null;
  hitRate?: string | null;
  reason?: string | null;
  timestamp: string;
  duration: number;
  headers: Record<string, string>;
}

interface CacheDebugProps {
  className?: string;
}

export const CacheDebug: React.FC<CacheDebugProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [requestHistory, setRequestHistory] = useState<CacheRequest[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Verificar si el debug está habilitado
  useEffect(() => {
    const debugEnabled = localStorage.getItem('cache-debug') === 'true';
    setIsVisible(debugEnabled);
  }, []);

  // Interceptar respuestas para extraer headers de cache
  useEffect(() => {
    if (!isVisible) return;

    console.log('🔍 Cache Debug Monitor activado');

    // Interceptar fetch global
    const originalFetch = window.fetch;
    
    window.fetch = async function(...args: any[]) {
      const startTime = performance.now();
      let response: any;
      
      try {
        response = await originalFetch.apply(this, args as Parameters<typeof originalFetch>);
      } catch (error) {
        throw error;
      }

      const duration = Math.round(performance.now() - startTime);
      
      // Solo procesar respuestas de la API de servicios
      let url = '';
      if (typeof args[0] === 'string') {
        url = args[0];
      } else if (args[0] instanceof Request) {
        url = args[0].url;
      }
      
      // Filtrar requests del cache
      if (url.includes('/api/servicios') && !url.includes('/cache/') && !url.includes('/admin')) {
        const cacheStatus = response.headers.get('X-Cache-Status');
        const cacheType = response.headers.get('X-Cache-Type');
        const maxAge = response.headers.get('X-Cache-MaxAge');
        const hitRate = response.headers.get('X-Cache-Hit-Rate');
        const cacheResponse = response.headers.get('X-Cache-Response');
        const cacheReason = response.headers.get('X-Cache-Reason');
        const etag = response.headers.get('ETag');
        const cacheControl = response.headers.get('Cache-Control');
        const lastModified = response.headers.get('Last-Modified');
        
        // Registrar si hay información de cache
        if (cacheStatus || cacheResponse || response.status === 304) {
          const request: CacheRequest = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: cacheStatus as 'ACTIVE' | 'DESACTIVADO' || 'ACTIVE',
            response: (cacheResponse as 'HIT' | 'MISS') || (response.status === 304 ? 'HIT' : 'MISS'),
            httpStatus: response.status,
            maxAge: maxAge,
            hitRate: hitRate,
            reason: cacheReason,
            url: url,
            timestamp: new Date().toLocaleTimeString('es-ES', { hour12: false }),
            duration,
            headers: {
              'X-Cache-Status': cacheStatus || 'N/A',
              'X-Cache-Type': cacheType || 'N/A',
              'Cache-Control': cacheControl || 'N/A',
              'ETag': etag || 'N/A',
              'Last-Modified': lastModified || 'N/A',
              'X-Cache-Hit-Rate': hitRate || 'N/A',
              'HTTP-Status': `${response.status}`,
              'Response-Time': `${duration}ms`
            }
          };
          
          setRequestHistory(prev => [request, ...prev.slice(0, 14)]);
          
          // Log en consola
          const emoji = request.response === 'HIT' ? '🎯' : '💾';
          console.log(
            `%c${emoji} [CACHE] ${request.response} - ${request.status}`,
            request.response === 'HIT' 
              ? 'color: #22c55e; font-weight: bold; font-size: 12px;'
              : 'color: #f59e0b; font-weight: bold; font-size: 12px;'
          );
          console.table({
            'URL': url.split('/api/servicios')[1]?.split('?')[0],
            'Respuesta': request.response,
            'Estado': request.status,
            'HTTP': response.status,
            'Duración': `${duration}ms`,
            'TTL': maxAge ? `${maxAge}s` : 'N/A'
          });
        }
      }
      
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [isVisible]);

  // Calcular estadísticas
  const stats = {
    total: requestHistory.length,
    hits: requestHistory.filter(r => r.response === 'HIT').length,
    misses: requestHistory.filter(r => r.response === 'MISS').length,
    hitRate: requestHistory.length > 0 
      ? ((requestHistory.filter(r => r.response === 'HIT').length / requestHistory.length) * 100).toFixed(1)
      : '0'
  };

  if (!isVisible) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <button
          onClick={() => localStorage.setItem('cache-debug', 'true')}
          className="px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
          title="Activar debug de cache"
        >
          🔍 Debug
        </button>
      </div>
    );
  }

  const lastRequest = requestHistory[0];

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className} max-w-sm`}>
      <div className="bg-black/95 text-white rounded-lg shadow-2xl overflow-hidden border border-purple-500/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-black px-4 py-3 flex items-center justify-between border-b border-purple-500/20">
          <span className="font-bold text-sm">🔍 Cache Monitor</span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded"
            >
              {showHistory ? '📊' : '📈'}
            </button>
            <button
              onClick={() => localStorage.removeItem('cache-debug')}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Stats */}
        {requestHistory.length > 0 && (
          <div className="bg-gray-900/50 px-4 py-2 text-xs grid grid-cols-4 gap-2 border-b border-purple-500/10">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{stats.total}</div>
              <div className="text-gray-400">Reqs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{stats.hits}</div>
              <div className="text-gray-400">HIT</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">{stats.misses}</div>
              <div className="text-gray-400">MISS</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">{stats.hitRate}%</div>
              <div className="text-gray-400">Tasa</div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {showHistory && requestHistory.length > 0 ? (
            requestHistory.map((request) => (
              <div
                key={request.id}
                className="border-b border-gray-700 hover:bg-gray-800/50 cursor-pointer p-3 text-xs"
                onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={request.response === 'HIT' ? 'text-green-400 font-bold' : 'text-yellow-400 font-bold'}>
                    {request.response === 'HIT' ? '🎯 HIT' : '💾 MISS'}
                  </span>
                  <span className="text-gray-400">{request.duration}ms</span>
                </div>
                <div className="text-gray-400">{request.url.split('/api/servicios')[1]?.split('?')[0]}</div>
                
                {expandedId === request.id && (
                  <div className="mt-2 pt-2 border-t border-gray-600 text-xs space-y-1">
                    <div>HTTP: <span className="text-blue-300">{request.httpStatus}</span></div>
                    <div>TTL: <span className="text-purple-300">{request.maxAge || 'N/A'}</span></div>
                    <div>Status: <span className="text-green-300">{request.status}</span></div>
                  </div>
                )}
              </div>
            ))
          ) : lastRequest ? (
            <div className="px-4 py-3 text-xs">
              <div className="text-gray-400 mb-2">📊 Última Solicitud:</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={lastRequest.response === 'HIT' ? 'text-green-400 font-bold' : 'text-yellow-400 font-bold'}>
                    {lastRequest.response === 'HIT' ? '🎯 HIT' : '💾 MISS'}
                  </span>
                  <span className="text-gray-400">{lastRequest.duration}ms</span>
                </div>
                <div className="text-gray-300">TTL: <span className="text-purple-300">{lastRequest.maxAge || 'N/A'}</span></div>
                <div className="text-gray-300">Status: <span className="text-green-300">{lastRequest.status}</span></div>
                <div className="text-gray-400 mt-2 break-all">{lastRequest.url.split('/api/servicios')[1]}</div>
              </div>
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-gray-400">⏳ Esperando requests...</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-900/50 border-t border-purple-500/10 text-xs text-gray-500">
          Clica 📊 para historial
        </div>
      </div>
    </div>
  );
};

export default CacheDebug;
