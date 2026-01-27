/**
 * 🛡️ Services Canvas Error Boundary
 * Captura errores en paneles del Services Canvas
 * Evita que errores rompan toda la interfaz
 * 
 * Características:
 * - Fallback UI elegante
 * - Reporte de errores opcional
 * - Botón de recuperación
 * - Información de debug en desarrollo
 */

import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

class ServicesCanvasErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Reportar error al callback opcional
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log en desarrollo
    if (import.meta.env?.DEV) {
      console.group('🛡️ ServicesCanvas Error Boundary');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      const {
        fallbackTitle = 'Error en Services Canvas',
        fallbackMessage = 'Ocurrió un error inesperado en este panel. Puedes intentar recargar o contactar soporte.'
      } = this.props;

      return (
        <div className="flex flex-col items-center justify-center h-full min-h-96 p-8 bg-red-50 rounded-lg border border-red-200">
          {/* Icono de error */}
          <div className="p-4 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          {/* Título y mensaje */}
          <h3 className="text-lg font-semibold text-red-800 mb-2 text-center">
            {fallbackTitle}
          </h3>
          <p className="text-sm text-red-600 mb-6 text-center max-w-md">
            {fallbackMessage}
          </p>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={this.handleRetry}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Reintentar</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Recargar Página</span>
            </button>
          </div>

          {/* Info de debug en desarrollo */}
          {import.meta.env?.DEV && this.state.error && (
            <details className="mt-6 w-full max-w-2xl">
              <summary className="flex items-center space-x-2 cursor-pointer text-sm text-red-700 hover:text-red-800">
                <Bug size={14} />
                <span>Información de Debug</span>
              </summary>
              <div className="mt-3 p-4 bg-red-100 rounded border text-xs font-mono overflow-auto max-h-40">
                <div className="mb-2">
                  <strong>Error:</strong> {this.state.error.message}
                </div>
                <div className="mb-2">
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap text-xs">{this.state.error.stack}</pre>
                </div>
                {this.state.errorInfo && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs">{this.state.errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Contador de reintentos */}
          {this.state.retryCount > 0 && (
            <p className="text-xs text-red-500 mt-4">
              Reintentos: {this.state.retryCount}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ServicesCanvasErrorBoundary;