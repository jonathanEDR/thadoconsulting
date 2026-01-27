/**
 * 👁️ ContentPreview Component
 * Vista previa del contenido HTML sanitizado
 */

import { sanitizeHTML } from '../../../utils/blog';

interface ContentPreviewProps {
  content: string;
  className?: string;
}

export default function ContentPreview({
  content,
  className = ''
}: ContentPreviewProps) {
  
  // Sanitizar el contenido antes de renderizar
  const safeContent = sanitizeHTML(content);

  return (
    <div 
      className={`content-preview prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: safeContent }}
    />
  );
}
