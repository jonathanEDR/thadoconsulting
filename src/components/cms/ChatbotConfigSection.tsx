/**
 * ChatbotConfigSection Component
 * Panel de configuración del chatbot flotante en el CMS
 * 
 * Features:
 * - Configuración general (nombre, logo, mensajes)
 * - Configuración de diseño (colores, tamaños, posición)
 * - Configuración de comportamiento (autoOpen, badges)
 * - Vista previa en tiempo real
 */

import React, { useState } from 'react';
import { 
  Bot, 
  Eye, 
  Palette, 
  Settings,
  MessageCircle,
  Type,
  Layout,
  Sparkles,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import ChatbotLogoSelector from './ChatbotLogoSelector';
import type { ChatbotConfig, SuggestedQuestion } from '../../types/cms';

interface ChatbotConfigSectionProps {
  config: ChatbotConfig;
  onUpdate: (field: string, value: any) => void;
  theme: 'light' | 'dark';
}

const ChatbotConfigSection: React.FC<ChatbotConfigSectionProps> = ({
  config,
  onUpdate,
  theme
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'design' | 'behavior'>('general');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Configuración del Chatbot
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personaliza el diseño y comportamiento del asistente virtual
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Eye size={18} />
          {showPreview ? 'Ocultar Vista Previa' : 'Vista Previa'}
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSubTab === 'general'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Type size={18} />
            General
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab('design')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSubTab === 'design'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Palette size={18} />
            Diseño
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab('behavior')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSubTab === 'behavior'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings size={18} />
            Comportamiento
          </div>
        </button>
      </div>

      {/* Content based on active sub-tab */}
      <div className="mt-6">
        {activeSubTab === 'general' && (
          <GeneralSettings config={config} onUpdate={onUpdate} />
        )}
        
        {activeSubTab === 'design' && (
          <DesignSettings config={config} onUpdate={onUpdate} theme={theme} />
        )}
        
        {activeSubTab === 'behavior' && (
          <BehaviorSettings config={config} onUpdate={onUpdate} />
        )}
      </div>

      {/* Vista Previa */}
      {showPreview && (
        <ChatbotPreview config={config} theme={theme} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

// ========================================
// GENERAL SETTINGS
// ========================================
interface GeneralSettingsProps {
  config: ChatbotConfig;
  onUpdate: (field: string, value: any) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ config, onUpdate }) => {
  const [newQuestion, setNewQuestion] = useState<SuggestedQuestion>({
    icon: '💼',
    text: '',
    message: ''
  });

  const addQuestion = () => {
    if (newQuestion.text && newQuestion.message) {
      const updatedQuestions = [...(config.suggestedQuestions || []), newQuestion];
      onUpdate('chatbotConfig.suggestedQuestions', updatedQuestions);
      setNewQuestion({ icon: '💼', text: '', message: '' });
    }
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = config.suggestedQuestions.filter((_, i) => i !== index);
    onUpdate('chatbotConfig.suggestedQuestions', updatedQuestions);
  };

  return (
    <div className="space-y-6">
      {/* Información Básica */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bot size={20} />
          Información del Bot
        </h3>

        {/* Nombre del Bot */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre del Asistente
          </label>
          <input
            type="text"
            value={config.botName}
            onChange={(e) => onUpdate('chatbotConfig.botName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            placeholder="Asesor de Ventas"
          />
        </div>

        {/* Texto de Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Texto de Estado
          </label>
          <input
            type="text"
            value={config.statusText}
            onChange={(e) => onUpdate('chatbotConfig.statusText', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            placeholder="En línea • Respuesta inmediata"
          />
        </div>

        {/* Logo del Bot - Selector Avanzado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Logo del Bot
          </label>
          <ChatbotLogoSelector
            logoLight={config.logo.light || ''}
            logoDark={config.logo.dark || ''}
            logoAlt={config.botName}
            onLogoChange={(theme, url) => onUpdate(`chatbotConfig.logo.${theme}`, url)}
          />
        </div>
      </div>

      {/* Mensaje de Bienvenida */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageCircle size={20} />
          Mensaje de Bienvenida
        </h3>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título
          </label>
          <input
            type="text"
            value={config.welcomeMessage.title}
            onChange={(e) => onUpdate('chatbotConfig.welcomeMessage.title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            placeholder="¡Hola! Soy tu Asesor Virtual 👋"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            value={config.welcomeMessage.description}
            onChange={(e) => onUpdate('chatbotConfig.welcomeMessage.description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            placeholder="Estoy aquí para ayudarte con información sobre nuestros servicios..."
          />
        </div>
      </div>

      {/* Preguntas Sugeridas */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles size={20} />
          Preguntas Sugeridas (máx. 4)
        </h3>

        {/* Lista de Preguntas */}
        <div className="space-y-3">
          {config.suggestedQuestions?.map((question, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <span className="text-2xl">{question.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{question.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{question.message}</p>
              </div>
              <button
                onClick={() => removeQuestion(index)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Agregar Nueva Pregunta */}
        {(config.suggestedQuestions?.length || 0) < 4 && (
          <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                value={newQuestion.icon}
                onChange={(e) => setNewQuestion({ ...newQuestion, icon: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                placeholder="💼"
                maxLength={2}
              />
              <input
                type="text"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                className="col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Texto visible de la pregunta"
              />
            </div>
            <input
              type="text"
              value={newQuestion.message}
              onChange={(e) => setNewQuestion({ ...newQuestion, message: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Mensaje que se enviará al chatbot"
            />
            <button
              onClick={addQuestion}
              disabled={!newQuestion.text || !newQuestion.message}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Agregar Pregunta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ========================================
// DESIGN SETTINGS
// ========================================
interface DesignSettingsProps {
  config: ChatbotConfig;
  onUpdate: (field: string, value: any) => void;
  theme: 'light' | 'dark';
}

const DesignSettings: React.FC<DesignSettingsProps> = ({ config, onUpdate, theme }) => {
  const headerStyles = config.headerStyles[theme];

  return (
    <div className="space-y-6">
      {/* Estilos del Header */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Layout size={20} />
          Header del Chat ({theme === 'light' ? 'Tema Claro' : 'Tema Oscuro'})
        </h3>

        {/* Background del Header */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fondo del Header (CSS)
          </label>
          <input
            type="text"
            value={headerStyles.background}
            onChange={(e) => onUpdate(`chatbotConfig.headerStyles.${theme}.background`, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            placeholder="linear-gradient(to right, #EFF6FF, #F5F3FF)"
          />
        </div>

        {/* Color del Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color del Título
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={headerStyles.titleColor}
              onChange={(e) => onUpdate(`chatbotConfig.headerStyles.${theme}.titleColor`, e.target.value)}
              className="w-16 h-10 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              value={headerStyles.titleColor}
              onChange={(e) => onUpdate(`chatbotConfig.headerStyles.${theme}.titleColor`, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              placeholder="#111827"
            />
          </div>
        </div>

        {/* Color del Subtítulo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color del Estado/Subtítulo
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={headerStyles.subtitleColor}
              onChange={(e) => onUpdate(`chatbotConfig.headerStyles.${theme}.subtitleColor`, e.target.value)}
              className="w-16 h-10 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              value={headerStyles.subtitleColor}
              onChange={(e) => onUpdate(`chatbotConfig.headerStyles.${theme}.subtitleColor`, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              placeholder="#6B7280"
            />
          </div>
        </div>

        {/* Fondo del Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fondo del Logo (CSS)
          </label>
          <input
            type="text"
            value={headerStyles.logoBackground}
            onChange={(e) => onUpdate(`chatbotConfig.headerStyles.${theme}.logoBackground`, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            placeholder="linear-gradient(to bottom right, #3B82F6, #8B5CF6)"
          />
        </div>
      </div>

      {/* Estilos del Botón Flotante */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageCircle size={20} />
          Botón Flotante
        </h3>

        {/* Tamaño */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tamaño del Botón
          </label>
          <select
            value={config.buttonStyles.size}
            onChange={(e) => onUpdate('chatbotConfig.buttonStyles.size', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="small">Pequeño (48px)</option>
            <option value="medium">Mediano (56px)</option>
            <option value="large">Grande (64px)</option>
          </select>
        </div>

        {/* Forma */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Forma del Botón
          </label>
          <select
            value={config.buttonStyles.shape}
            onChange={(e) => onUpdate('chatbotConfig.buttonStyles.shape', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="circle">Círculo</option>
            <option value="rounded">Redondeado</option>
            <option value="square">Cuadrado</option>
          </select>
        </div>

        {/* Posición */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Distancia desde abajo
            </label>
            <input
              type="text"
              value={config.buttonStyles.position.bottom}
              onChange={(e) => onUpdate('chatbotConfig.buttonStyles.position.bottom', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              placeholder="24px"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Distancia desde derecha
            </label>
            <input
              type="text"
              value={config.buttonStyles.position.right}
              onChange={(e) => onUpdate('chatbotConfig.buttonStyles.position.right', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              placeholder="24px"
            />
          </div>
        </div>

        {/* Gradiente del Botón */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Inicial
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.buttonStyles.gradient.from}
                onChange={(e) => onUpdate('chatbotConfig.buttonStyles.gradient.from', e.target.value)}
                className="w-16 h-10 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                value={config.buttonStyles.gradient.from}
                onChange={(e) => onUpdate('chatbotConfig.buttonStyles.gradient.from', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Final
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.buttonStyles.gradient.to}
                onChange={(e) => onUpdate('chatbotConfig.buttonStyles.gradient.to', e.target.value)}
                className="w-16 h-10 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                value={config.buttonStyles.gradient.to}
                onChange={(e) => onUpdate('chatbotConfig.buttonStyles.gradient.to', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Icono Personalizado del Botón */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Icono del Botón Flotante
          </label>
          <ChatbotLogoSelector
            logoLight={config.buttonStyles.icon?.light || ''}
            logoDark={config.buttonStyles.icon?.dark || ''}
            logoAlt="Icono del botón flotante"
            onLogoChange={(theme, url) => onUpdate(`chatbotConfig.buttonStyles.icon.${theme}`, url)}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            💡 Si no subes un icono, se usará el icono de mensaje por defecto
          </p>
        </div>
      </div>
    </div>
  );
};

// ========================================
// BEHAVIOR SETTINGS
// ========================================
interface BehaviorSettingsProps {
  config: ChatbotConfig;
  onUpdate: (field: string, value: any) => void;
}

const BehaviorSettings: React.FC<BehaviorSettingsProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings size={20} />
          Comportamiento del Chatbot
        </h3>

        {/* Apertura Automática */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Abrir Automáticamente</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">El chat se abrirá solo al cargar la página</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.behavior.autoOpen}
              onChange={(e) => onUpdate('chatbotConfig.behavior.autoOpen', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Delay de Apertura */}
        {config.behavior.autoOpen && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Retardo de Apertura (milisegundos)
            </label>
            <input
              type="number"
              value={config.behavior.autoOpenDelay}
              onChange={(e) => onUpdate('chatbotConfig.behavior.autoOpenDelay', parseInt(e.target.value))}
              min="0"
              step="1000"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tiempo de espera antes de abrir el chat (por defecto: 5000ms = 5 segundos)
            </p>
          </div>
        )}

        {/* Mostrar Badge de No Leídos */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Mostrar Badge de Notificaciones</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Muestra el contador de mensajes no leídos</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.behavior.showUnreadBadge}
              onChange={(e) => onUpdate('chatbotConfig.behavior.showUnreadBadge', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Mostrar "Powered by" */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Mostrar "Powered by THADO AI"</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Muestra la marca en el footer del chat</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.behavior.showPoweredBy}
              onChange={(e) => onUpdate('chatbotConfig.behavior.showPoweredBy', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Habilitar Chatbot */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border-2 border-purple-300 dark:border-purple-600">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Habilitar Chatbot</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Activa o desactiva el chatbot en el sitio</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled !== false}
              onChange={(e) => onUpdate('chatbotConfig.enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

// ========================================
// CHATBOT PREVIEW
// ========================================
interface ChatbotPreviewProps {
  config: ChatbotConfig;
  theme: 'light' | 'dark';
  onClose: () => void;
}

const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({ config, theme, onClose }) => {
  const headerStyles = config.headerStyles[theme];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vista Previa del Chatbot</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Preview del Header */}
          <div 
            className="rounded-t-2xl p-4 flex items-center gap-3"
            style={{ background: headerStyles.background }}
          >
            {config.logo[theme] ? (
              <img 
                src={config.logo[theme]} 
                alt={config.logoAlt}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: headerStyles.logoBackground }}
              >
                <Bot size={20} className="text-white" />
              </div>
            )}
            <div>
              <h4 
                className="font-bold text-sm"
                style={{ color: headerStyles.titleColor }}
              >
                {config.botName}
              </h4>
              <p 
                className="text-xs"
                style={{ color: headerStyles.subtitleColor }}
              >
                {config.statusText}
              </p>
            </div>
          </div>

          {/* Preview del Mensaje de Bienvenida */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {config.welcomeMessage.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {config.welcomeMessage.description}
            </p>
            
            {/* Preview de Preguntas Sugeridas */}
            <div className="space-y-2">
              {config.suggestedQuestions?.slice(0, 4).map((question, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <span className="text-lg">{question.icon}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{question.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preview del Botón Flotante */}
          <div className="flex justify-end">
            <div
              className={`flex items-center justify-center text-white shadow-lg ${
                config.buttonStyles.shape === 'circle' ? 'rounded-full' :
                config.buttonStyles.shape === 'rounded' ? 'rounded-xl' : 'rounded-lg'
              } ${
                config.buttonStyles.size === 'small' ? 'w-12 h-12' :
                config.buttonStyles.size === 'medium' ? 'w-14 h-14' : 'w-16 h-16'
              }`}
              style={{
                background: `linear-gradient(to bottom right, ${config.buttonStyles.gradient.from}, ${config.buttonStyles.gradient.to})`
              }}
            >
              <MessageCircle size={config.buttonStyles.size === 'large' ? 28 : 24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotConfigSection;
