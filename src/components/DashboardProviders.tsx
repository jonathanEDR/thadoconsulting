import { AuthProvider } from './AuthProvider';

interface DashboardProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers específicos para el Dashboard
 * Ya no incluye ClerkProvider porque ahora es global en App.tsx
 * Solo incluye AuthProvider y otros providers específicos del dashboard
 */
export const DashboardProviders = ({ children }: DashboardProvidersProps) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
