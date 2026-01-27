/**
 * 🎯 SEO Canvas Context
 * Context para compartir estado del SEO Canvas entre componentes
 */

import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useSEOCanvas } from '../hooks/useSEOCanvas';
import type { SEOAnalysisResult, SEOChatMessage } from '../services/seoAgentService';

interface SEOCanvasContextType {
  // Estado
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  activeMode: 'chat' | 'analysis' | 'structure' | 'review' | 'config';
  currentAnalysis: SEOAnalysisResult | null;
  chatHistory: SEOChatMessage[];
  sessionId: string | null;
  context: any;
  
  // Permisos
  canUseAdvancedFeatures: boolean;
  canAccessConfiguration: boolean;
  
  // Acciones
  openCanvas: (mode?: 'chat' | 'analysis' | 'structure' | 'review' | 'config', newContext?: any) => Promise<void>;
  closeCanvas: () => void;
  setActiveMode: (mode: 'chat' | 'analysis' | 'structure' | 'review' | 'config') => void;
  updateContext: (newContext: any) => void;
  checkUserPermissions: () => Promise<any>;
  sendChatMessage: (message: string) => Promise<string | null>;
  executeTask: (task: any) => Promise<any>;
  analyzeContent: (content: string, title: string, description?: string, keywords?: string[]) => Promise<any>;
  optimizeContent: (content: string, title: string) => Promise<any>;
  generateStructure: (topic: string, keywords: string[], targetAudience?: string) => Promise<any>;
  reviewContent: (content?: string, title?: string, description?: string, keywords?: string[]) => Promise<any>;
  clearChatHistory: () => void;
  clearAnalysis: () => void;
  clearError: () => void;
  quickActions: any;
}

const SEOCanvasContext = createContext<SEOCanvasContextType | undefined>(undefined);

interface SEOCanvasProviderProps {
  children: ReactNode;
  initialContext?: any;
}

export const SEOCanvasProvider: React.FC<SEOCanvasProviderProps> = ({ children, initialContext }) => {
  const seoCanvas = useSEOCanvas({ initialContext });

  return (
    <SEOCanvasContext.Provider value={seoCanvas}>
      {children}
    </SEOCanvasContext.Provider>
  );
};

export const useSEOCanvasContext = () => {
  const context = useContext(SEOCanvasContext);
  if (context === undefined) {
    throw new Error('useSEOCanvasContext must be used within a SEOCanvasProvider');
  }
  return context;
};
