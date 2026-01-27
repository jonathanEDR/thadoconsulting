/**
 * 🧩 useServiceBlocks Hook
 * 
 * Hook personalizado para manejar todos los bloques del formulario de servicio.
 * Centraliza la lógica de estado de bloques y conversiones.
 */

import { useState, useCallback } from 'react';
import type { Block } from '../components/ai-assistant/BlockEditor/types';
import { useBlocksConverter } from '../components/ai-assistant/hooks/useBlocksConverter';

interface ServiceBlocksState {
  caracteristicasBlocks: Block[];
  beneficiosBlocks: Block[];
  incluyeBlocks: Block[];
  noIncluyeBlocks: Block[];
  faqBlocks: Block[];
}

interface ServiceBlocksActions {
  setCaracteristicasBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  setBeneficiosBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  setIncluyeBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  setNoIncluyeBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  setFaqBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
}

interface ServiceBlocksUtils {
  textToBlocks: (text: string, type: 'list' | 'faq') => Block[];
  blocksToText: (blocks: Block[]) => string;
  loadBlocksFromService: (serviceData: any) => void;
  getBlocksAsArrays: () => {
    caracteristicas: string[];
    beneficios: string[];
    incluye: string[];
    noIncluye: string[];
    faq: Array<{pregunta: string, respuesta: string}>;
  };
}

interface UseServiceBlocksReturn extends ServiceBlocksState, ServiceBlocksActions, ServiceBlocksUtils {}

export const useServiceBlocks = (): UseServiceBlocksReturn => {
  // Estados de bloques
  const [caracteristicasBlocks, setCaracteristicasBlocks] = useState<Block[]>([]);
  const [beneficiosBlocks, setBeneficiosBlocks] = useState<Block[]>([]);
  const [incluyeBlocks, setIncluyeBlocks] = useState<Block[]>([]);
  const [noIncluyeBlocks, setNoIncluyeBlocks] = useState<Block[]>([]);
  const [faqBlocks, setFaqBlocks] = useState<Block[]>([]);

  // Hook para conversiones
  const { textToBlocks, blocksToText } = useBlocksConverter();

  // ✅ FUNCIÓN: Cargar bloques desde datos del servicio
  const loadBlocksFromService = useCallback((serviceData: any) => {
    // Funciones auxiliares para conversión
    const arrayToText = (value: any): string => {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (Array.isArray(value)) return value.filter(Boolean).join('\n');
      return String(value);
    };

    const processFaqToText = (faq: any): string => {
      if (!faq) return '';
      if (typeof faq === 'string') return faq;
      
      if (Array.isArray(faq)) {
        return faq
          .filter(Boolean)
          .map(f => {
            if (typeof f === 'object' && f.pregunta) {
              return `P: ${f.pregunta}\nR: ${f.respuesta || ''}`;
            }
            return String(f);
          })
          .join('\n\n');
      }
      
      return String(faq);
    };

    // Convertir y establecer bloques
    setCaracteristicasBlocks(textToBlocks(arrayToText(serviceData.caracteristicas), 'list'));
    setBeneficiosBlocks(textToBlocks(arrayToText(serviceData.beneficios), 'list'));
    setIncluyeBlocks(textToBlocks(arrayToText(serviceData.incluye), 'list'));
    setNoIncluyeBlocks(textToBlocks(arrayToText(serviceData.noIncluye), 'list'));
    setFaqBlocks(textToBlocks(processFaqToText(serviceData.faq), 'faq'));
  }, [textToBlocks]);

  // ✅ FUNCIÓN: Obtener bloques como arrays para submit
  const getBlocksAsArrays = useCallback(() => {

    // Convertir texto a array limpio
    const textToArray = (text: string): string[] => {
      if (!text) return [];
      return text
        .split('\n')
        .map(line => line.trim().replace(/^[•\-\*]\s*/, ''))
        .filter(line => line.length > 0);
    };

    // Procesar FAQ de texto a objetos estructurados
    const processFaqFromText = (text: string): Array<{pregunta: string, respuesta: string}> => {
      if (!text) return [];
      
      const faqs: Array<{pregunta: string, respuesta: string}> = [];
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      
      let currentPregunta = '';
      let currentRespuesta = '';
      
      for (const line of lines) {
        if (line.match(/^P:/i)) {
          // Guardar FAQ anterior si existe
          if (currentPregunta && currentRespuesta) {
            faqs.push({ pregunta: currentPregunta, respuesta: currentRespuesta });
          }
          currentPregunta = line.replace(/^P:\s*/i, '').trim();
          currentRespuesta = '';
        } else if (line.match(/^R:/i)) {
          currentRespuesta = line.replace(/^R:\s*/i, '').trim();
        } else if (currentRespuesta) {
          currentRespuesta += ' ' + line;
        } else if (currentPregunta) {
          currentPregunta += ' ' + line;
        }
      }
      
      // Agregar el último FAQ
      if (currentPregunta && currentRespuesta) {
        faqs.push({ pregunta: currentPregunta, respuesta: currentRespuesta });
      }
      
      return faqs;
    };

    // Convertir bloques a texto primero
    const caracteristicasText = blocksToText(caracteristicasBlocks);
    const beneficiosText = blocksToText(beneficiosBlocks);
    const incluyeText = blocksToText(incluyeBlocks);
    const noIncluyeText = blocksToText(noIncluyeBlocks);
    const faqText = blocksToText(faqBlocks);

    const result = {
      caracteristicas: textToArray(caracteristicasText),
      beneficios: textToArray(beneficiosText),
      incluye: textToArray(incluyeText),
      noIncluye: textToArray(noIncluyeText),
      faq: processFaqFromText(faqText)
    };

    return result;
  }, [
    caracteristicasBlocks,
    beneficiosBlocks,
    incluyeBlocks,
    noIncluyeBlocks,
    faqBlocks,
    blocksToText
  ]);

  return {
    // Estados
    caracteristicasBlocks,
    beneficiosBlocks,
    incluyeBlocks,
    noIncluyeBlocks,
    faqBlocks,
    
    // Acciones
    setCaracteristicasBlocks,
    setBeneficiosBlocks,
    setIncluyeBlocks,
    setNoIncluyeBlocks,
    setFaqBlocks,
    
    // Utilidades
    textToBlocks,
    blocksToText,
    loadBlocksFromService,
    getBlocksAsArrays
  };
};

export default useServiceBlocks;