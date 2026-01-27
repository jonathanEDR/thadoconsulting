/**
 * 📰 DashboardFeaturedPostsConfigSection
 * Panel de edición visual para configurar los estilos del bloque de posts destacados
 * del Dashboard del Cliente (ClientDashboard.tsx)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Palette, 
  Sun, 
  Moon, 
  Save,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
  Newspaper,
  Type,
  Tag,
  User,
  Image,
  AlertCircle,
  MousePointer
} from 'lucide-react';
import { 
  useDashboardFeaturedPostsConfig, 
  DEFAULT_FEATURED_POSTS_CONFIG,
  emitFeaturedPostsConfigChanged 
} from '../../hooks/cms/useDashboardFeaturedPostsConfig';
import { updatePageBySlug, clearCache, getPageBySlug } from '../../services/cmsApi';
import { cms } from '../../utils/contentManagementCache';
import type { DashboardFeaturedPostsConfig, ButtonConfig } from '../../types/cms';
import DynamicIcon, { AVAILABLE_SIDEBAR_ICONS } from '../ui/DynamicIcon';

interface DashboardFeaturedPostsConfigSectionProps {
  onSave?: () => void;
  onChangePending?: () => void;
}

// ============================================
// ADVANCED COLOR PICKER WITH OPACITY SUPPORT
// ============================================
interface AdvancedColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
  supportOpacity?: boolean;
}

const AdvancedColorPicker: React.FC<AdvancedColorPickerProps> = ({ 
  label, 
  value, 
  onChange, 
  description,
  supportOpacity = true 
}) => {
  // Parsear el color actual
  const parseColor = useCallback((colorString: string): { hex: string; alpha: number } => {
    // Si es hex puro
    if (/^#[0-9A-Fa-f]{6}$/.test(colorString)) {
      return { hex: colorString, alpha: 1 };
    }
    
    // Si es rgba
    const rgbaMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);
      const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
      
      // Convertir RGB a HEX
      const hex = '#' + [r, g, b].map(x => {
        const hexVal = x.toString(16);
        return hexVal.length === 1 ? '0' + hexVal : hexVal;
      }).join('');
      
      return { hex, alpha: a };
    }
    
    // Fallback
    return { hex: '#000000', alpha: 1 };
  }, []);

  const { hex, alpha } = parseColor(value);
  const [localHex, setLocalHex] = useState(hex);
  const [localAlpha, setLocalAlpha] = useState(Math.round(alpha * 100));

  // Actualizar cuando cambia el valor externo
  useEffect(() => {
    const parsed = parseColor(value);
    setLocalHex(parsed.hex);
    setLocalAlpha(Math.round(parsed.alpha * 100));
  }, [value, parseColor]);

  const handleHexChange = (newHex: string) => {
    setLocalHex(newHex);
    updateColor(newHex, localAlpha);
  };

  const handleAlphaChange = (newAlpha: number) => {
    setLocalAlpha(newAlpha);
    updateColor(localHex, newAlpha);
  };

  const updateColor = (hexVal: string, alphaPercent: number) => {
    if (alphaPercent >= 100 || !supportOpacity) {
      // Color sólido
      onChange(hexVal);
    } else {
      // Convertir hex a rgba
      const r = parseInt(hexVal.slice(1, 3), 16);
      const g = parseInt(hexVal.slice(3, 5), 16);
      const b = parseInt(hexVal.slice(5, 7), 16);
      const a = alphaPercent / 100;
      onChange(`rgba(${r}, ${g}, ${b}, ${a})`);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
      <div className="flex items-center gap-3">
        {/* Color picker */}
        <div className="relative">
          <input
            type="color"
            value={localHex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600"
          />
        </div>
        
        {/* Hex input */}
        <input
          type="text"
          value={localHex}
          onChange={(e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
              handleHexChange(e.target.value);
            }
          }}
          className="w-24 px-2 py-1.5 text-sm border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          placeholder="#000000"
        />
        
        {/* Opacity slider */}
        {supportOpacity && (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={localAlpha}
              onChange={(e) => handleAlphaChange(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 w-10">
              {localAlpha}%
            </span>
          </div>
        )}
        
        {/* Preview badge */}
        <div 
          className="w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-600"
          style={{ backgroundColor: value }}
          title={`Preview: ${value}`}
        />
      </div>
    </div>
  );
};

