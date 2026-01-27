import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useUser();

  // Mientras carga la información de autenticación
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al home
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
}
