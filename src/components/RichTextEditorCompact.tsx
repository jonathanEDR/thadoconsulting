import React from 'react';
import RichTextEditor from './RichTextEditor';
import CompactColorSelector from './CompactColorSelector';

interface ThemeColors {
  light: string;
  dark: string;
}

interface RichTextEditorCompactProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  themeColors?: ThemeColors;
  onThemeColorChange?: (mode: 'light' | 'dark', color: string) => void;
}

const RichTextEditorCompact: React.FC<RichTextEditorCompactProps> = ({
  label,
  value,
  onChange,
  placeholder,
  themeColors,
  onThemeColorChange
}) => {
  return (
    <div className="w-full">
      {/* Label con selectores de color integrados */}
      <CompactColorSelector
        label={label}
        themeColors={themeColors}
        onThemeColorChange={onThemeColorChange}
      />

      {/* Editor de texto rico usando todo el ancho */}
      <div className="w-full">
        <RichTextEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default RichTextEditorCompact;