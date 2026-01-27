/**
 * 📦 Tipos para el Sistema de Bloques
 * Sistema flexible para crear contenido estructurado (características, beneficios, FAQ)
 */

export type BlockType = 'text' | 'list-item' | 'faq-item';

export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

export interface ListItemBlock extends BaseBlock {
  type: 'list-item';
  content: string;
  icon?: string; // Emoji o icono opcional
}

export interface FAQItemBlock extends BaseBlock {
  type: 'faq-item';
  question: string;
  answer: string;
}

export type Block = TextBlock | ListItemBlock | FAQItemBlock;

export interface BlockEditorConfig {
  title: string;
  allowedTypes: BlockType[];
  placeholder?: string;
  maxBlocks?: number;
  aiGenerationPrompt?: string;
}
