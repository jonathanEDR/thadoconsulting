/**
 * 🔮 InlineSuggestion Extension for TipTap
 * Muestra sugerencias de IA directamente en el editor como texto fantasma
 */

import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface InlineSuggestionOptions {
  suggestion: string | null;
  isVisible: boolean;
  onAccept: () => void;
  onReject: () => void;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineSuggestion: {
      /**
       * Actualizar la sugerencia inline
       */
      updateSuggestion: (suggestion: string | null) => ReturnType;
      /**
       * Aceptar la sugerencia
       */
      acceptSuggestion: () => ReturnType;
      /**
       * Rechazar la sugerencia
       */
      rejectSuggestion: () => ReturnType;
    };
  }
}

export const InlineSuggestion = Extension.create<InlineSuggestionOptions>({
  name: 'inlineSuggestion',

  addOptions() {
    return {
      suggestion: null,
      isVisible: false,
      onAccept: () => {},
      onReject: () => {},
    };
  },

  addCommands() {
    return {
      updateSuggestion:
        (suggestion: string | null) =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            tr.setMeta('updateSuggestion', suggestion);
          }
          return true;
        },
      acceptSuggestion:
        () =>
        ({ editor: _editor, tr, dispatch }) => {
          const suggestion = this.options.suggestion;
          if (suggestion && dispatch) {
            // Insertar la sugerencia al final del contenido
            const doc = tr.doc;
            const pos = doc.content.size;
            tr.insertText(' ' + suggestion, pos);
            this.options.onAccept();
          }
          return true;
        },
      rejectSuggestion:
        () =>
        ({ tr: _tr, dispatch }) => {
          if (dispatch) {
            this.options.onReject();
          }
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.options.suggestion && this.options.isVisible) {
          this.editor.commands.acceptSuggestion();
          return true;
        }
        return false;
      },
      Escape: () => {
        if (this.options.suggestion && this.options.isVisible) {
          this.editor.commands.rejectSuggestion();
          return true;
        }
        return false;
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('inlineSuggestion'),
        props: {
          decorations: (state) => {
            const { suggestion, isVisible } = this.options;
            
            if (!suggestion || !isVisible) {
              return DecorationSet.empty;
            }

            // Encontrar la posición al final del documento
            const doc = state.doc;
            const pos = doc.content.size;

            // Crear decoración para la sugerencia
            const decoration = Decoration.widget(
              pos,
              () => {
                const span = document.createElement('span');
                span.className = 'inline-suggestion';
                span.style.cssText = `
                  color: #8b5cf6;
                  background-color: rgba(139, 92, 246, 0.1);
                  padding: 2px 4px;
                  border-radius: 4px;
                  font-style: italic;
                  opacity: 0.8;
                  border-left: 2px solid #8b5cf6;
                  margin-left: 4px;
                  position: relative;
                `;
                span.textContent = suggestion;
                
                // Agregar indicador visual
                const indicator = document.createElement('span');
                indicator.style.cssText = `
                  position: absolute;
                  top: -2px;
                  right: -2px;
                  background: #8b5cf6;
                  color: white;
                  font-size: 10px;
                  padding: 1px 4px;
                  border-radius: 2px;
                  font-weight: bold;
                `;
                indicator.textContent = 'IA';
                span.appendChild(indicator);

                // Agregar tooltip
                span.title = 'Presiona Tab para aceptar, Esc para rechazar';

                return span;
              },
              {
                side: 1, // Mostrar después del cursor
                marks: [],
              }
            );

            return DecorationSet.create(doc, [decoration]);
          },
        },
        filterTransaction: (transaction) => {
          // Actualizar sugerencia si hay meta
          if (transaction.getMeta('updateSuggestion') !== undefined) {
            this.options.suggestion = transaction.getMeta('updateSuggestion');
          }
          return true;
        },
      }),
    ];
  },
});

export default InlineSuggestion;