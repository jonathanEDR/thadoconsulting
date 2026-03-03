import React, { useState } from 'react';
import { Button } from '../UI';
import type { PresentacionLibro, RegistrarLibroData, CatalogoLibros } from '../../types/contabilidad';
import { ESTADO_LIBRO_CONFIG } from '../../types/contabilidad';

interface LibroFormModalProps {
  clienteId: string;
  periodo: string;
  libro?: PresentacionLibro;
  catalogo: CatalogoLibros;
  onClose: () => void;
  onSubmit: (data: RegistrarLibroData) => Promise<void>;
  librosDisponibles: string[];
}

/**
 * 📚 Modal para registrar presentación de libro electrónico
 */
const LibroFormModal: React.FC<LibroFormModalProps> = ({
  clienteId,
  periodo,
  libro,
  catalogo,
  onClose,
  onSubmit,
  librosDisponibles
}) => {
  const isEditing = !!libro;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [codigoLibro, setCodigoLibro] = useState(libro?.codigoLibro || '');
  const [codigoConstancia, setCodigoConstancia] = useState(libro?.codigoConstancia || '');
  const [observaciones, setObservaciones] = useState(libro?.observaciones || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigoLibro) {
      setError('Seleccione un libro electrónico');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        clienteId,
        periodo,
        codigoLibro,
        codigoConstancia: codigoConstancia || undefined,
        observaciones: observaciones || undefined
      });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Error al registrar libro');
    } finally {
      setLoading(false);
    }
  };

  const libroSeleccionado = codigoLibro ? catalogo[codigoLibro] : null;

  // Parse periodo para mostrar nombre del mes
  const [anioStr, mesStr] = periodo.split('-');
  const nombreMes = new Date(parseInt(anioStr), parseInt(mesStr) - 1).toLocaleString('es-PE', { month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {isEditing ? '✏️ Editar Libro' : '📚 Registrar Libro Electrónico'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              Periodo: {nombreMes}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Seleccionar libro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Libro Electrónico <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <div className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm">
                <span className="font-mono text-xs text-gray-500 mr-2">[{libro.codigoLibro}]</span>
                {libro.nombreLibro}
                {libro.sistema && (
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {libro.sistema}
                  </span>
                )}
              </div>
            ) : (
              <select
                value={codigoLibro}
                onChange={(e) => setCodigoLibro(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                required
              >
                <option value="">-- Seleccionar libro --</option>
                {librosDisponibles.map((codigo) => {
                  const info = catalogo[codigo];
                  return (
                    <option key={codigo} value={codigo}>
                      [{codigo}] {info?.nombre || `Libro ${codigo}`} ({info?.sistema || 'PLE'})
                    </option>
                  );
                })}
              </select>
            )}
            {libroSeleccionado && !isEditing && (
              <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
                  {libroSeleccionado.sistema}
                </span>
                <span>{libroSeleccionado.nombre}</span>
              </div>
            )}
          </div>

          {/* Código de constancia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Código de Constancia SUNAT
            </label>
            <input
              type="text"
              value={codigoConstancia}
              onChange={(e) => setCodigoConstancia(e.target.value)}
              placeholder="Ej: 0812-2026-001234"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">Número de constancia que entrega SUNAT al presentar</p>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              placeholder="Notas adicionales..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
            />
          </div>

          {/* Info estado actual (si es edición) */}
          {isEditing && libro && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Estado actual:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_LIBRO_CONFIG[libro.estado]?.color}`}>
                  {ESTADO_LIBRO_CONFIG[libro.estado]?.icon} {ESTADO_LIBRO_CONFIG[libro.estado]?.label}
                </span>
              </div>
              {libro.fechaPresentacion && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-500 dark:text-gray-400">Presentado:</span>
                  <span className="text-xs">{new Date(libro.fechaPresentacion).toLocaleDateString('es-PE')}</span>
                </div>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button loading={loading} onClick={() => {}}>
              {isEditing ? '💾 Actualizar' : '📚 Registrar Presentación'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibroFormModal;
