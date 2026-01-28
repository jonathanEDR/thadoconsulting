import { SignUp } from '@clerk/clerk-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  // Logo según el tema
  const logoSrc = theme === 'dark'
    ? '/logotemaoscuro.png'  // Logo claro para tema oscuro
    : '/logotemaclaro.png';   // Logo oscuro para tema claro

  // Asegurar que el tema se haya cargado antes de renderizar
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Pequeño delay para asegurar que el tema se aplique

    return () => clearTimeout(timer);
  }, [theme]);

  // Configuración dinámica de apariencia según el tema
  const appearance = {
    baseTheme: theme === 'dark' ? undefined : undefined,
    variables: {
      colorPrimary: '#8B5CF6',
      colorBackground: theme === 'dark' ? '#1a1a1a' : '#FFFFFF',
      colorText: theme === 'dark' ? '#FFFFFF' : '#1F2937',
      colorTextSecondary: theme === 'dark' ? '#a1a1aa' : '#6B7280',
      colorInputBackground: theme === 'dark' ? '#27272a' : '#FFFFFF',
      colorInputText: theme === 'dark' ? '#FFFFFF' : '#1F2937',
      borderRadius: '8px',
    },
    elements: {
      rootBox: {
        width: '100%',
        maxWidth: '420px'
      },
      card: {
        backgroundColor: theme === 'dark' ? '#18181b' : '#FFFFFF',
        border: theme === 'dark' ? '1px solid #27272a' : '1px solid #E5E7EB',
        boxShadow: theme === 'dark'
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(139, 92, 246, 0.1)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: '16px',
        padding: '32px'
      },
      headerTitle: {
        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
        fontSize: '24px',
        fontWeight: '700'
      },
      headerSubtitle: {
        color: theme === 'dark' ? '#a1a1aa' : '#6B7280'
      },
      socialButtonsBlockButton: {
        backgroundColor: theme === 'dark' ? '#27272a' : '#F3F4F6',
        border: theme === 'dark' ? '1px solid #3f3f46' : '1px solid #E5E7EB',
        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
        '&:hover': {
          backgroundColor: theme === 'dark' ? '#3f3f46' : '#E5E7EB'
        }
      },
      formFieldLabel: {
        color: theme === 'dark' ? '#a1a1aa' : '#374151'
      },
      formFieldInput: {
        backgroundColor: theme === 'dark' ? '#27272a' : '#FFFFFF',
        border: theme === 'dark' ? '1px solid #3f3f46' : '1px solid #D1D5DB',
        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
        '&:focus': {
          borderColor: '#8B5CF6',
          boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)'
        },
        '&::placeholder': {
          color: theme === 'dark' ? '#71717a' : '#9CA3AF'
        }
      },
      formButtonPrimary: {
        backgroundColor: '#8B5CF6',
        color: '#FFFFFF',
        fontWeight: '600',
        '&:hover': {
          backgroundColor: '#7C3AED'
        }
      },
      dividerLine: {
        backgroundColor: theme === 'dark' ? '#3f3f46' : '#E5E7EB'
      },
      dividerText: {
        color: theme === 'dark' ? '#71717a' : '#6B7280'
      },
      identityPreviewText: {
        color: theme === 'dark' ? '#FFFFFF' : '#1F2937'
      },
      identityPreviewEditButton: {
        color: '#8B5CF6'
      },
      formFieldInputShowPasswordButton: {
        color: theme === 'dark' ? '#a1a1aa' : '#6B7280'
      },
      otpCodeFieldInput: {
        backgroundColor: theme === 'dark' ? '#27272a' : '#FFFFFF',
        border: theme === 'dark' ? '1px solid #3f3f46' : '1px solid #D1D5DB',
        color: theme === 'dark' ? '#FFFFFF' : '#1F2937'
      },
      formResendCodeLink: {
        color: '#8B5CF6'
      },
      alertText: {
        color: theme === 'dark' ? '#fca5a5' : '#DC2626'
      },
      // ⚡ OCULTAR elementos que no queremos
      footer: {
        display: 'none'
      },
      footerAction: {
        display: 'none'
      },
      footerActionText: {
        display: 'none'
      },
      footerActionLink: {
        display: 'none'
      }
    },
    layout: {
      socialButtonsPlacement: 'top' as const,
      socialButtonsVariant: 'blockButton' as const
    }
  };

  // Mostrar loading mientras se aplica el tema
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundColor: '#000000' // Fondo negro por defecto
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden"
      style={{
        backgroundColor: theme === 'dark' ? '#000000' : '#F9FAFB'
      }}
    >
      {/* Efecto de fondo con gradiente */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(ellipse at top, rgba(117, 40, 238, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(1, 194, 204, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at top, rgba(117, 40, 238, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(1, 194, 204, 0.05) 0%, transparent 50%)'
        }}
      />

      {/* Contenedor principal */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        {/* Logo y enlace al Home */}
        <Link
          to="/"
          className="mb-8 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg"
          title="Volver al inicio"
        >
          <img
            src={logoSrc}
            alt="THADO Consulting"
            className="h-12 w-auto"
          />
        </Link>

        {/* Formulario de Clerk */}
        <SignUp
          appearance={appearance}
          redirectUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />

        {/* Enlace para volver */}
        <Link
          to="/"
          className="mt-6 text-sm transition-colors duration-200 flex items-center gap-2 group"
          style={{
            color: theme === 'dark' ? '#a1a1aa' : '#6B7280'
          }}
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="group-hover:underline">Volver al sitio web</span>
        </Link>
      </div>
    </div>
  );
};

export default Signup;