/**
 * 🎨 SidebarConfigSection
 * Panel de edición visual para configurar los colores del sidebar del dashboard
 * Soporta configuración para Admin y Cliente con modo claro/oscuro
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  User, 
  Shield, 
  Save,
  RefreshCw,
  Eye,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Grid3X3
} from 'lucide-react';
import { useDashboardSidebarConfig, DEFAULT_ADMIN_CONFIG, DEFAULT_CLIENT_CONFIG, DEFAULT_MENU_ICONS, emitSidebarConfigChanged } from '../../hooks/cms/useDashboardSidebarConfig';
import { updatePageBySlug, clearCache } from '../../services/cmsApi';
import { cms } from '../../utils/contentManagementCache';
import type { DashboardSidebarConfig } from '../../types/cms';
import DynamicIcon, { AVAILABLE_SIDEBAR_ICONS } from '../ui/DynamicIcon';

interface SidebarConfigSectionProps {
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
  supportOpacity?: boolean; // Si es true, muestra slider de opacidad
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
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
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

  const updateColor = (hexColor: string, alphaPercent: number) => {
    const alphaValue = alphaPercent / 100;
    
    if (!supportOpacity || alphaPercent === 100) {
      // Si no se soporta opacidad o es 100%, devolver hex puro
      onChange(hexColor);
    } else {
      // Convertir hex a rgba
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      onChange(`rgba(${r}, ${g}, ${b}, ${alphaValue.toFixed(2)})`);
    }
  };

  const handleTextChange = (text: string) => {
    // Permitir edición manual
    onChange(text);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Color Picker Visual */}
          <div className="relative">
            <input
              type="color"
              value={localHex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
              style={{ padding: '2px' }}
            />
            {/* Preview con opacidad */}
            {supportOpacity && localAlpha < 100 && (
              <div 
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"
                style={{ 
                  backgroundColor: value,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}
              />
            )}
          </div>
          
          {/* Input de texto */}
          <input
            type="text"
            value={value}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-32 px-2 py-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            placeholder="#000000"
          />
        </div>
      </div>
      
      {/* Slider de opacidad */}
      {supportOpacity && (
        <div className="flex items-center gap-3 pl-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 w-20">Opacidad:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={localAlpha}
            onChange={(e) => handleAlphaChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-12 text-right">
            {localAlpha}%
          </span>
        </div>
      )}
    </div>
  );
};

// Compatibilidad: ColorPicker simple sin opacidad
interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  return <AdvancedColorPicker {...props} supportOpacity={false} />;
};

// ============================================
// GRADIENT PREVIEW COMPONENT
// ============================================
interface GradientPreviewProps {
  from: string;
  via?: string;
  to: string;
  label: string;
}

const GradientPreview: React.FC<GradientPreviewProps> = ({ from, via, to, label }) => {
  const gradient = via 
    ? `linear-gradient(to right, ${from}, ${via}, ${to})`
    : `linear-gradient(to right, ${from}, ${to})`;
  
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div 
        className="w-full h-8 rounded-md shadow-inner"
        style={{ background: gradient }}
      />
      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{label}</span>
    </div>
  );
};

