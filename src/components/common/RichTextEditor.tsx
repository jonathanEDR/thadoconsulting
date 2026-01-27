/**
 * ✏️ EDITOR DE TEXTO RICO SIMPLE
 * Editor básico con funcionalidades esenciales para contenido de servicios
 */

import React, { useState, useRef } from 'react';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  maxLength?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Escribe tu contenido aquí...',
  helpText,
  required = false,
  maxLength = 5000
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    
    const newText = beforeText + before + selectedText + after + afterText;
    onChange(newText);
    
    // Restaurar focus y selección
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatMarkdown = (text: string) => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">$1</h1>')
      
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4">$1. $2</li>')
      
      // Line breaks
      .replace(/\n/g, '<br>');
  };

  const toolbarButtons = [
    { icon: 'B', action: () => insertFormatting('**', '**'), title: 'Negrita', style: 'font-bold' },
    { icon: 'I', action: () => insertFormatting('*', '*'), title: 'Cursiva', style: 'italic' },
    { icon: 'H1', action: () => insertFormatting('# ', ''), title: 'Título 1' },
    { icon: 'H2', action: () => insertFormatting('## ', ''), title: 'Título 2' },
    { icon: 'H3', action: () => insertFormatting('### ', ''), title: 'Título 3' },
    { icon: '•', action: () => insertFormatting('- ', ''), title: 'Lista' },
  ];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {helpText && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{helpText}</p>
        )}
      </div>

      {/* Toolbar and Preview Toggle */}
      <div className="flex items-center justify-between border border-gray-300 dark:border-gray-600 rounded-t-lg bg-gray-50 dark:bg-gray-800 px-3 py-2">
        {/* Toolbar */}
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              title={button.title}
              className={`
                px-2 py-1 text-sm font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-700 
                transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600
                ${button.style || ''}
              `}
            >
              {button.icon}
            </button>
          ))}
        </div>

        {/* Preview Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {value.length}/{maxLength}
          </span>
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`
              px-3 py-1 text-sm rounded transition-colors
              ${isPreview 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }
            `}
          >
            {isPreview ? '✏️ Editar' : '👁️ Vista previa'}
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="border border-t-0 border-gray-300 dark:border-gray-600 rounded-b-lg">
        {isPreview ? (
          // Preview
          <div className="p-4 min-h-32 bg-white dark:bg-gray-900 prose prose-sm max-w-none">
            {value.trim() ? (
              <div 
                dangerouslySetInnerHTML={{ __html: formatMarkdown(value) }}
                className="text-gray-900 dark:text-gray-100"
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                {placeholder}
              </p>
            )}
          </div>
        ) : (
          // Editor
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full p-4 min-h-32 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none border-0 rounded-b-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={8}
          />
        )}
      </div>

      {/* Format Help */}
      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded border">
        <p className="font-medium mb-1">💡 Formato disponible:</p>
        <div className="grid grid-cols-2 gap-2">
          <span><code>**texto**</code> = <strong>negrita</strong></span>
          <span><code>*texto*</code> = <em>cursiva</em></span>
          <span><code># Título</code> = Título grande</span>
          <span><code>- Lista</code> = • Lista</span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;