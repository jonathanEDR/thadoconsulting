/**
 * ✏️ RichTextEditor Component
 * Editor de contenido rico con TipTap - Versión Profesional Moderna
 * Estilo: Similar a Medium, Notion, WordPress
 * ✨ Con soporte completo de tablas
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Code,
  List, ListOrdered, Quote, Minus, Undo, Redo,
  Link2, Unlink, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image as ImageIcon, Youtube, Palette, Highlighter,
  Table as TableIcon, Plus, Trash2
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
  maxHeight?: string;
  showToolbar?: boolean;
  showWordCount?: boolean;
  className?: string;
  // Props para detección de cursor
  onCursorChange?: (position: any) => void;
  registerEditor?: (element: HTMLElement) => void;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Escribe aquí...',
  editable = true,
  minHeight = '300px',
  maxHeight = '600px',
  showToolbar = true,
  showWordCount = true,
  className = '',
  onCursorChange,
  registerEditor
}: RichTextEditorProps) {
  
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);

  // Configurar editor con extensiones profesionales
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        // ✅ IMPORTANTE: Deshabilitar las extensiones que vamos a agregar manualmente
        link: false,
        underline: false,
        // Configurar mejor espaciado para párrafos
        paragraph: {
          HTMLAttributes: {
            class: 'mb-4 leading-relaxed'
          }
        },
        // Configurar mejor espaciado para listas
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside ml-6 mb-4 space-y-2'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside ml-6 mb-4 space-y-2'
          }
        },
        // Configurar citas con mejor estilo
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300'
          }
        },
        // Configurar código con mejor estilo
        code: {
          HTMLAttributes: {
            class: 'bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400'
          }
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-900 text-gray-100 p-4 rounded-lg my-4 font-mono text-sm overflow-x-auto'
          }
        }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4 shadow-md'
        },
        inline: false
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200 dark:bg-yellow-800 px-1 rounded'
        },
        multicolor: true
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return '¿Cuál es el título?';
          }
          return placeholder;
        },
        showOnlyWhenEditable: true,
        showOnlyCurrent: false
      }),
      TextStyle,
      Color,
      // ✨ Extensiones de Tabla
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4'
        }
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-gray-200 dark:border-gray-700'
        }
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white'
        }
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300'
        }
      })
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      // Detectar cambios de cursor y posición
      if (onCursorChange) {
        const { from, to } = editor.state.selection;
        onCursorChange({ from, to, isCursor: from === to });
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none px-6 py-4 min-h-[400px] prose-headings:font-bold prose-h1:text-4xl prose-h1:mb-4 prose-h2:text-3xl prose-h2:mb-3 prose-h3:text-2xl prose-h3:mb-2 prose-p:text-base prose-p:leading-7 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:font-bold prose-ul:my-4 prose-ol:my-4 prose-li:my-1'
      },
      // ✅ CRÍTICO: Prevenir que otros handlers capturen eventos del editor
      handleDOMEvents: {
        keydown: (_view, event) => {
          // Permitir que el editor maneje sus propios atajos
          // Solo bloquear si es Tab o Escape Y hay sugerencias de IA activas
          if ((event.key === 'Tab' || event.key === 'Escape') && 
              document.querySelector('.ai-suggestion-active')) {
            return false; // Dejar pasar al handler de IA
          }
          return false; // Dejar que TipTap maneje todos los demás eventos
        },
        click: () => {
          // Siempre permitir clicks en el editor
          return false;
        }
      }
    }
  });

  // ✅ Actualizar contenido del editor cuando cambia el prop content EXTERNAMENTE
  // Solo actualizar si el contenido cambió desde fuera (ej: al cargar un post)
  // Evitar actualizar cuando el usuario está escribiendo
  useEffect(() => {
    if (!editor) return;
    
    const editorContent = editor.getHTML();
    const isEditorEmpty = editorContent === '<p></p>' || editorContent === '';
    const hasNewContent = content && content !== editorContent;
    
    // Solo actualizar si:
    // 1. El editor está vacío y hay contenido nuevo (carga inicial)
    // 2. El contenido es diferente y no está siendo editado activamente
    if (hasNewContent && (isEditorEmpty || !editor.isFocused)) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Registrar el editor DOM para detección de cursor
  useEffect(() => {
    if (editor && registerEditor) {
      const editorElement = editor.view.dom;
      registerEditor(editorElement);
    }
  }, [editor, registerEditor]);

  if (!editor) {
    return null;
  }

  // Funciones del toolbar
  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const addImage = () => {
    const url = window.prompt('🖼️ Ingresa la URL de la imagen:');
    if (url) {
      // Usar la extensión Image de TipTap para mejor manejo
      editor.chain().focus().setImage({ src: url, alt: 'Imagen del blog' }).run();
    }
  };

  const addYouTube = () => {
    const url = window.prompt('🎥 Ingresa la URL del video de YouTube:');
    if (url) {
      // Extraer ID del video
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      if (videoId) {
        // Iframe responsive con aspect ratio 16:9
        const iframe = `<div class="relative w-full" style="padding-bottom: 56.25%;"><iframe class="absolute top-0 left-0 w-full h-full rounded-lg shadow-md" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        editor.chain().focus().insertContent(iframe).run();
      } else {
        alert('❌ URL de YouTube no válida. Usa un enlace como: https://www.youtube.com/watch?v=...');
      }
    }
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  // 📊 Funciones para manipular tablas
  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    setShowTableMenu(false);
  };

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  const addColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run();
  };

  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  const addRowBefore = () => {
    editor.chain().focus().addRowBefore().run();
  };

  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  const toggleHeaderRow = () => {
    editor.chain().focus().toggleHeaderRow().run();
  };

  const mergeCells = () => {
    editor.chain().focus().mergeCells().run();
  };

  const splitCell = () => {
    editor.chain().focus().splitCell().run();
  };

  // Colores predefinidos
  const colors = [
    '#000000', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF',
    '#0000FF', '#9900FF', '#FF00FF', '#FF0080', '#FF8080'
  ];

  // Obtener estadísticas
  const text = editor.getText();
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const charCount = text.length;

  return (
    <div className={`rich-text-editor border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden ${className}`}>
      {/* Toolbar Moderno y Profesional */}
      {showToolbar && (
        <div className="border-b border-gray-300 dark:border-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-3">
          <div className="flex flex-wrap gap-2">
            
            {/* 📝 GRUPO: Formato de Texto */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">Texto</span>
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded-md transition-all duration-200 ${
                  editor.isActive('bold') 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Negrita (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>

              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded-md transition-all duration-200 ${
                  editor.isActive('italic') 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Cursiva (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>

              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded-md transition-all duration-200 ${
                  editor.isActive('underline') 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Subrayado (Ctrl+U)"
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded-md transition-all duration-200 ${
                  editor.isActive('strike') 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Tachado"
              >
                <Strikethrough className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

              <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-2 rounded-md transition-all duration-200 ${
                  editor.isActive('code') 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Código inline"
              >
                <Code className="w-4 h-4" />
              </button>

              <button
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={`p-2 rounded-md transition-all duration-200 ${
                  editor.isActive('highlight') 
                    ? 'bg-yellow-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Resaltar"
              >
                <Highlighter className="w-4 h-4" />
              </button>
            </div>

            {/* 📰 GRUPO: Encabezados */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">Título</span>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`px-3 py-2 rounded-md transition-all duration-200 font-bold text-sm ${
                  editor.isActive('heading', { level: 1 }) 
                    ? 'bg-indigo-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Encabezado 1"
              >
                H1
              </button>

              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-3 py-2 rounded-md transition-all duration-200 font-bold text-sm ${
                  editor.isActive('heading', { level: 2 }) 
                    ? 'bg-indigo-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Encabezado 2"
              >
                H2
              </button>

              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`px-3 py-2 rounded-md transition-all duration-200 font-bold text-sm ${
                  editor.isActive('heading', { level: 3 }) 
                    ? 'bg-indigo-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Encabezado 3"
              >
                H3
              </button>
            </div>

            {/* 📋 GRUPO: Listas y Bloques */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">Bloques</span>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-md transition-all duration-200 ${
                  editor.isActive('bulletList') 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Lista con viñetas"
              >
                <List className="w-4 h-4" />
              </button>

              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded-md transition-all duration-200 ${
                  editor.isActive('orderedList') 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Lista numerada"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded-md transition-all duration-200 ${
                  editor.isActive('blockquote') 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Cita"
              >
                <Quote className="w-4 h-4" />
              </button>

              <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="p-2 rounded-md transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Línea separadora"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* 📐 GRUPO: Alineación */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">Alinear</span>
              <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded-md transition-all duration-200 ${
                  editor.isActive({ textAlign: 'left' }) 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Izquierda"
              >
                <AlignLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded-md transition-all duration-200 ${
                  editor.isActive({ textAlign: 'center' }) 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Centro"
              >
                <AlignCenter className="w-4 h-4" />
              </button>

              <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded-md transition-all duration-200 ${
                  editor.isActive({ textAlign: 'right' }) 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Derecha"
              >
                <AlignRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`p-2 rounded-md transition-all duration-200 ${
                  editor.isActive({ textAlign: 'justify' }) 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Justificar"
              >
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>

            {/* 🔗 GRUPO: Enlaces y Media */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">Media</span>
              <div className="relative">
                <button
                  onClick={() => setShowLinkInput(!showLinkInput)}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    editor.isActive('link') 
                      ? 'bg-cyan-500 text-white shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Enlace"
                >
                  <Link2 className="w-4 h-4" />
                </button>

                {showLinkInput && (
                  <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-3 z-20 w-72">
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://ejemplo.com"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md mb-2 focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setLink();
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={setLink}
                        className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                      >
                        Insertar
                      </button>
                      <button
                        onClick={() => setShowLinkInput(false)}
                        className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={unsetLink}
                disabled={!editor.isActive('link')}
                className="p-2 rounded-md transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Quitar enlace"
              >
                <Unlink className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

              <button
                onClick={addImage}
                className="p-2 rounded-md transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Imagen"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                onClick={addYouTube}
                className="p-2 rounded-md transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </button>
            </div>

            {/* 🎨 GRUPO: Color */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 rounded-md transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Color"
                >
                  <Palette className="w-4 h-4" />
                </button>

                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-3 z-20">
                    <div className="grid grid-cols-5 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setColor(color)}
                          className="w-7 h-7 rounded-md border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 📊 GRUPO: Tablas (NUEVO) */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">Tabla</span>
              <div className="relative">
                <button
                  onClick={() => setShowTableMenu(!showTableMenu)}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    editor.isActive('table') 
                      ? 'bg-teal-500 text-white shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Insertar tabla"
                >
                  <TableIcon className="w-4 h-4" />
                </button>

                {showTableMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-3 z-20 w-64">
                    <div className="space-y-2">
                      {!editor.isActive('table') ? (
                        <button
                          onClick={insertTable}
                          className="w-full px-3 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 font-medium flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Insertar Tabla 3x3
                        </button>
                      ) : (
                        <>
                          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 pb-2 border-b border-gray-200 dark:border-gray-600">
                            Editar Tabla
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Columnas:</div>
                            <div className="flex gap-1">
                              <button
                                onClick={addColumnBefore}
                                className="flex-1 px-2 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
                                title="Agregar columna antes"
                              >
                                ← Agregar
                              </button>
                              <button
                                onClick={addColumnAfter}
                                className="flex-1 px-2 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
                                title="Agregar columna después"
                              >
                                Agregar →
                              </button>
                              <button
                                onClick={deleteColumn}
                                className="px-2 py-1.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                                title="Eliminar columna"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Filas:</div>
                            <div className="flex gap-1">
                              <button
                                onClick={addRowBefore}
                                className="flex-1 px-2 py-1.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50"
                                title="Agregar fila arriba"
                              >
                                ↑ Agregar
                              </button>
                              <button
                                onClick={addRowAfter}
                                className="flex-1 px-2 py-1.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50"
                                title="Agregar fila abajo"
                              >
                                Agregar ↓
                              </button>
                              <button
                                onClick={deleteRow}
                                className="px-2 py-1.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                                title="Eliminar fila"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-200 dark:border-gray-600 space-y-1">
                            <button
                              onClick={toggleHeaderRow}
                              className="w-full px-2 py-1.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50"
                            >
                              Toggle Header Row
                            </button>
                            <button
                              onClick={mergeCells}
                              className="w-full px-2 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              Combinar Celdas
                            </button>
                            <button
                              onClick={splitCell}
                              className="w-full px-2 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              Dividir Celda
                            </button>
                            <button
                              onClick={deleteTable}
                              className="w-full px-2 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                            >
                              Eliminar Tabla
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ↩️ GRUPO: Deshacer/Rehacer */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-2 rounded-md transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Deshacer (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>

              <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-2 rounded-md transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Rehacer (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Editor Content - Área de escritura profesional con mejor espaciado */}
      <div 
        className="overflow-y-auto bg-white dark:bg-gray-800"
        style={{ minHeight, maxHeight }}
      >
        <EditorContent 
          editor={editor} 
          className="prose-editor-content"
        />
      </div>

      {/* Footer con estadísticas mejorado */}
      {showWordCount && (
        <div className="border-t border-gray-300 dark:border-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-4 py-3 flex items-center justify-between text-sm">
          <div className="flex gap-6">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              📝 {wordCount} palabras
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {charCount} caracteres
            </span>
            {editor.isActive('table') && (
              <span className="text-teal-600 dark:text-teal-400 font-medium">
                📊 Tabla activa
              </span>
            )}
          </div>
          
          {!editable && (
            <span className="text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1">
              🔒 Solo lectura
            </span>
          )}
        </div>
      )}
    </div>
  );
}
