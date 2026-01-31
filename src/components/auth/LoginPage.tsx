import { SignIn } from '@clerk/clerk-react';

/**
 * Página de Login optimizada
 * - Diseño personalizado que coincide con nuestro tema
 * - Sin elementos innecesarios (signup link, etc.)
 * - Colores adaptados al tema de la aplicación
 */
const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="w-full max-w-md p-8">
        {/* Logo THADO Consulting */}
        <div className="flex justify-center mb-6">
          <img 
            src="/LOGO_PARA_FONDO_OSCURO.svg" 
            alt="THADO Consulting" 
            className="h-12 w-auto"
          />
        </div>
        <SignIn 
          routing="hash"
          signUpUrl="/signup"
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              // Contenedor principal
              rootBox: "w-full",
              card: "shadow-2xl border border-purple-500/20 bg-gradient-to-b from-gray-800 to-gray-900",
              
              // Header
              headerTitle: "text-white text-2xl font-bold",
              headerSubtitle: "text-gray-300 text-sm",
              
              // Formulario
              formButtonPrimary: `
                bg-gradient-to-r from-purple-600 to-cyan-500 
                hover:from-purple-700 hover:to-cyan-600 
                text-white font-semibold 
                transition-all duration-300 
                shadow-lg hover:shadow-purple-500/50
                border-none
              `,
              
              // Campos de entrada
              formFieldInput: `
                bg-gray-700/50 
                border-gray-600 
                text-white 
                placeholder-gray-400
                focus:border-purple-500 
                focus:ring-purple-500/20
              `,
              formFieldLabel: "text-gray-300 font-medium",
              
              // Links y texto
              formFieldAction: "text-purple-400 hover:text-purple-300",
              identityPreviewText: "text-gray-300",
              
              // Botones sociales
              socialButtonsBlockButton: `
                bg-gray-700/50 
                border-gray-600 
                text-white 
                hover:bg-gray-600/50
                transition-all duration-200
              `,
              socialButtonsBlockButtonText: "text-white font-medium",
              
              // ⚡ OCULTAR ELEMENTOS INNECESARIOS
              footer: "hidden", // Oculta "Secured by Clerk"
              formFooter: "hidden", // Oculta "Don't have an account?"
              cardFooter: "hidden", // Oculta todo el footer
              identityPreview: "hidden", // Oculta vista previa si no es necesaria
              
              // Dividers
              dividerLine: "bg-gray-600",
              dividerText: "text-gray-400 text-sm",
              
              // Loading
              spinner: "border-purple-500",
            },
            layout: {
              // ⚡ Layout simplificado
              showOptionalFields: false,
              socialButtonsPlacement: "top",
              socialButtonsVariant: "blockButton",
              logoImageUrl: "/LOGO_PARA_FONDO_OSCURO.svg",
              logoPlacement: "inside",
            },
            variables: {
              // ⚡ Variables de color personalizadas
              colorPrimary: "#8B5CF6", // Purple-500
              colorBackground: "#1F2937", // Gray-800
              colorInputBackground: "#374151", // Gray-700
              colorInputText: "#F9FAFB", // Gray-50
              colorText: "#F9FAFB", // Gray-50
              colorTextSecondary: "#D1D5DB", // Gray-300
              fontFamily: "Inter, system-ui, sans-serif",
              borderRadius: "0.75rem", // rounded-xl
            }
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;