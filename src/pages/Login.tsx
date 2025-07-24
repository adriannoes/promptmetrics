
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { usePostLoginRedirect } from '@/hooks/usePostLoginRedirect';
import { Zap, Eye } from 'lucide-react';
import { authToast, getCurrentLanguage } from '@/utils/toastMessages';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithDemo } = useAuth();

  // Use the centralized post-login redirect hook
  usePostLoginRedirect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);
    const currentLanguage = getCurrentLanguage();

    if (error) {
      authToast.loginError(currentLanguage, error.message);
    } else {
      authToast.loginSuccess(currentLanguage);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    const currentLanguage = getCurrentLanguage();
    
    if (error) {
      authToast.googleSigninError(currentLanguage);
    }
    
    setLoading(false);
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    const { error } = await signInWithDemo();
    const currentLanguage = getCurrentLanguage();
    
    if (error) {
      authToast.loginError(currentLanguage, error.message);
    } else {
      authToast.demoWelcome(currentLanguage);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-white/60 p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">PromptMetrics</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6">
            <Button
              onClick={handleDemoSignIn}
              variant="outline"
              className="w-full h-12 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-300"
              disabled={loading}
            >
              <Eye className="w-5 h-5 mr-2" />
              Skip Login - Show me the app
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
