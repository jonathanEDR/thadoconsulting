import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button } from '../UI';
import MapLocationPicker, { detectarZonaIGV } from '../common/MapLocationPicker';
import type { LocationData } from '../common/MapLocationPicker';
import type { CreateClienteData, RegimenTributario, CategoriaRUS, ZonaIGV, CatalogoLibros, LibrosPorRegimen, AFPProvider } from '../../types/contabilidad';
import { REGIMEN_LABELS, ZONA_IGV_LABELS, AFP_PROVIDERS_INFO } from '../../types/contabilidad';
import { librosElectronicosApi } from '../../services/contabilidadService';

interface ClienteFormModalProps {
  onClose: () => void;
  onSubmit: (data: CreateClienteData) => Promise<void>;
  initialData?: Partial<CreateClienteData>;
  isEditing?: boolean;
}

/**
 * 🏢 Modal para crear/editar cliente contable
 */
const ClienteFormModal: React.FC<ClienteFormModalProps> = ({ 
  onClose, 
  onSubmit, 
  initialData,
  isEditing = false 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateClienteData>({
    ruc: initialData?.ruc || '',
    razonSocial: initialData?.razonSocial || '',
    nombreComercial: initialData?.nombreComercial || '',
    regimenTributario: initialData?.regimenTributario || 'RUS',
    zonaIGV: initialData?.zonaIGV || 'GRAVADA',
    representante: {
      nombre: initialData?.representante?.nombre || '',
      cargo: initialData?.representante?.cargo || '',
      dni: initialData?.representante?.dni || '',
      telefono: initialData?.representante?.telefono || ''
    },
    contacto: {
      email: initialData?.contacto?.email || '',
      telefono: initialData?.contacto?.telefono || '',
      direccion: initialData?.contacto?.direccion || '',
      distrito: initialData?.contacto?.distrito || '',
      provincia: initialData?.contacto?.provincia || '',
      departamento: initialData?.contacto?.departamento || ''
    },
    ubicacion: {
      direccion: initialData?.ubicacion?.direccion || initialData?.contacto?.direccion || '',
      distrito: initialData?.ubicacion?.distrito || initialData?.contacto?.distrito || '',
      provincia: initialData?.ubicacion?.provincia || initialData?.contacto?.provincia || '',
      departamento: initialData?.ubicacion?.departamento || initialData?.contacto?.departamento || '',
      coordenadas: {
        lat: initialData?.ubicacion?.coordenadas?.lat || null,
        lng: initialData?.ubicacion?.coordenadas?.lng || null
      }
    },
    honorarioMensual: initialData?.honorarioMensual || undefined,
    linkDrive: initialData?.linkDrive || '',
    configuracionTributaria: {
      categoriaRUS: initialData?.configuracionTributaria?.categoriaRUS || 1,
      coeficienteRenta: initialData?.configuracionTributaria?.coeficienteRenta || 0.015,
      tasaIGVEspecialCompras: initialData?.configuracionTributaria?.tasaIGVEspecialCompras ?? 0.10,
      obligaciones: initialData?.configuracionTributaria?.obligaciones || {
        igv: true,
        renta: true,
        planilla: false,
        afp: false,
        librosElectronicos: false
      },
      configPlanilla: initialData?.configuracionTributaria?.configPlanilla || {
        cantidadTrabajadores: 0,
        tieneONP: false,
        tiene5ta: false
      },
      configAFP: initialData?.configuracionTributaria?.configAFP || {
        afpNombre: '' as AFPProvider | '',
        cantidadAfiliados: 0
      }
    },
    contadorAsignado: {
      nombre: initialData?.contadorAsignado?.nombre || '',
      email: initialData?.contadorAsignado?.email || ''
    }
  });

  // IGV zone auto-detection warning
  const [zonaIGVSugerida, setZonaIGVSugerida] = useState<string | null>(null);

  // Catálogo de libros electrónicos
  const [catalogoLibros, setCatalogoLibros] = useState<CatalogoLibros>({});
  const [librosPorRegimen, setLibrosPorRegimen] = useState<LibrosPorRegimen>({ RUS: [], RER: [], MYPE: [], GENERAL: [] });
  const [librosSeleccionados, setLibrosSeleccionados] = useState<string[]>(
    initialData?.configuracionTributaria?.librosElectronicos || []
  );

  // Cargar catálogo de libros
  useEffect(() => {
    librosElectronicosApi.getCatalogo().then(res => {
      if (res.success) {
        setCatalogoLibros(res.data.catalogo);
        setLibrosPorRegimen(res.data.librosPorRegimen);
        // Si no hay libros seleccionados, precargar por régimen
        if (librosSeleccionados.length === 0 && !isEditing) {
          const sugeridos = res.data.librosPorRegimen[formData.regimenTributario] || [];
          setLibrosSeleccionados(sugeridos);
        }
      }
    }).catch(() => { /* silently ignore */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Handle ubicacion changes from MapLocationPicker + auto-detect IGV zone */
  const handleUbicacionChange = useCallback((location: LocationData) => {
    setFormData(prev => ({
      ...prev,
      ubicacion: location,
      // Also sync to contacto for backward compatibility
      contacto: {
        ...prev.contacto,
        direccion: location.direccion,
        distrito: location.distrito,
        provincia: location.provincia,
        departamento: location.departamento
      }
    }));

    // Auto-detect IGV zone based on department
    if (location.departamento) {
      const zonaDetectada = detectarZonaIGV(location.departamento);
      if (zonaDetectada === 'EXONERADA') {
        setZonaIGVSugerida(`📍 ${location.departamento} es zona exonerada de IGV (Ley 27037 - Amazonía)`);
        setFormData(prev => ({ ...prev, zonaIGV: 'EXONERADA' }));
      } else if (zonaDetectada === 'PARCIAL') {
        setZonaIGVSugerida(`⚠️ ${location.departamento} tiene provincias parcialmente exoneradas. Verifique manualmente.`);
      } else {
        setZonaIGVSugerida(null);
        setFormData(prev => ({ ...prev, zonaIGV: 'GRAVADA' }));
      }
    }
  }, []);

  /** Get the zonaIGV badge color */
  const zonaIGVBadge = useMemo(() => {
    const z = formData.zonaIGV || 'GRAVADA';
    const colors: Record<string, string> = {
      GRAVADA: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      EXONERADA: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      INAFECTA: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    };
    return colors[z] || colors.GRAVADA;
  }, [formData.zonaIGV]);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      }
      // Nested field (e.g., "representante.nombre")
      const [parent, child] = keys;
      return {
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CreateClienteData] as Record<string, unknown>),
          [child]: value
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones
    if (!formData.ruc || formData.ruc.length !== 11) {
      setError('El RUC debe tener exactamente 11 dígitos');
      setLoading(false);
      return;
    }
    if (!formData.razonSocial.trim()) {
      setError('La razón social es obligatoria');
      setLoading(false);
      return;
    }
    if (!formData.representante.nombre.trim()) {
      setError('El nombre del representante es obligatorio');
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        ...formData,
        configuracionTributaria: {
          ...formData.configuracionTributaria,
          librosElectronicos: librosSeleccionados,
          obligaciones: formData.configuracionTributaria?.obligaciones,
          configPlanilla: formData.configuracionTributaria?.configPlanilla,
          configAFP: formData.configuracionTributaria?.configAFP
        }
      });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Error al guardar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditing ? '✏️ Editar Cliente Contable' : '➕ Nuevo Cliente Contable'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Datos principales */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📋 Datos Principales</legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  RUC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ruc}
                  onChange={(e) => handleChange('ruc', e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="20123456789"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  maxLength={11}
                  disabled={isEditing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Régimen Tributario <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.regimenTributario}
                  onChange={(e) => handleChange('regimenTributario', e.target.value as RegimenTributario)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  {(Object.keys(REGIMEN_LABELS) as RegimenTributario[]).map(key => (
                    <option key={key} value={key}>{REGIMEN_LABELS[key]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Razón Social <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.razonSocial}
                onChange={(e) => handleChange('razonSocial', e.target.value)}
                placeholder="Empresa S.A.C."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre Comercial
                </label>
                <input
                  type="text"
                  value={formData.nombreComercial || ''}
                  onChange={(e) => handleChange('nombreComercial', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Honorario Mensual (S/)
                </label>
                <input
                  type="number"
                  value={formData.honorarioMensual || ''}
                  onChange={(e) => handleChange('honorarioMensual', parseFloat(e.target.value) || undefined)}
                  placeholder="300.00"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </fieldset>

          {/* Representante */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-2">👤 Representante Legal</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.representante.nombre}
                  onChange={(e) => handleChange('representante.nombre', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo</label>
                <input
                  type="text"
                  value={formData.representante.cargo || ''}
                  onChange={(e) => handleChange('representante.cargo', e.target.value)}
                  placeholder="Gerente General"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">DNI</label>
                <input
                  type="text"
                  value={formData.representante.dni || ''}
                  onChange={(e) => handleChange('representante.dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="12345678"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  maxLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.representante.telefono || ''}
                  onChange={(e) => handleChange('representante.telefono', e.target.value)}
                  placeholder="987654321"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </fieldset>

          {/* Contacto */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📞 Datos de Contacto</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.contacto?.email || ''}
                  onChange={(e) => handleChange('contacto.email', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.contacto?.telefono || ''}
                  onChange={(e) => handleChange('contacto.telefono', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </fieldset>

          {/* Ubicación con Mapa */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🗺️ Ubicación</legend>
            <MapLocationPicker
              value={formData.ubicacion || { direccion: '', distrito: '', provincia: '', departamento: '', coordenadas: { lat: null, lng: null } }}
              onChange={handleUbicacionChange}
              height="280px"
              placeholder="Buscar dirección del cliente..."
            />
            {zonaIGVSugerida && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 p-3 rounded-xl text-sm">
                {zonaIGVSugerida}
              </div>
            )}
          </fieldset>

          {/* Configuración Tributaria */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-2">⚙️ Configuración Tributaria</legend>
            
            {/* Zona IGV */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Zona IGV <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${zonaIGVBadge}`}>{ZONA_IGV_LABELS[formData.zonaIGV || 'GRAVADA']}</span>
              </label>
              <select
                value={formData.zonaIGV || 'GRAVADA'}
                onChange={(e) => handleChange('zonaIGV', e.target.value as ZonaIGV)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {(Object.keys(ZONA_IGV_LABELS) as ZonaIGV[]).map(key => (
                  <option key={key} value={key}>{ZONA_IGV_LABELS[key]}</option>
                ))}
              </select>
              {formData.zonaIGV === 'EXONERADA' && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  🌿 Este cliente no pagará IGV en sus declaraciones (Ley 27037 - Promoción de la Amazonía)
                </p>
              )}
              {formData.zonaIGV === 'INAFECTA' && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  📋 Operaciones inafectas al IGV. No se calculará IGV en las declaraciones.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.regimenTributario === 'RUS' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría RUS</label>
                  <select
                    value={formData.configuracionTributaria?.categoriaRUS || 1}
                    onChange={(e) => handleChange('configuracionTributaria.categoriaRUS', parseInt(e.target.value) as CategoriaRUS)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value={1}>Categoría 1 (S/ 20/mes)</option>
                    <option value={2}>Categoría 2 (S/ 50/mes)</option>
                  </select>
                </div>
              )}
              {(formData.regimenTributario === 'MYPE' || formData.regimenTributario === 'GENERAL') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Coeficiente de Renta</label>
                  <input
                    type="number"
                    value={formData.configuracionTributaria?.coeficienteRenta || 0.015}
                    onChange={(e) => handleChange('configuracionTributaria.coeficienteRenta', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    step="0.001"
                    min="0"
                    max="1"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Google Drive</label>
                <input
                  type="url"
                  value={formData.linkDrive || ''}
                  onChange={(e) => handleChange('linkDrive', e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tasa IGV Especial en Compras (%)
                </label>
                <input
                  type="number"
                  value={(formData.configuracionTributaria?.tasaIGVEspecialCompras ?? 0.10) * 100}
                  onChange={(e) => handleChange('configuracionTributaria.tasaIGVEspecialCompras', (parseFloat(e.target.value) || 0) / 100)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  step="0.1"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Para compras con tasa reducida (ej. restaurantes/hospedaje - Ley 31556). Editable por si SUNAT cambia el %.
                </p>
              </div>
            </div>
          </fieldset>

          {/* Libros Electrónicos */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📚 Libros Electrónicos</legend>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {librosSeleccionados.length} libro(s) seleccionado(s)
              </span>
              {formData.regimenTributario && librosPorRegimen[formData.regimenTributario as keyof typeof librosPorRegimen] && (
                <button
                  type="button"
                  onClick={() => {
                    const sugeridos = librosPorRegimen[formData.regimenTributario as keyof typeof librosPorRegimen] || [];
                    setLibrosSeleccionados(sugeridos);
                  }}
                  className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  🔄 Cargar sugeridos ({formData.regimenTributario})
                </button>
              )}
            </div>

            {Object.keys(catalogoLibros).length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">Cargando catálogo de libros...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(catalogoLibros).map(([codigo, info]) => {
                  const isChecked = librosSeleccionados.includes(codigo);
                  return (
                    <label
                      key={codigo}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLibrosSeleccionados(prev => [...prev, codigo]);
                          } else {
                            setLibrosSeleccionados(prev => prev.filter(c => c !== codigo));
                          }
                        }}
                        className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{info.nombre}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            info.sistema === 'SIRE' 
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          }`}>
                            {info.sistema}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Código: {codigo}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </fieldset>

          {/* Obligaciones Laborales (Planilla & AFP) */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-2">👥 Obligaciones Laborales</legend>

            {/* Checkboxes for Planilla and AFP */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    typeof formData.configuracionTributaria?.obligaciones === 'object' &&
                    formData.configuracionTributaria?.obligaciones !== null &&
                    !Array.isArray(formData.configuracionTributaria?.obligaciones)
                      ? !!formData.configuracionTributaria.obligaciones.planilla
                      : false
                  }
                  onChange={(e) => {
                    const currentObl = typeof formData.configuracionTributaria?.obligaciones === 'object' &&
                      formData.configuracionTributaria?.obligaciones !== null &&
                      !Array.isArray(formData.configuracionTributaria?.obligaciones)
                        ? formData.configuracionTributaria.obligaciones
                        : { igv: true, renta: true, planilla: false, afp: false, librosElectronicos: false };
                    setFormData(prev => ({
                      ...prev,
                      configuracionTributaria: {
                        ...prev.configuracionTributaria,
                        obligaciones: { ...currentObl, planilla: e.target.checked }
                      }
                    }));
                  }}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">👥 Tiene Planilla (PLAME)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    typeof formData.configuracionTributaria?.obligaciones === 'object' &&
                    formData.configuracionTributaria?.obligaciones !== null &&
                    !Array.isArray(formData.configuracionTributaria?.obligaciones)
                      ? !!formData.configuracionTributaria.obligaciones.afp
                      : false
                  }
                  onChange={(e) => {
                    const currentObl = typeof formData.configuracionTributaria?.obligaciones === 'object' &&
                      formData.configuracionTributaria?.obligaciones !== null &&
                      !Array.isArray(formData.configuracionTributaria?.obligaciones)
                        ? formData.configuracionTributaria.obligaciones
                        : { igv: true, renta: true, planilla: false, afp: false, librosElectronicos: false };
                    setFormData(prev => ({
                      ...prev,
                      configuracionTributaria: {
                        ...prev.configuracionTributaria,
                        obligaciones: { ...currentObl, afp: e.target.checked }
                      }
                    }));
                  }}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">🏦 Declara AFP</span>
              </label>
            </div>

            {/* Planilla Config */}
            {typeof formData.configuracionTributaria?.obligaciones === 'object' &&
             formData.configuracionTributaria?.obligaciones !== null &&
             !Array.isArray(formData.configuracionTributaria?.obligaciones) &&
             formData.configuracionTributaria.obligaciones.planilla && (
              <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-teal-700 dark:text-teal-300">⚙️ Configuración de Planilla</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nº Trabajadores</label>
                    <input
                      type="number"
                      value={formData.configuracionTributaria?.configPlanilla?.cantidadTrabajadores || 0}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        configuracionTributaria: {
                          ...prev.configuracionTributaria,
                          configPlanilla: {
                            ...prev.configuracionTributaria?.configPlanilla,
                            cantidadTrabajadores: parseInt(e.target.value) || 0
                          }
                        }
                      }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      min="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.configuracionTributaria?.configPlanilla?.tieneONP || false}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          configuracionTributaria: {
                            ...prev.configuracionTributaria,
                            configPlanilla: {
                              ...prev.configuracionTributaria?.configPlanilla,
                              tieneONP: e.target.checked
                            }
                          }
                        }))}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Tiene ONP</span>
                    </label>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.configuracionTributaria?.configPlanilla?.tiene5ta || false}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          configuracionTributaria: {
                            ...prev.configuracionTributaria,
                            configPlanilla: {
                              ...prev.configuracionTributaria?.configPlanilla,
                              tiene5ta: e.target.checked
                            }
                          }
                        }))}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Retenciones 5ta</span>
                    </label>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.configuracionTributaria?.configPlanilla?.tieneAFP || false}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          configuracionTributaria: {
                            ...prev.configuracionTributaria,
                            configPlanilla: {
                              ...prev.configuracionTributaria?.configPlanilla,
                              tieneAFP: e.target.checked,
                              afpNombrePlanilla: e.target.checked
                                ? (prev.configuracionTributaria?.configPlanilla?.afpNombrePlanilla || '')
                                : ''
                            }
                          }
                        }))}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Tiene AFP (en PLAME)</span>
                    </label>
                  </div>
                  {formData.configuracionTributaria?.configPlanilla?.tieneAFP && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">AFP de los trabajadores en PLAME</label>
                      <select
                        value={formData.configuracionTributaria?.configPlanilla?.afpNombrePlanilla || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          configuracionTributaria: {
                            ...prev.configuracionTributaria,
                            configPlanilla: {
                              ...prev.configuracionTributaria?.configPlanilla,
                              afpNombrePlanilla: e.target.value as AFPProvider | ''
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-amber-500"
                      >
                        <option value="">Seleccionar AFP...</option>
                        {(Object.keys(AFP_PROVIDERS_INFO) as AFPProvider[]).map(afp => (
                          <option key={afp} value={afp}>{AFP_PROVIDERS_INFO[afp].nombre} (Com: {(AFP_PROVIDERS_INFO[afp].comision * 100).toFixed(2)}%)</option>
                        ))}
                      </select>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        💡 Estos trabajadores se incluyen en ESSALUD. Su aporte AFP se declara por separado en AFPnet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AFP Config */}
            {typeof formData.configuracionTributaria?.obligaciones === 'object' &&
             formData.configuracionTributaria?.obligaciones !== null &&
             !Array.isArray(formData.configuracionTributaria?.obligaciones) &&
             formData.configuracionTributaria.obligaciones.afp && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-300">⚙️ Configuración AFP</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">AFP</label>
                    <select
                      value={formData.configuracionTributaria?.configAFP?.afpNombre || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        configuracionTributaria: {
                          ...prev.configuracionTributaria,
                          configAFP: {
                            ...prev.configuracionTributaria?.configAFP,
                            afpNombre: e.target.value as AFPProvider | ''
                          }
                        }
                      }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="">Seleccionar AFP...</option>
                      {(Object.keys(AFP_PROVIDERS_INFO) as AFPProvider[]).map(afp => (
                        <option key={afp} value={afp}>{AFP_PROVIDERS_INFO[afp].nombre} (Com: {(AFP_PROVIDERS_INFO[afp].comision * 100).toFixed(2)}%)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nº Afiliados</label>
                    <input
                      type="number"
                      value={formData.configuracionTributaria?.configAFP?.cantidadAfiliados || 0}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        configuracionTributaria: {
                          ...prev.configuracionTributaria,
                          configAFP: {
                            ...prev.configuracionTributaria?.configAFP,
                            cantidadAfiliados: parseInt(e.target.value) || 0
                          }
                        }
                      }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}
          </fieldset>

          {/* Contador Asignado */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🧑‍💼 Contador Asignado</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.contadorAsignado?.nombre || ''}
                  onChange={(e) => handleChange('contadorAsignado.nombre', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.contadorAsignado?.email || ''}
                  onChange={(e) => handleChange('contadorAsignado.email', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </fieldset>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button loading={loading} onClick={() => {}}>
              {isEditing ? '💾 Guardar Cambios' : '➕ Crear Cliente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteFormModal;
