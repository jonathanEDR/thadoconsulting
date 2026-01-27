/**
 * 🤖 AIFieldButton - VERSIÓN CORREGIDA
 * Botón "✨ Generar" que aparece junto a inputs para generar contenido con IA
 * 
 * FIXES APLICADOS:
 * ✅ Mejorado manejo de estado del modal
 * ✅ Agregado debug logs para troubleshooting
 * ✅ Mejorado cleanup en unmount
 * ✅ Portal para el modal (opcional)
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { createPortal } from 'react-dom';
import AIGenerationModal from './AIGenerationModal_Fixed';

interface AIFieldButtonProps {
  fieldName: string;
  fieldLabel: string;
  fieldType: 'title' | 'short_text' | 'long_text' | 'list' | 'faq' | 'promotional';
  currentValue?: string;
  serviceContext?: {
    serviceId?: string;
    titulo?: string;
    descripcionCorta?: string;
    categoria?: string;
  };
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  usePortal?: boolean; // Opción para usar portal
}

const AIFieldButton: React.FC<AIFieldButtonProps> = ({
  fieldName,
  fieldLabel,
  fieldType,
  currentValue,
  serviceContext,
  disabled = false,
  size = 'md',
  usePortal = true
}) => {
  const [showModal, setShowModal] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mountedRef = useRef(true);

  // 🔧 FIX: Mejorado manejo de apertura
  const handleOpen = useCallback(() => {
    if (disabled) return;
    
    console.log('🔄 [AIFieldButton] Abriendo modal para:', fieldName);
    setShowModal(true);
  }, [disabled, fieldName]);

  // 🔧 FIX: Mejorado manejo de cierre con validaciones
  const handleClose = useCallback(() => {
    console.log('🔄 [AIFieldButton] Cerrando modal para:', fieldName);
    
    // Verificar que el componente sigue montado
    if (!mountedRef.current) {
      console.log('⚠️ [AIFieldButton] Componente desmontado, ignorando cierre');
      return;
    }

    // Cerrar modal de forma segura
    try {
      setShowModal(false);
      console.log('✅ [AIFieldButton] Modal cerrado exitosamente');
    } catch (error) {
      console.error('❌ [AIFieldButton] Error al cerrar modal:', error);
    }
  }, [fieldName]);

  // 🔧 FIX: Cleanup en unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      console.log('🧹 [AIFieldButton] Cleanup ejecutado para:', fieldName);
    };
  }, [fieldName]);

  // 🔧 FIX: Limpiar modal si el componente se desmonta mientras está abierto
  useEffect(() => {
    if (showModal) {
      console.log('👁️ [AIFieldButton] Modal abierto para:', fieldName);
    }
  }, [showModal, fieldName]);

  // Tamaños del botón
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  // Renderizar modal
  const renderModal = () => {
    if (!showModal) return null;

    const modal = (
      <AIGenerationModal
        fieldName={fieldName}
        fieldLabel={fieldLabel}
        fieldType={fieldType}
        currentValue={currentValue}
        serviceContext={serviceContext}
        onClose={handleClose}
      />
    );

    // 🔧 FIX: Usar portal para evitar conflictos de z-index y eventos
    if (usePortal) {
      const portalRoot = document.getElementById('modal-root') || document.body;
      return createPortal(modal, portalRoot);
    }

    return modal;
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`
          inline-flex items-center gap-1.5
          ${sizeClasses[size]}
          bg-gradient-to-r from-purple-600 to-blue-600
          hover:from-purple-700 hover:to-blue-700
          text-white font-medium rounded-lg
          shadow-sm hover:shadow-md
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
          transform hover:scale-105 active:scale-95
        `}
        title={`Generar ${fieldLabel} con IA`}
        aria-label={`Generar ${fieldLabel} con IA`}
      >
        <Sparkles className={`${iconSizes[size]} ${showModal ? 'animate-pulse' : ''}`} />
        <span>Generar</span>
      </button>

      {renderModal()}
    </>
  );
};

export default AIFieldButton;