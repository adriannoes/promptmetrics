
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, LogOut } from 'lucide-react';

const Home = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-lg shadow-slate-200/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">RankMeLLM</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">Welcome, {profile?.full_name}</span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome to your Dashboard
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Start evaluating and comparing LLMs with precision
          </p>
          
          <div className="bg-white rounded-2xl shadow-xl border border-white/60 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Getting Started
            </h2>
            <p className="text-slate-600 mb-6">
              Your evaluation platform is ready. Here you'll be able to run benchmarks, 
              compare models, and get actionable insights for your LLM strategy.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Run Benchmarks</h3>
                <p className="text-blue-700 text-sm">Test multiple models simultaneously</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="font-semibold text-indigo-900 mb-2">Compare Results</h3>
                <p className="text-indigo-700 text-sm">Analyze performance metrics</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Get Insights</h3>
                <p className="text-purple-700 text-sm">Optimize your LLM strategy</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