// ============================================
// COLLAPSIBLE SECTION COMPONENT
// ============================================
interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 
                   hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-gray-800 dark:text-gray-200">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="p-4 space-y-4 bg-white dark:bg-gray-900">
          {children}
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const SidebarConfigSection: React.FC<SidebarConfigSectionProps> = ({ onSave, onChangePending }) => {
  // Estados
  const [activeType, setActiveType] = useState<'admin' | 'client'>('admin');
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedIconPicker, setExpandedIconPicker] = useState<string | null>(null);
  
  // Obtener configuración actual (ahora con refetch)
  const { adminConfig, clientConfig, globalConfig, menuIcons, loading, refetch } = useDashboardSidebarConfig();
  
  // Estado local para edición
  const [localAdminConfig, setLocalAdminConfig] = useState(adminConfig);
  const [localClientConfig, setLocalClientConfig] = useState(clientConfig);
  const [localGlobalConfig, setLocalGlobalConfig] = useState(globalConfig);
  const [localMenuIcons, setLocalMenuIcons] = useState(menuIcons || DEFAULT_MENU_ICONS);
  
  // Sincronizar con la configuración cargada
  useEffect(() => {
    if (!loading) {
      setLocalAdminConfig(adminConfig);
      setLocalClientConfig(clientConfig);
      setLocalGlobalConfig(globalConfig);
      setLocalMenuIcons(menuIcons || DEFAULT_MENU_ICONS);
    }
  }, [loading, adminConfig, clientConfig, globalConfig, menuIcons]);

  // Marcar cambios pendientes
  const markChanged = () => {
    if (!hasChanges) {
      setHasChanges(true);
      onChangePending?.();
    }
  };

  // Actualizar configuración admin
  const updateAdminConfig = (field: string, value: string) => {
    setLocalAdminConfig(prev => ({ ...prev, [field]: value }));
    markChanged();
  };

  // Actualizar configuración cliente
  const updateClientConfig = (field: string, value: string) => {
    setLocalClientConfig(prev => ({ ...prev, [field]: value }));
    markChanged();
  };

  // Actualizar configuración global
  const updateGlobalConfig = (field: string, value: string) => {
    setLocalGlobalConfig(prev => ({ ...prev, [field]: value }));
    markChanged();
  };

  // Actualizar icono de un item del menú
  const updateMenuIcon = (menuKey: string, field: 'iconName' | 'iconColorLight' | 'iconColorDark', value: string) => {
    setLocalMenuIcons(prev => {
      const currentIcon = prev?.[menuKey] || { iconName: 'Circle', iconColorLight: '#6b7280', iconColorDark: '#9ca3af' };
      return {
        ...prev,
        [menuKey]: {
          ...currentIcon,
          [field]: value,
        },
      };
    });
    markChanged();
  };

  // Guardar configuración
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);

      const configToSave: DashboardSidebarConfig = {
        admin: localAdminConfig,
        client: localClientConfig,
        global: localGlobalConfig,
        menuIcons: localMenuIcons,
      };

      // Guardar en la base de datos
      await updatePageBySlug('dashboard-sidebar', {
        content: {
          dashboardSidebar: configToSave
        }
      });

      // Limpiar TODOS los cachés relacionados
      clearCache('dashboard-sidebar');           // Cache de cmsApi
      cms.invalidatePages('dashboard-sidebar');  // Cache del contentManagementCache
      
      // Refrescar los datos del hook para sincronizar
      await refetch();
      
      // Emitir evento global para que otros componentes se actualicen
      emitSidebarConfigChanged();

      setHasChanges(false);
      setSaveMessage({ type: 'success', text: '¡Configuración guardada correctamente!' });
      onSave?.();
      
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setSaveMessage(null), 5000);
    } catch (error) {
      console.error('❌ [SidebarConfig] Error saving sidebar config:', error);
      setSaveMessage({ type: 'error', text: 'Error al guardar la configuración' });
    } finally {
      setIsSaving(false);
    }
  };

  // Resetear a valores por defecto
  const handleReset = () => {
    if (activeType === 'admin') {
      setLocalAdminConfig(DEFAULT_ADMIN_CONFIG);
    } else {
      setLocalClientConfig(DEFAULT_CLIENT_CONFIG);
    }
    markChanged();
  };

  // Obtener config activa
  const activeConfig = activeType === 'admin' ? localAdminConfig : localClientConfig;
  const updateActiveConfig = activeType === 'admin' ? updateAdminConfig : updateClientConfig;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Configuración del Sidebar
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Personaliza los colores del menú lateral del dashboard
            </p>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                       text-gray-600 dark:text-gray-400 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Resetear
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors
              ${hasChanges 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save size={16} />}
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Mensaje de estado */}
      {saveMessage && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          saveMessage.type === 'success' 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {saveMessage.type === 'success' ? '✅' : '❌'}
          {saveMessage.text}
        </div>
      )}

      {/* Tabs: Admin / Cliente */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button
          onClick={() => setActiveType('admin')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
            activeType === 'admin'
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Shield size={18} />
          Sidebar Admin
        </button>
        <button
          onClick={() => setActiveType('client')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
            activeType === 'client'
              ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <User size={18} />
          Sidebar Cliente
        </button>
      </div>

      {/* Toggle: Modo Claro / Oscuro */}
      <div className="flex items-center justify-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <span className="text-sm text-gray-600 dark:text-gray-400">Editando colores para:</span>
        <div className="flex gap-1 p-1 bg-white dark:bg-gray-700 rounded-lg shadow-inner">
          <button
            onClick={() => setActiveTheme('light')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
              activeTheme === 'light'
                ? 'bg-yellow-100 text-yellow-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Sun size={16} />
            Claro
          </button>
          <button
            onClick={() => setActiveTheme('dark')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
              activeTheme === 'dark'
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Moon size={16} />
            Oscuro
          </button>
        </div>
      </div>

      {/* Secciones de configuración */}
      <div className="space-y-4">
        
        {/* Header Gradient */}
        <CollapsibleSection 
          title="Degradado del Header" 
          icon={<Sparkles className="w-5 h-5 text-pink-500" />}
          defaultOpen={true}
        >
          <GradientPreview 
            from={activeTheme === 'light' ? activeConfig.headerGradientFrom : activeConfig.headerGradientFromDark}
            via={activeTheme === 'light' ? activeConfig.headerGradientVia : activeConfig.headerGradientViaDark}
            to={activeTheme === 'light' ? activeConfig.headerGradientTo : activeConfig.headerGradientToDark}
            label="Vista previa"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <ColorPicker
              label="Desde"
              value={activeTheme === 'light' ? activeConfig.headerGradientFrom : activeConfig.headerGradientFromDark}
              onChange={(color) => updateActiveConfig(
                activeTheme === 'light' ? 'headerGradientFrom' : 'headerGradientFromDark', 
                color
              )}
              description="Color inicial"
            />
            <ColorPicker
              label="Medio"
              value={activeTheme === 'light' ? activeConfig.headerGradientVia : activeConfig.headerGradientViaDark}
              onChange={(color) => updateActiveConfig(
                activeTheme === 'light' ? 'headerGradientVia' : 'headerGradientViaDark', 
                color
              )}
              description="Color intermedio"
            />
            <ColorPicker
              label="Hasta"
              value={activeTheme === 'light' ? activeConfig.headerGradientTo : activeConfig.headerGradientToDark}
              onChange={(color) => updateActiveConfig(
                activeTheme === 'light' ? 'headerGradientTo' : 'headerGradientToDark', 
                color
              )}
              description="Color final"
            />
          </div>
        </CollapsibleSection>

        {/* Active Item Gradient */}
        <CollapsibleSection 
          title="Degradado de Item Activo" 
          icon={<Layers className="w-5 h-5 text-blue-500" />}
        >
          <GradientPreview 
            from={activeTheme === 'light' ? activeConfig.activeItemGradientFrom : activeConfig.activeItemGradientFromDark}
            to={activeTheme === 'light' ? activeConfig.activeItemGradientTo : activeConfig.activeItemGradientToDark}
            label="Vista previa"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <ColorPicker
              label="Desde"
              value={activeTheme === 'light' ? activeConfig.activeItemGradientFrom : activeConfig.activeItemGradientFromDark}
              onChange={(color) => updateActiveConfig(
                activeTheme === 'light' ? 'activeItemGradientFrom' : 'activeItemGradientFromDark', 
                color
              )}
              description="Color inicial del item seleccionado"
            />
            <ColorPicker
              label="Hasta"
              value={activeTheme === 'light' ? activeConfig.activeItemGradientTo : activeConfig.activeItemGradientToDark}
              onChange={(color) => updateActiveConfig(
                activeTheme === 'light' ? 'activeItemGradientTo' : 'activeItemGradientToDark', 
                color
              )}
              description="Color final del item seleccionado"
            />
          </div>
        </CollapsibleSection>

        {/* Background Colors */}
        <CollapsibleSection 
          title="Colores de Fondo" 
          icon={<Monitor className="w-5 h-5 text-gray-500" />}
          defaultOpen={true}
        >
          <div className="space-y-6">
            {/* Fondo del Sidebar */}
            <AdvancedColorPicker
              label="Fondo del Sidebar"
              value={activeTheme === 'light' ? activeConfig.sidebarBgLight : activeConfig.sidebarBgDark}
              onChange={(color) => updateActiveConfig(
                activeTheme === 'light' ? 'sidebarBgLight' : 'sidebarBgDark', 
                color
              )}
              description="Color de fondo principal"
              supportOpacity={true}
            />
            
            {/* Fondo de Navegación con opción transparente */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fondo de Navegación
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Fondo de la sección de menú</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Transparente</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={activeConfig.navBgTransparent || false}
                      onChange={(e) => updateActiveConfig('navBgTransparent', e.target.checked as unknown as string)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 
                                    peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer 
                                    dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white 
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                                    after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 
                                    after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </div>
                </label>
              </div>
              {!activeConfig.navBgTransparent && (
                <AdvancedColorPicker
                  label="Color"
                  value={activeTheme === 'light' ? activeConfig.navBgLight : activeConfig.navBgDark}
                  onChange={(color) => updateActiveConfig(
                    activeTheme === 'light' ? 'navBgLight' : 'navBgDark', 
                    color
                  )}
                  supportOpacity={true}
                />
              )}
            </div>

            {/* Fondo Hover con opciones avanzadas */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fondo Hover
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Color al pasar el mouse sobre items</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Transparente</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={activeConfig.navHoverBgTransparent || false}
                      onChange={(e) => updateActiveConfig('navHoverBgTransparent', e.target.checked as unknown as string)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 
                                    peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer 
                                    dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white 
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                                    after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 
                                    after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </div>
                </label>
              </div>
              
              {!activeConfig.navHoverBgTransparent && (
                <AdvancedColorPicker
                  label="Color"
                  value={activeTheme === 'light' ? activeConfig.navHoverBgLight : activeConfig.navHoverBgDark}
                  onChange={(color) => updateActiveConfig(
                    activeTheme === 'light' ? 'navHoverBgLight' : 'navHoverBgDark', 
                    color
                  )}
                  supportOpacity={true}
                />
              )}

              {/* Borde gradiente (solo si hover es transparente) */}
              {activeConfig.navHoverBgTransparent && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Borde Gradiente
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Añadir borde con gradiente al hacer hover</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Activar</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={activeConfig.hoverBorderGradientEnabled || false}
                          onChange={(e) => updateActiveConfig('hoverBorderGradientEnabled', e.target.checked as unknown as string)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 
                                        peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer 
                                        dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white 
                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                                        after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 
                                        after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                      </div>
                    </label>
                  </div>
                  
                  {activeConfig.hoverBorderGradientEnabled && (
                    <div className="space-y-3">
                      <GradientPreview 
                        from={activeConfig.hoverBorderGradientFrom || '#3b82f6'}
                        to={activeConfig.hoverBorderGradientTo || '#a855f7'}
                        label="Vista previa del borde"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <ColorPicker
                          label="Desde"
                          value={activeConfig.hoverBorderGradientFrom || '#3b82f6'}
                          onChange={(color) => updateActiveConfig('hoverBorderGradientFrom', color)}
                          description="Color inicial"
                        />
                        <ColorPicker
                          label="Hasta"
                          value={activeConfig.hoverBorderGradientTo || '#a855f7'}
                          onChange={(color) => updateActiveConfig('hoverBorderGradientTo', color)}
                          description="Color final"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Text Colors */}
        <CollapsibleSection 
          title="Colores de Texto" 
          icon={<span className="text-lg">Aa</span>}
        >
          <div className="space-y-4">
            <ColorPicker
              label="Texto de Navegación"
              value={activeTheme === 'light' ? activeConfig.navTextColor : activeConfig.navTextColorDark}
              onChange={(color) => updateActiveConfig(
                activeTheme === 'light' ? 'navTextColor' : 'navTextColorDark', 
                color
              )}
              description="Color del texto en el menú"
            />
          </div>
        </CollapsibleSection>

        {/* Global Settings */}
        <CollapsibleSection 
          title="Configuración Global" 
          icon={<Eye className="w-5 h-5 text-purple-500" />}
        >
          <div className="space-y-4">
            <AdvancedColorPicker
              label="Color de Borde (Claro)"
              value={localGlobalConfig.borderColorLight}
              onChange={(color) => updateGlobalConfig('borderColorLight', color)}
              description="Borde del sidebar en modo claro"
              supportOpacity={true}
            />
            <AdvancedColorPicker
              label="Color de Borde (Oscuro)"
              value={localGlobalConfig.borderColorDark}
              onChange={(color) => updateGlobalConfig('borderColorDark', color)}
              description="Borde del sidebar en modo oscuro"
              supportOpacity={true}
            />
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  URL del Logo
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Ruta o URL de la imagen del logo
                </p>
              </div>
              <input
                type="text"
                value={localGlobalConfig.logoUrl}
                onChange={(e) => updateGlobalConfig('logoUrl', e.target.value)}
                className="w-64 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                placeholder="/logos/logo-white.svg"
              />
            </div>

            {/* Configuración del Icono de Tema */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Icono de Cambio de Tema
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Icono Modo Claro */}
                <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Modo Claro (icono visible)
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(248, 250, 252, 1)' }}
                    >
                      <DynamicIcon 
                        name={localGlobalConfig.themeToggleIconLight || 'Moon'}
                        color={localGlobalConfig.themeToggleColorLight || '#f59e0b'}
                        size={22}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <select
                        value={localGlobalConfig.themeToggleIconLight || 'Moon'}
                        onChange={(e) => updateGlobalConfig('themeToggleIconLight', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded 
                                   bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        {AVAILABLE_SIDEBAR_ICONS.map(icon => (
                          <option key={icon.name} value={icon.name}>{icon.label}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localGlobalConfig.themeToggleColorLight || '#f59e0b'}
                          onChange={(e) => updateGlobalConfig('themeToggleColorLight', e.target.value)}
                          className="w-8 h-6 rounded cursor-pointer"
                        />
                        <span className="text-xs text-gray-500">Color</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Icono Modo Oscuro */}
                <div className="p-3 bg-gray-800 rounded-lg border border-gray-600">
                  <label className="text-xs font-medium text-gray-300 mb-2 block">
                    Modo Oscuro (icono visible)
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(17, 24, 39, 1)' }}
                    >
                      <DynamicIcon 
                        name={localGlobalConfig.themeToggleIconDark || 'Sun'}
                        color={localGlobalConfig.themeToggleColorDark || '#fbbf24'}
                        size={22}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <select
                        value={localGlobalConfig.themeToggleIconDark || 'Sun'}
                        onChange={(e) => updateGlobalConfig('themeToggleIconDark', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-600 rounded 
                                   bg-gray-700 text-gray-300"
                      >
                        {AVAILABLE_SIDEBAR_ICONS.map(icon => (
                          <option key={icon.name} value={icon.name}>{icon.label}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={localGlobalConfig.themeToggleColorDark || '#fbbf24'}
                          onChange={(e) => updateGlobalConfig('themeToggleColorDark', e.target.value)}
                          className="w-8 h-6 rounded cursor-pointer"
                        />
                        <span className="text-xs text-gray-400">Color</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración de Tipografía */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Tipografía del Sidebar
              </h4>
              
              <div className="space-y-4">
                {/* Selector de fuente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fuente Principal
                  </label>
                  <div className="flex items-center gap-3">
                    <select
                      value={localGlobalConfig.fontFamily || 'Montserrat'}
                      onChange={(e) => updateGlobalConfig('fontFamily', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                                 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      style={{ fontFamily: localGlobalConfig.fontFamily || 'Montserrat' }}
                    >
                      <option value="Montserrat" style={{ fontFamily: 'Montserrat' }}>Montserrat</option>
                      <option value="Inter" style={{ fontFamily: 'Inter' }}>Inter</option>
                      <option value="Roboto" style={{ fontFamily: 'Roboto' }}>Roboto</option>
                      <option value="Poppins" style={{ fontFamily: 'Poppins' }}>Poppins</option>
                      <option value="Open Sans" style={{ fontFamily: 'Open Sans' }}>Open Sans</option>
                      <option value="Lato" style={{ fontFamily: 'Lato' }}>Lato</option>
                      <option value="Raleway" style={{ fontFamily: 'Raleway' }}>Raleway</option>
                      <option value="Nunito" style={{ fontFamily: 'Nunito' }}>Nunito</option>
                      <option value="system-ui" style={{ fontFamily: 'system-ui' }}>Sistema (System UI)</option>
                    </select>
                    <div 
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm border border-gray-300 dark:border-gray-600"
                      style={{ fontFamily: localGlobalConfig.fontFamily || 'Montserrat' }}
                    >
                      Abc 123
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Esta fuente se aplicará a todo el texto del sidebar
                  </p>
                </div>

                {/* Tamaños de fuente */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Texto Base
                    </label>
                    <input
                      type="text"
                      value={localGlobalConfig.fontSizeBase || '0.875rem'}
                      onChange={(e) => updateGlobalConfig('fontSizeBase', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded 
                                 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      placeholder="0.875rem"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Texto Menú
                    </label>
                    <input
                      type="text"
                      value={localGlobalConfig.fontSizeMenu || '0.9375rem'}
                      onChange={(e) => updateGlobalConfig('fontSizeMenu', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded 
                                 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      placeholder="0.9375rem"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Texto Header
                    </label>
                    <input
                      type="text"
                      value={localGlobalConfig.fontSizeHeader || '1rem'}
                      onChange={(e) => updateGlobalConfig('fontSizeHeader', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded 
                                 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      placeholder="1rem"
                    />
                  </div>
                </div>

                {/* Pesos de fuente */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Peso Normal
                    </label>
                    <select
                      value={localGlobalConfig.fontWeightNormal || '500'}
                      onChange={(e) => updateGlobalConfig('fontWeightNormal', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded 
                                 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <option value="300">Light (300)</option>
                      <option value="400">Normal (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semibold (600)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Peso Negrita
                    </label>
                    <select
                      value={localGlobalConfig.fontWeightBold || '600'}
                      onChange={(e) => updateGlobalConfig('fontWeightBold', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded 
                                 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <option value="500">Medium (500)</option>
                      <option value="600">Semibold (600)</option>
                      <option value="700">Bold (700)</option>
                      <option value="800">Extrabold (800)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Iconos del Menú */}
        <CollapsibleSection 
          title="Iconos del Menú" 
          icon={<Grid3X3 className="w-5 h-5 text-indigo-500" />}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Selecciona el icono y configura los colores para cada item del menú según el tema (claro/oscuro).
          </p>
          <div className="space-y-4">
            {Object.entries(localMenuIcons || {}).map(([menuKey, iconConfig]) => {
              const menuLabels: Record<string, string> = {
                dashboard: 'Dashboard',
                profile: 'Perfil',
                servicios: 'Módulo Servicios',
                cms: 'CMS',
                solicitudes: 'Solicitudes',
                mensajes: 'Mensajes',
                agenda: 'Agenda',
                media: 'Media Library',
                blog: 'Blog',
                agentesIA: 'Agentes IA',
                scutiAI: 'THADO AI',
                configuracion: 'Configuración',
                actividad: 'Mi Actividad',
                usuarios: 'Gestión Usuarios',
              };

              return (
                <div 
                  key={menuKey}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    {/* Vista previa del icono con ambos temas */}
                    <div className="flex gap-2">
                      {/* Tema claro */}
                      <div 
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm"
                        title="Tema claro"
                      >
                        <DynamicIcon 
                          name={iconConfig?.iconName || 'Circle'} 
                          size={20} 
                          color={iconConfig?.iconColorLight || '#6b7280'}
                          strokeWidth={1.5}
                        />
                      </div>
                      {/* Tema oscuro */}
                      <div 
                        className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-600 shadow-sm"
                        title="Tema oscuro"
                      >
                        <DynamicIcon 
                          name={iconConfig?.iconName || 'Circle'} 
                          size={20} 
                          color={iconConfig?.iconColorDark || '#9ca3af'}
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    {/* Info del menú */}
                    <div className="flex-1">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {menuLabels[menuKey] || menuKey}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Icono: {iconConfig?.iconName || 'Circle'}
                      </p>
                    </div>

                    {/* Selector de colores */}
                    <div className="flex items-center gap-3">
                      {/* Color tema claro */}
                      <div className="flex items-center gap-1">
                        <Sun size={12} className="text-yellow-500" />
                        <input
                          type="color"
                          value={iconConfig?.iconColorLight || '#6b7280'}
                          onChange={(e) => updateMenuIcon(menuKey, 'iconColorLight', e.target.value)}
                          className="w-7 h-7 rounded cursor-pointer border border-gray-300"
                          title="Color tema claro"
                        />
                      </div>
                      {/* Color tema oscuro */}
                      <div className="flex items-center gap-1">
                        <Moon size={12} className="text-indigo-400" />
                        <input
                          type="color"
                          value={iconConfig?.iconColorDark || '#9ca3af'}
                          onChange={(e) => updateMenuIcon(menuKey, 'iconColorDark', e.target.value)}
                          className="w-7 h-7 rounded cursor-pointer border border-gray-600"
                          title="Color tema oscuro"
                        />
                      </div>
                    </div>

                    {/* Botón para abrir selector de icono */}
                    <button
                      onClick={() => setExpandedIconPicker(expandedIconPicker === menuKey ? null : menuKey)}
                      className="px-3 py-1.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 
                                 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      Cambiar icono
                    </button>
                  </div>

                  {/* Selector de icono expandido */}
                  {expandedIconPicker === menuKey && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Selecciona un icono:</p>
                      <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1 max-h-48 overflow-y-auto p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                        {AVAILABLE_SIDEBAR_ICONS.map((icon) => (
                          <button
                            key={icon.name}
                            onClick={() => {
                              updateMenuIcon(menuKey, 'iconName', icon.name);
                              setExpandedIconPicker(null);
                            }}
                            className={`p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors
                              ${iconConfig?.iconName === icon.name 
                                ? 'bg-purple-200 dark:bg-purple-800 ring-2 ring-purple-500' 
                                : 'bg-gray-50 dark:bg-gray-800'
                              }`}
                            title={icon.label}
                          >
                            <DynamicIcon 
                              name={icon.name} 
                              size={18} 
                              color={iconConfig?.iconColorLight || '#6b7280'}
                              strokeWidth={1.5}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      </div>

      {/* Preview Section */}
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Eye size={20} />
          Vista Previa del Sidebar {activeType === 'admin' ? 'Admin' : 'Cliente'}
        </h3>
        <div className="flex gap-4">
          {/* Light Preview */}
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Sun size={12} /> Modo Claro
            </p>
            <div 
              className="h-48 rounded-lg shadow-lg overflow-hidden"
              style={{ backgroundColor: activeType === 'admin' ? localAdminConfig.sidebarBgLight : localClientConfig.sidebarBgLight }}
            >
              {/* Mini Header */}
              <div 
                className="h-12 flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(to right, ${
                    activeType === 'admin' 
                      ? `${localAdminConfig.headerGradientFrom}, ${localAdminConfig.headerGradientVia}, ${localAdminConfig.headerGradientTo}`
                      : `${localClientConfig.headerGradientFrom}, ${localClientConfig.headerGradientVia}, ${localClientConfig.headerGradientTo}`
                  })`
                }}
              >
                <span className="text-white text-xs font-bold">LOGO</span>
              </div>
              {/* Mini Items */}
              <div className="p-2 space-y-1">
                <div 
                  className="h-6 rounded text-white text-xs flex items-center px-2"
                  style={{ 
                    background: `linear-gradient(to right, ${
                      activeType === 'admin' 
                        ? `${localAdminConfig.activeItemGradientFrom}, ${localAdminConfig.activeItemGradientTo}`
                        : `${localClientConfig.activeItemGradientFrom}, ${localClientConfig.activeItemGradientTo}`
                    })`
                  }}
                >
                  📊 Dashboard
                </div>
                <div 
                  className="h-6 rounded text-xs flex items-center px-2"
                  style={{ 
                    backgroundColor: activeType === 'admin' ? localAdminConfig.navHoverBgLight : localClientConfig.navHoverBgLight,
                    color: activeType === 'admin' ? localAdminConfig.navTextColor : localClientConfig.navTextColor
                  }}
                >
                  📁 Item 2
                </div>
                <div 
                  className="h-6 rounded text-xs flex items-center px-2"
                  style={{ 
                    color: activeType === 'admin' ? localAdminConfig.navTextColor : localClientConfig.navTextColor
                  }}
                >
                  ⚙️ Item 3
                </div>
              </div>
            </div>
          </div>
          
          {/* Dark Preview */}
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Moon size={12} /> Modo Oscuro
            </p>
            <div 
              className="h-48 rounded-lg shadow-lg overflow-hidden"
              style={{ backgroundColor: activeType === 'admin' ? localAdminConfig.sidebarBgDark : localClientConfig.sidebarBgDark }}
            >
              {/* Mini Header */}
              <div 
                className="h-12 flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(to right, ${
                    activeType === 'admin' 
                      ? `${localAdminConfig.headerGradientFromDark}, ${localAdminConfig.headerGradientViaDark}, ${localAdminConfig.headerGradientToDark}`
                      : `${localClientConfig.headerGradientFromDark}, ${localClientConfig.headerGradientViaDark}, ${localClientConfig.headerGradientToDark}`
                  })`
                }}
              >
                <span className="text-white text-xs font-bold">LOGO</span>
              </div>
              {/* Mini Items */}
              <div className="p-2 space-y-1">
                <div 
                  className="h-6 rounded text-white text-xs flex items-center px-2"
                  style={{ 
                    background: `linear-gradient(to right, ${
                      activeType === 'admin' 
                        ? `${localAdminConfig.activeItemGradientFromDark}, ${localAdminConfig.activeItemGradientToDark}`
                        : `${localClientConfig.activeItemGradientFromDark}, ${localClientConfig.activeItemGradientToDark}`
                    })`
                  }}
                >
                  📊 Dashboard
                </div>
                <div 
                  className="h-6 rounded text-xs flex items-center px-2"
                  style={{ 
                    backgroundColor: activeType === 'admin' ? localAdminConfig.navHoverBgDark : localClientConfig.navHoverBgDark,
                    color: activeType === 'admin' ? localAdminConfig.navTextColorDark : localClientConfig.navTextColorDark
                  }}
                >
                  📁 Item 2
                </div>
                <div 
                  className="h-6 rounded text-xs flex items-center px-2"
                  style={{ 
                    color: activeType === 'admin' ? localAdminConfig.navTextColorDark : localClientConfig.navTextColorDark
                  }}
                >
                  ⚙️ Item 3
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarConfigSection;