// ============================================
// COLLAPSIBLE SECTION
// ============================================
interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = true 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 space-y-4 bg-white dark:bg-gray-800/50">
          {children}
        </div>
      )}
    </div>
  );
};

// ============================================
// BUTTON CONFIG EDITOR
// ============================================
interface ButtonConfigEditorProps {
  config: ButtonConfig;
  onChange: (field: string, value: any) => void;
  themePreview: 'light' | 'dark';
}

const ButtonConfigEditor: React.FC<ButtonConfigEditorProps> = ({ config, onChange, themePreview }) => {
  return (
    <div className="space-y-6">
      {/* Texto e Icono */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
            Texto del Botón
          </label>
          <input
            type="text"
            value={config.text}
            onChange={(e) => onChange('text', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
            Icono
          </label>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <DynamicIcon 
                name={config.iconName} 
                size={20} 
                color={themePreview === 'light' ? config.iconColorLight : config.iconColorDark} 
              />
            </div>
            <select
              value={config.iconName}
              onChange={(e) => onChange('iconName', e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            >
              {AVAILABLE_SIDEBAR_ICONS.map(icon => (
                <option key={icon.name} value={icon.name}>{icon.label}</option>
              ))}
            </select>
          </div>
        </div>
        <AdvancedColorPicker
          label={`Color del Icono (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
          value={themePreview === 'light' ? config.iconColorLight : config.iconColorDark}
          onChange={(color) => onChange(themePreview === 'light' ? 'iconColorLight' : 'iconColorDark', color)}
          supportOpacity={false}
        />
        <AdvancedColorPicker
          label={`Color del Texto (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
          value={themePreview === 'light' ? config.textColorLight : config.textColorDark}
          onChange={(color) => onChange(themePreview === 'light' ? 'textColorLight' : 'textColorDark', color)}
          supportOpacity={false}
        />
      </div>

      {/* Fondo */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Fondo</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Tipo de Fondo
            </label>
            <select
              value={config.bgType}
              onChange={(e) => onChange('bgType', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            >
              <option value="solid">Sólido</option>
              <option value="gradient">Gradiente</option>
              <option value="transparent">Transparente</option>
            </select>
          </div>
          {config.bgType === 'solid' && (
            <AdvancedColorPicker
              label={`Fondo (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? config.bgColorLight : config.bgColorDark}
              onChange={(color) => onChange(themePreview === 'light' ? 'bgColorLight' : 'bgColorDark', color)}
            />
          )}
          {config.bgType === 'gradient' && (
            <>
              <AdvancedColorPicker
                label="Gradiente Desde"
                value={config.bgGradientFrom}
                onChange={(color) => onChange('bgGradientFrom', color)}
                supportOpacity={false}
              />
              <AdvancedColorPicker
                label="Gradiente Hacia"
                value={config.bgGradientTo}
                onChange={(color) => onChange('bgGradientTo', color)}
                supportOpacity={false}
              />
            </>
          )}
        </div>
      </div>

      {/* Borde */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Borde</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.borderEnabled}
              onChange={(e) => onChange('borderEnabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Habilitar borde
            </label>
          </div>
          {config.borderEnabled && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Ancho del Borde
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={config.borderWidth}
                  onChange={(e) => onChange('borderWidth', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Tipo de Borde
                </label>
                <select
                  value={config.borderType}
                  onChange={(e) => onChange('borderType', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="solid">Sólido</option>
                  <option value="gradient">Gradiente</option>
                </select>
              </div>
              {config.borderType === 'solid' && (
                <AdvancedColorPicker
                  label={`Color del Borde (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
                  value={themePreview === 'light' ? config.borderColorLight : config.borderColorDark}
                  onChange={(color) => onChange(themePreview === 'light' ? 'borderColorLight' : 'borderColorDark', color)}
                  supportOpacity={false}
                />
              )}
              {config.borderType === 'gradient' && (
                <>
                  <AdvancedColorPicker
                    label="Gradiente Desde"
                    value={config.borderGradientFrom}
                    onChange={(color) => onChange('borderGradientFrom', color)}
                    supportOpacity={false}
                  />
                  <AdvancedColorPicker
                    label="Gradiente Hacia"
                    value={config.borderGradientTo}
                    onChange={(color) => onChange('borderGradientTo', color)}
                    supportOpacity={false}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Vista Previa</h4>
        <div className={`p-4 rounded-lg ${themePreview === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
          <button
            type="button"
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
            style={{
              background: config.bgType === 'gradient' 
                ? `linear-gradient(to right, ${config.bgGradientFrom}, ${config.bgGradientTo})`
                : config.bgType === 'solid' 
                  ? (themePreview === 'light' ? config.bgColorLight : config.bgColorDark)
                  : 'transparent',
              color: themePreview === 'light' ? config.textColorLight : config.textColorDark,
              border: config.borderEnabled 
                ? config.borderType === 'gradient'
                  ? `${config.borderWidth}px solid ${config.borderGradientFrom}`
                  : `${config.borderWidth}px solid ${themePreview === 'light' ? config.borderColorLight : config.borderColorDark}`
                : 'none',
            }}
          >
            <DynamicIcon 
              name={config.iconName} 
              size={16} 
              color={themePreview === 'light' ? config.iconColorLight : config.iconColorDark} 
            />
            {config.text}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ICON SELECTOR WITH COLOR
// ============================================
interface IconSelectorProps {
  label: string;
  iconName: string;
  iconColor: string;
  onIconChange: (name: string) => void;
  onColorChange: (color: string) => void;
  themeLabel?: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({ 
  label, 
  iconName, 
  iconColor, 
  onIconChange, 
  onColorChange,
  themeLabel 
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
        {label} {themeLabel && `(${themeLabel})`}
      </label>
      <div className="flex items-center gap-2">
        <div 
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-600"
          style={{ backgroundColor: iconColor + '20' }}
        >
          <DynamicIcon name={iconName} size={24} color={iconColor} />
        </div>
        <select
          value={iconName}
          onChange={(e) => onIconChange(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm"
        >
          {AVAILABLE_SIDEBAR_ICONS.map(icon => (
            <option key={icon.name} value={icon.name}>{icon.label}</option>
          ))}
        </select>
        <input
          type="color"
          value={iconColor.startsWith('#') ? iconColor : '#3b82f6'}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600"
        />
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const DashboardFeaturedPostsConfigSection: React.FC<DashboardFeaturedPostsConfigSectionProps> = ({
  onSave,
  onChangePending
}) => {
  const { config: savedConfig, loading, refetch } = useDashboardFeaturedPostsConfig();
  
  const [localConfig, setLocalConfig] = useState<DashboardFeaturedPostsConfig>(DEFAULT_FEATURED_POSTS_CONFIG);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [themePreview, setThemePreview] = useState<'light' | 'dark'>('light');

  // Cargar configuración guardada
  useEffect(() => {
    if (savedConfig) {
      setLocalConfig(savedConfig);
    }
  }, [savedConfig]);

  // Helper para actualizar configuración
  const updateConfig = <K extends keyof DashboardFeaturedPostsConfig>(
    section: K,
    field: keyof DashboardFeaturedPostsConfig[K],
    value: any
  ) => {
    setLocalConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
    onChangePending?.();
  };

  // Resetear a valores por defecto
  const resetToDefaults = () => {
    if (window.confirm('¿Estás seguro de resetear a los valores por defecto?')) {
      setLocalConfig(DEFAULT_FEATURED_POSTS_CONFIG);
      setHasChanges(true);
    }
  };

  // Guardar cambios
  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      // 1. Obtener página actual para preservar otros datos
      let pageData;
      try {
        pageData = await getPageBySlug('dashboard-sidebar', false);
      } catch {
        pageData = {
          pageSlug: 'dashboard-sidebar',
          pageName: 'Dashboard Configuration',
          content: {},
          seo: {
            metaTitle: 'Dashboard Configuration',
            metaDescription: 'Configuración del dashboard',
            keywords: [],
            ogTitle: '',
            ogDescription: '',
            ogImage: '',
            twitterCard: ''
          },
          theme: {
            default: 'light' as const,
            lightMode: { primary: '#3b82f6', secondary: '#8b5cf6', background: '#ffffff', text: '#111827', textSecondary: '#6b7280', cardBg: '#ffffff', border: '#e5e7eb', buttons: { ctaPrimary: { text: '', background: '', textColor: '', borderColor: '' }, contact: { text: '', background: '', textColor: '', borderColor: '' }, dashboard: { text: '', background: '', textColor: '', borderColor: '' } } },
            darkMode: { primary: '#60a5fa', secondary: '#a78bfa', background: '#0f172a', text: '#f1f5f9', textSecondary: '#94a3b8', cardBg: '#1e293b', border: '#334155', buttons: { ctaPrimary: { text: '', background: '', textColor: '', borderColor: '' }, contact: { text: '', background: '', textColor: '', borderColor: '' }, dashboard: { text: '', background: '', textColor: '', borderColor: '' } } }
          },
          isPublished: true,
          lastUpdated: new Date().toISOString(),
          updatedBy: 'admin'
        };
      }

      // 2. Agregar configuración de featured posts
      const updatedPageData = {
        ...pageData,
        content: {
          ...pageData.content,
          dashboardFeaturedPosts: localConfig
        }
      };

      // 3. Guardar en la API
      await updatePageBySlug('dashboard-sidebar', updatedPageData);

      // 4. Limpiar cache
      await clearCache();
      cms.invalidatePages('dashboard-sidebar');

      // 5. Notificar cambios
      emitFeaturedPostsConfigChanged();

      setMessage({ type: 'success', text: '✅ Configuración guardada correctamente' });
      setHasChanges(false);
      onSave?.();

      // Recargar configuración
      await refetch();

    } catch (error) {
      console.error('Error guardando configuración:', error);
      setMessage({ type: 'error', text: '❌ Error al guardar la configuración' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando configuración...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Posts Destacados del Dashboard
          </h2>
        </div>
        
        {/* Theme preview toggle */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setThemePreview('light')}
            className={`p-2 rounded-md transition-colors ${
              themePreview === 'light' 
                ? 'bg-white dark:bg-gray-600 shadow-sm' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
          </button>
          <button
            onClick={() => setThemePreview('dark')}
            className={`p-2 rounded-md transition-colors ${
              themePreview === 'dark' 
                ? 'bg-white dark:bg-gray-600 shadow-sm' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-500" />
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {/* Header Section */}
        <CollapsibleSection
          title="Header del Bloque"
          icon={<Type className="w-5 h-5 text-blue-500" />}
          defaultOpen={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Título
              </label>
              <input
                type="text"
                value={localConfig.header.title}
                onChange={(e) => updateConfig('header', 'title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Icono del Header
              </label>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <DynamicIcon 
                    name={localConfig.header.iconName} 
                    size={24} 
                    color={themePreview === 'light' ? localConfig.header.iconColorLight : localConfig.header.iconColorDark} 
                  />
                </div>
                <select
                  value={localConfig.header.iconName}
                  onChange={(e) => updateConfig('header', 'iconName', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                >
                  {AVAILABLE_SIDEBAR_ICONS.map(icon => (
                    <option key={icon.name} value={icon.name}>{icon.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <AdvancedColorPicker
              label={`Color del Icono (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.header.iconColorLight : localConfig.header.iconColorDark}
              onChange={(color) => updateConfig('header', themePreview === 'light' ? 'iconColorLight' : 'iconColorDark', color)}
              supportOpacity={false}
            />
            <AdvancedColorPicker
              label={`Color del Título (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.header.titleColorLight : localConfig.header.titleColorDark}
              onChange={(color) => updateConfig('header', themePreview === 'light' ? 'titleColorLight' : 'titleColorDark', color)}
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={localConfig.header.showRefreshButton}
                onChange={(e) => updateConfig('header', 'showRefreshButton', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mostrar botón de actualizar
              </label>
            </div>
          </div>
        </CollapsibleSection>

        {/* Refresh Button Section */}
        <CollapsibleSection
          title="Botón Actualizar"
          icon={<RefreshCw className="w-5 h-5 text-cyan-500" />}
          defaultOpen={false}
        >
          <ButtonConfigEditor 
            config={localConfig.refreshButton}
            onChange={(field, value) => updateConfig('refreshButton', field as any, value)}
            themePreview={themePreview}
          />
        </CollapsibleSection>

        {/* Panel Section */}
        <CollapsibleSection
          title="Panel Contenedor"
          icon={<Palette className="w-5 h-5 text-green-500" />}
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdvancedColorPicker
              label={`Fondo del Panel (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.panel.bgColorLight : localConfig.panel.bgColorDark}
              onChange={(color) => updateConfig('panel', themePreview === 'light' ? 'bgColorLight' : 'bgColorDark', color)}
            />
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Radio de Borde
              </label>
              <select
                value={localConfig.panel.borderRadius}
                onChange={(e) => updateConfig('panel', 'borderRadius', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="lg">Grande (lg)</option>
                <option value="xl">Extra Grande (xl)</option>
                <option value="2xl">2XL</option>
                <option value="3xl">3XL</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Tamaño de Sombra
              </label>
              <select
                value={localConfig.panel.shadowSize}
                onChange={(e) => updateConfig('panel', 'shadowSize', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="sm">Pequeña</option>
                <option value="md">Mediana</option>
                <option value="lg">Grande</option>
                <option value="xl">Extra Grande</option>
                <option value="2xl">2XL</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Padding Interno
              </label>
              <select
                value={localConfig.panel.padding}
                onChange={(e) => updateConfig('panel', 'padding', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="4">Pequeño (4)</option>
                <option value="6">Normal (6)</option>
                <option value="8">Grande (8)</option>
                <option value="10">Extra Grande (10)</option>
              </select>
            </div>
          </div>
        </CollapsibleSection>

        {/* Card Section */}
        <CollapsibleSection
          title="Tarjeta del Post"
          icon={<Eye className="w-5 h-5 text-purple-500" />}
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdvancedColorPicker
              label={`Gradiente Desde (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.card.bgGradientFromLight : localConfig.card.bgGradientFromDark}
              onChange={(color) => updateConfig('card', themePreview === 'light' ? 'bgGradientFromLight' : 'bgGradientFromDark', color)}
            />
            <AdvancedColorPicker
              label={`Gradiente Hacia (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.card.bgGradientToLight : localConfig.card.bgGradientToDark}
              onChange={(color) => updateConfig('card', themePreview === 'light' ? 'bgGradientToLight' : 'bgGradientToDark', color)}
            />
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Radio de Borde de Tarjeta
              </label>
              <select
                value={localConfig.card.borderRadius}
                onChange={(e) => updateConfig('card', 'borderRadius', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="xl">Grande (xl)</option>
                <option value="2xl">2XL</option>
                <option value="3xl">3XL</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Escala en Hover
              </label>
              <select
                value={localConfig.card.hoverScale}
                onChange={(e) => updateConfig('card', 'hoverScale', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="1">Sin escala</option>
                <option value="1.01">Sutil (1.01)</option>
                <option value="1.02">Normal (1.02)</option>
                <option value="1.05">Notable (1.05)</option>
              </select>
            </div>
          </div>
        </CollapsibleSection>

        {/* Category Badge Section */}
        <CollapsibleSection
          title="Badge de Categoría"
          icon={<Tag className="w-5 h-5 text-orange-500" />}
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdvancedColorPicker
              label="Gradiente Desde"
              value={localConfig.categoryBadge.gradientFrom}
              onChange={(color) => updateConfig('categoryBadge', 'gradientFrom', color)}
              supportOpacity={false}
            />
            <AdvancedColorPicker
              label="Gradiente Hacia"
              value={localConfig.categoryBadge.gradientTo}
              onChange={(color) => updateConfig('categoryBadge', 'gradientTo', color)}
              supportOpacity={false}
            />
            <AdvancedColorPicker
              label="Color del Texto"
              value={localConfig.categoryBadge.textColor}
              onChange={(color) => updateConfig('categoryBadge', 'textColor', color)}
              supportOpacity={false}
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={localConfig.categoryBadge.showIcon}
                onChange={(e) => updateConfig('categoryBadge', 'showIcon', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mostrar icono de categoría
              </label>
            </div>
            {localConfig.categoryBadge.showIcon && (
              <>
                <IconSelector
                  label="Icono de Categoría"
                  iconName={localConfig.categoryBadge.iconName}
                  iconColor={localConfig.categoryBadge.iconColor}
                  onIconChange={(name) => updateConfig('categoryBadge', 'iconName', name)}
                  onColorChange={(color) => updateConfig('categoryBadge', 'iconColor', color)}
                />
              </>
            )}
          </div>
        </CollapsibleSection>

        {/* Typography Section */}
        <CollapsibleSection
          title="Tipografía"
          icon={<Type className="w-5 h-5 text-indigo-500" />}
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Familia de Fuente
              </label>
              <select
                value={localConfig.typography.fontFamily}
                onChange={(e) => updateConfig('typography', 'fontFamily', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="Montserrat">Montserrat</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Poppins">Poppins</option>
                <option value="Nunito">Nunito</option>
              </select>
            </div>
            <AdvancedColorPicker
              label={`Color del Título (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.typography.titleColorLight : localConfig.typography.titleColorDark}
              onChange={(color) => updateConfig('typography', themePreview === 'light' ? 'titleColorLight' : 'titleColorDark', color)}
              supportOpacity={false}
            />
            <AdvancedColorPicker
              label={`Color Hover del Título (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.typography.titleHoverColorLight : localConfig.typography.titleHoverColorDark}
              onChange={(color) => updateConfig('typography', themePreview === 'light' ? 'titleHoverColorLight' : 'titleHoverColorDark', color)}
              supportOpacity={false}
            />
            <AdvancedColorPicker
              label={`Color del Extracto (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.typography.excerptColorLight : localConfig.typography.excerptColorDark}
              onChange={(color) => updateConfig('typography', themePreview === 'light' ? 'excerptColorLight' : 'excerptColorDark', color)}
              supportOpacity={false}
            />
          </div>
        </CollapsibleSection>

        {/* Tags Section */}
        <CollapsibleSection
          title="Tags"
          icon={<Tag className="w-5 h-5 text-cyan-500" />}
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdvancedColorPicker
              label={`Fondo de Tags (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.tags.bgColorLight : localConfig.tags.bgColorDark}
              onChange={(color) => updateConfig('tags', themePreview === 'light' ? 'bgColorLight' : 'bgColorDark', color)}
            />
            <AdvancedColorPicker
              label={`Texto de Tags (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.tags.textColorLight : localConfig.tags.textColorDark}
              onChange={(color) => updateConfig('tags', themePreview === 'light' ? 'textColorLight' : 'textColorDark', color)}
              supportOpacity={false}
            />
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Máximo de Tags a Mostrar
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={localConfig.tags.maxTags}
                onChange={(e) => updateConfig('tags', 'maxTags', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Author Section */}
        <CollapsibleSection
          title="Autor y Metadata"
          icon={<User className="w-5 h-5 text-pink-500" />}
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdvancedColorPicker
              label="Avatar Placeholder - Gradiente Desde"
              value={localConfig.author.avatarGradientFrom}
              onChange={(color) => updateConfig('author', 'avatarGradientFrom', color)}
              supportOpacity={false}
            />
            <AdvancedColorPicker
              label="Avatar Placeholder - Gradiente Hacia"
              value={localConfig.author.avatarGradientTo}
              onChange={(color) => updateConfig('author', 'avatarGradientTo', color)}
              supportOpacity={false}
            />
            <AdvancedColorPicker
              label={`Color del Nombre (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.author.nameColorLight : localConfig.author.nameColorDark}
              onChange={(color) => updateConfig('author', themePreview === 'light' ? 'nameColorLight' : 'nameColorDark', color)}
              supportOpacity={false}
            />
            <AdvancedColorPicker
              label={`Color de la Fecha (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.author.dateColorLight : localConfig.author.dateColorDark}
              onChange={(color) => updateConfig('author', themePreview === 'light' ? 'dateColorLight' : 'dateColorDark', color)}
              supportOpacity={false}
            />
          </div>
        </CollapsibleSection>

        {/* CTA Section */}
        <CollapsibleSection
          title="Call to Action (CTA)"
          icon={<MousePointer className="w-5 h-5 text-emerald-500" />}
          defaultOpen={false}
        >
          <ButtonConfigEditor 
            config={localConfig.cta}
            onChange={(field, value) => updateConfig('cta', field as any, value)}
            themePreview={themePreview}
          />
        </CollapsibleSection>

        {/* Image Section */}
        <CollapsibleSection
          title="Imagen Destacada"
          icon={<Image className="w-5 h-5 text-amber-500" />}
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdvancedColorPicker
              label="Fallback - Gradiente Desde"
              value={localConfig.image.fallbackGradientFrom}
              onChange={(color) => updateConfig('image', 'fallbackGradientFrom', color)}
              supportOpacity={false}
            />
            <AdvancedColorPicker
              label="Fallback - Gradiente Vía"
              value={localConfig.image.fallbackGradientVia}
              onChange={(color) => updateConfig('image', 'fallbackGradientVia', color)}
              supportOpacity={false}
            />
            <AdvancedColorPicker
              label="Fallback - Gradiente Hacia"
              value={localConfig.image.fallbackGradientTo}
              onChange={(color) => updateConfig('image', 'fallbackGradientTo', color)}
              supportOpacity={false}
            />
            <IconSelector
              label="Icono Fallback"
              iconName={localConfig.image.fallbackIconName}
              iconColor={localConfig.image.fallbackIconColor}
              onIconChange={(name) => updateConfig('image', 'fallbackIconName', name)}
              onColorChange={(color) => updateConfig('image', 'fallbackIconColor', color)}
            />
          </div>
        </CollapsibleSection>

        {/* Carousel Section */}
        <CollapsibleSection
          title="Controles del Carrusel"
          icon={<RefreshCw className="w-5 h-5 text-red-500" />}
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Intervalo de Rotación (ms)
              </label>
              <input
                type="number"
                min={2000}
                max={30000}
                step={1000}
                value={localConfig.carousel.autoRotateInterval}
                onChange={(e) => updateConfig('carousel', 'autoRotateInterval', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Actual: {localConfig.carousel.autoRotateInterval / 1000} segundos
              </p>
            </div>
            <AdvancedColorPicker
              label={`Fondo de Controles (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.carousel.controlsBgLight : localConfig.carousel.controlsBgDark}
              onChange={(color) => updateConfig('carousel', themePreview === 'light' ? 'controlsBgLight' : 'controlsBgDark', color)}
            />
            <AdvancedColorPicker
              label={`Color Icono Controles (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.carousel.controlsIconColorLight : localConfig.carousel.controlsIconColorDark}
              onChange={(color) => updateConfig('carousel', themePreview === 'light' ? 'controlsIconColorLight' : 'controlsIconColorDark', color)}
              supportOpacity={false}
            />
            <AdvancedColorPicker
              label="Indicador Activo"
              value={localConfig.carousel.indicatorActiveColor}
              onChange={(color) => updateConfig('carousel', 'indicatorActiveColor', color)}
              supportOpacity={false}
            />
            <AdvancedColorPicker
              label={`Indicador Inactivo (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.carousel.indicatorInactiveColorLight : localConfig.carousel.indicatorInactiveColorDark}
              onChange={(color) => updateConfig('carousel', themePreview === 'light' ? 'indicatorInactiveColorLight' : 'indicatorInactiveColorDark', color)}
              supportOpacity={false}
            />
          </div>
        </CollapsibleSection>

        {/* Empty State Section */}
        <CollapsibleSection
          title="Estado Vacío"
          icon={<AlertCircle className="w-5 h-5 text-gray-500" />}
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IconSelector
              label="Icono del Estado Vacío"
              iconName={localConfig.emptyState.iconName}
              iconColor={themePreview === 'light' ? localConfig.emptyState.iconColorLight : localConfig.emptyState.iconColorDark}
              onIconChange={(name) => updateConfig('emptyState', 'iconName', name)}
              onColorChange={(color) => updateConfig('emptyState', themePreview === 'light' ? 'iconColorLight' : 'iconColorDark', color)}
            />
            <AdvancedColorPicker
              label={`Color del Texto (${themePreview === 'light' ? 'Claro' : 'Oscuro'})`}
              value={themePreview === 'light' ? localConfig.emptyState.textColorLight : localConfig.emptyState.textColorDark}
              onChange={(color) => updateConfig('emptyState', themePreview === 'light' ? 'textColorLight' : 'textColorDark', color)}
              supportOpacity={false}
            />
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Mensaje de Estado Vacío
              </label>
              <input
                type="text"
                value={localConfig.emptyState.messageLight}
                onChange={(e) => {
                  updateConfig('emptyState', 'messageLight', e.target.value);
                  updateConfig('emptyState', 'messageDark', e.target.value);
                }}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Resetear a Defaults
        </button>
        
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-amber-600 dark:text-amber-400">
              • Cambios sin guardar
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className={`px-6 py-2 font-medium rounded-lg transition-all flex items-center gap-2 ${
              hasChanges
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardFeaturedPostsConfigSection;
