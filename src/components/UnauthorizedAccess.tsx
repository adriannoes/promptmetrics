

import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';

interface UnauthorizedAccessProps {
  message?: string;
}

const UnauthorizedAccess = ({ message = "Unauthorized access" }: UnauthorizedAccessProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
        <p className="text-slate-600 mb-8">{message}</p>
        
        <div className="space-y-3">
          <Button onClick={() => navigate('/home')} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="w-full"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
