import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Mark, mergeAttributes } from '@tiptap/core';
import { useEffect, useState, useRef } from 'react';
import '../styles/editor.css';

// Extensión personalizada para gradientes de texto
const TextGradient = Mark.create({
  name: 'textGradient',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      gradient: {
        default: null,
        parseHTML: element => element.getAttribute('data-gradient'),
        renderHTML: attributes => {
          if (!attributes.gradient) {
            return {};
          }
          return {
            'data-gradient': attributes.gradient,
            style: `background: ${attributes.gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent;`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-gradient]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setTextGradient: (gradient: string) => ({ commands }) => {
        return commands.setMark(this.name, { gradient });
      },
      unsetTextGradient: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },
});

// Declarar los tipos para los comandos personalizados
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textGradient: {
      setTextGradient: (gradient: string) => ReturnType;
      unsetTextGradient: () => ReturnType;
    };
  }
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  label?: string;
}

// Componente para el selector de color/gradiente
interface ColorGradientPickerProps {
  editor: any;
}

const ColorGradientPicker: React.FC<ColorGradientPickerProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'solid' | 'gradient'>('solid');
  const [solidColor, setSolidColor] = useState('#000000');
  const [gradientFrom, setGradientFrom] = useState('#8B5CF6');
  const [gradientTo, setGradientTo] = useState('#06B6D4');
  const [gradientDirection, setGradientDirection] = useState('90deg');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Cerrar popover al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyColor = () => {
    if (mode === 'solid') {
      // Primero quitar cualquier gradiente existente
      editor.chain().focus().unsetTextGradient().setColor(solidColor).run();
    } else {
      // Verificar que hay texto seleccionado
      const { from, to } = editor.state.selection;
      if (from === to) {
        alert('Selecciona texto primero para aplicar el gradiente');
        return;
      }
      
      // Crear el gradiente CSS
      const gradient = `linear-gradient(${gradientDirection}, ${gradientFrom}, ${gradientTo})`;
      
      // Aplicar el gradiente usando la extensión personalizada
      editor.chain().focus().unsetColor().setTextGradient(gradient).run();
    }
    setIsOpen(false);
  };

  const resetColor = () => {
    editor.chain().focus().unsetColor().unsetTextGradient().run();
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center" ref={popoverRef}>
      <label className="text-xs text-gray-600 dark:text-gray-300 mr-1">Color:</label>
      
      {/* Botón para abrir el popover */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-500 cursor-pointer flex items-center justify-center overflow-hidden"
        style={{
          background: mode === 'gradient' 
            ? `linear-gradient(${gradientDirection}, ${gradientFrom}, ${gradientTo})`
            : solidColor
        }}
        title="Selector de color/gradiente"
      >
        {mode === 'gradient' && <span className="text-white text-xs font-bold drop-shadow">G</span>}
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-4 min-w-[280px]">
          {/* Tabs para cambiar entre sólido y gradiente */}
          <div className="flex mb-4 border-b border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={() => setMode('solid')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                mode === 'solid'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              🎨 Color Sólido
            </button>
            <button
              type="button"
              onClick={() => setMode('gradient')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                mode === 'gradient'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              ✨ Gradiente
            </button>
          </div>

          {mode === 'solid' ? (
            /* Modo color sólido */
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              {/* Vista previa */}
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <span style={{ color: solidColor }} className="text-lg font-semibold">
                  Vista previa
                </span>
              </div>
            </div>
          ) : (
            /* Modo gradiente */
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color Inicio</label>
                  <div className="flex gap-1">
                    <input
                      type="color"
                      value={gradientFrom}
                      onChange={(e) => setGradientFrom(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={gradientFrom}
                      onChange={(e) => setGradientFrom(e.target.value)}
                      className="flex-1 px-1 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Color Fin</label>
                  <div className="flex gap-1">
                    <input
                      type="color"
                      value={gradientTo}
                      onChange={(e) => setGradientTo(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={gradientTo}
                      onChange={(e) => setGradientTo(e.target.value)}
                      className="flex-1 px-1 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-0"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Dirección</label>
                <select
                  value={gradientDirection}
                  onChange={(e) => setGradientDirection(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="90deg">Horizontal →</option>
                  <option value="180deg">Vertical ↓</option>
                  <option value="135deg">Diagonal ↘</option>
                  <option value="45deg">Diagonal ↗</option>
                  <option value="270deg">Izquierda ←</option>
                  <option value="0deg">Arriba ↑</option>
                </select>
              </div>
              
              {/* Vista previa del gradiente */}
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <span 
                  className="text-lg font-semibold"
                  style={{ 
                    background: `linear-gradient(${gradientDirection}, ${gradientFrom}, ${gradientTo})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Vista previa gradiente
                </span>
              </div>
              
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ Selecciona texto antes de aplicar el gradiente
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={applyColor}
              className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
            >
              ✓ Aplicar
            </button>
            <button
              type="button"
              onClick={resetColor}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const RichTextEditor = ({ value, onChange, placeholder, label }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        },
        // Deshabilitamos las extensiones que vamos a agregar manualmente
        link: false, // Deshabilitamos el link de StarterKit para usar nuestra configuración
        underline: false, // Deshabilitamos underline de StarterKit para usar nuestra configuración
      }),
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Color,
      TextGradient, // Extensión personalizada para gradientes de texto
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline, // Esta extensión NO está en StarterKit, así que es seguro agregarla
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-600 underline',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
  });

  // Actualizar contenido cuando el valor externo cambia
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-colors">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 px-4 pt-3">
          {label}
        </label>
      )}

      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2 flex flex-wrap gap-1">
        {/* Headings */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1 rounded text-sm font-bold ${
              editor.isActive('heading', { level: 1 }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Título 1"
            type="button"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 rounded text-sm font-bold ${
              editor.isActive('heading', { level: 2 }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Título 2"
            type="button"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 rounded text-sm font-bold ${
              editor.isActive('heading', { level: 3 }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Título 3"
            type="button"
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('paragraph') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Párrafo"
            type="button"
          >
            P
          </button>
        </div>

        {/* Font Family */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <select
            onChange={(e) => {
              if (e.target.value === 'unset') {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(e.target.value).run();
              }
            }}
            className="px-2 py-1 rounded text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200"
            title="Tipo de fuente"
          >
            <option value="unset">Por defecto</option>
            <option value="Montserrat">Montserrat</option>
            <option value="'Open Sans'">Open Sans</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="'Times New Roman'">Times New Roman</option>
            <option value="'Courier New'">Courier New</option>
            <option value="Verdana">Verdana</option>
            <option value="'Comic Sans MS'">Comic Sans</option>
            <option value="Impact">Impact</option>
          </select>
        </div>

        {/* Text Formatting */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded text-sm font-bold ${
              editor.isActive('bold') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Negrita"
            type="button"
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded text-sm italic ${
              editor.isActive('italic') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Cursiva"
            type="button"
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1 rounded text-sm underline ${
              editor.isActive('underline') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Subrayado"
            type="button"
          >
            U
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-3 py-1 rounded text-sm line-through ${
              editor.isActive('strike') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Tachado"
            type="button"
          >
            S
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Alinear izquierda"
            type="button"
          >
            ←
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Centrar"
            type="button"
          >
            ↔
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Alinear derecha"
            type="button"
          >
            →
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Justificar"
            type="button"
          >
            ⇄
          </button>
        </div>

        {/* Lists */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('bulletList') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Lista con viñetas"
            type="button"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('orderedList') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Lista numerada"
            type="button"
          >
            1.
          </button>
        </div>

        {/* Link */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <button
            onClick={setLink}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('link') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Insertar enlace"
            type="button"
          >
            🔗
          </button>
          {editor.isActive('link') && (
            <button
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
              title="Quitar enlace"
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        {/* Text Color - Selector mejorado con gradientes */}
        <ColorGradientPicker editor={editor} />

        {/* Clear Formatting */}
        <div className="flex ml-auto">
          <button
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            className="px-3 py-1 rounded text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50"
            title="Limpiar formato"
            type="button"
          >
            Limpiar formato
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-white dark:bg-gray-800">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      {/* Character count */}
      <div className="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
        {editor.storage.characterCount?.characters() || 0} caracteres
      </div>
    </div>
  );
};

export default RichTextEditor;
