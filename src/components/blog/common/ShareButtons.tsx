/**
 * 🔗 ShareButtons Component
 * Botones para compartir en redes sociales
 */

import { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, Check, Mail } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  variant?: 'default' | 'minimal' | 'floating';
  className?: string;
}

export default function ShareButtons({
  url,
  title,
  description = '',
  variant = 'default',
  className = ''
}: ShareButtonsProps) {
  
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // URLs de compartir
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + url)}`
  };

  // Copiar al portapapeles
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Abrir ventana de compartir
  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  // Share API nativa (si está disponible)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        setShowMenu(false);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error al compartir:', err);
        }
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  // ============================================
  // VARIANTE FLOATING
  // ============================================
  if (variant === 'floating') {
    return (
      <div className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 ${className}`}>
        <div className="flex flex-col gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <button
            onClick={() => handleShare(shareUrls.twitter)}
            className="p-2 text-gray-600 hover:text-[#1DA1F2] hover:bg-blue-50 rounded-lg transition-colors"
            title="Compartir en Twitter"
          >
            <Twitter className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleShare(shareUrls.facebook)}
            className="p-2 text-gray-600 hover:text-[#4267B2] hover:bg-blue-50 rounded-lg transition-colors"
            title="Compartir en Facebook"
          >
            <Facebook className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleShare(shareUrls.linkedin)}
            className="p-2 text-gray-600 hover:text-[#0077B5] hover:bg-blue-50 rounded-lg transition-colors"
            title="Compartir en LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleShare(shareUrls.email)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            title="Compartir por email"
          >
            <Mail className="w-5 h-5" />
          </button>

          <div className="h-px bg-gray-200 my-1" />

          <button
            onClick={handleCopyLink}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title={copied ? 'Copiado!' : 'Copiar enlace'}
          >
            {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // VARIANTE MINIMAL
  // ============================================
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartir</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title={copied ? 'Copiado!' : 'Copiar enlace'}
        >
          {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  // ============================================
  // VARIANTE DEFAULT
  // ============================================
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartir</span>
        </button>

        {/* Menú desplegable */}
        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-20 min-w-[200px]">
              <button
                onClick={() => handleShare(shareUrls.twitter)}
                className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                <span>Twitter</span>
              </button>

              <button
                onClick={() => handleShare(shareUrls.facebook)}
                className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5 text-[#4267B2]" />
                <span>Facebook</span>
              </button>

              <button
                onClick={() => handleShare(shareUrls.linkedin)}
                className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Linkedin className="w-5 h-5 text-[#0077B5]" />
                <span>LinkedIn</span>
              </button>

              <button
                onClick={() => handleShare(shareUrls.email)}
                className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-600" />
                <span>Email</span>
              </button>

              <div className="h-px bg-gray-200 my-2" />

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-5 h-5 text-gray-600" />
                    <span>Copiar enlace</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
