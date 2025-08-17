import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-md w-full">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-800">Algo deu errado</AlertTitle>
              <AlertDescription className="text-orange-700 mt-2">
                Ocorreu um erro inesperado ao carregar a aplicação. Tente recarregar a página.
              </AlertDescription>
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={this.handleReset}
                  variant="outline"
                  size="sm"
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar novamente
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Recarregar página
                </Button>
              </div>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}