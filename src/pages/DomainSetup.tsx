
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { CTAButton } from '@/components/ui/cta-button';
import { Globe, Sparkles } from 'lucide-react';

const DomainSetup = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'domain' | 'success'>('domain');
  const { profile } = useAuth();
  const navigate = useNavigate();

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
    return domainRegex.test(domain.replace(/^https?:\/\//, '').replace(/\/$/, ''));
  };

  const handleDomainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    if (!validateDomain(cleanDomain)) {
      toast.error('Please enter a valid domain (e.g., example.com)');
      return;
    }

    setLoading(true);
    // Sinaliza ao SmartRedirect que o setup está em progresso
    try {
      localStorage.setItem('domainSetupInProgress', 'true');
    } catch {}

    try {
      // Ensure user has an organization. If not, create one and assign it.
      let organizationId = profile?.organization_id as string | null;
      if (!organizationId) {
        console.log('No organization detected. Creating a new organization for user...');
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        const res = await fetch('/functions/v1/create-organization', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ domain: cleanDomain })
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error('create-organization failed:', res.status, txt);
          toast.error('Failed to create organization. Please try again.');
          return;
        }
        const json = await res.json();
        organizationId = json.organization_id as string;
        console.log('Organization created via edge function:', { organizationId });
      } else {
        // Update existing organization with the domain
        const { error: updateError } = await supabase
          .from('organizations')
          .update({ 
            website_url: `https://${cleanDomain}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', organizationId);

        if (updateError) {
          console.error('Error updating organization:', updateError);
          toast.error('Failed to save domain. Please try again.');
          return;
        }
      }

      console.log('Domain saved successfully, triggering analysis...');

      // Trigger the analysis webhook
      const { error: webhookError, data: webhookData } = await supabase.functions.invoke('trigger-analysis', {
        body: { domain: cleanDomain }
      });
      console.log('trigger-analysis response:', { webhookError, webhookData });

      if (webhookError) {
        console.error('Error triggering analysis:', webhookError);
        toast.error('Domain saved but analysis failed to start. Please contact support.');
        return;
      }

      console.log('Analysis webhook triggered successfully');
      setStep('success');
      toast.success('Domain saved and analysis started!');

      // Redirect to home (route consolidated without slug)
      setTimeout(() => {
        console.log('Redirecting to: /home');
        navigate('/home', { replace: true });
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
      try {
        localStorage.removeItem('domainSetupInProgress');
      } catch {}
    }
  };

  return (
    <AuroraBackground className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 min-h-screen">
      {/* Enhanced background decoration consistent with hero */}
      <div className="absolute inset-0 bg-grid-slate-100/40 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" aria-hidden="true"></div>
      <div className="absolute top-16 sm:top-20 left-4 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-400/15 sm:bg-blue-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" aria-hidden="true"></div>
      <div className="absolute bottom-16 sm:bottom-20 right-4 sm:right-10 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-indigo-400/15 sm:bg-indigo-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '1s' }} aria-hidden="true"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-purple-300/8 sm:bg-purple-300/10 rounded-full blur-2xl sm:blur-3xl" aria-hidden="true"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0.0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="max-w-2xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {step === 'domain' ? (
              <motion.div 
                key="domain-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8 sm:space-y-12"
              >
                {/* Enhanced badge with Sparkles icon - consistent with hero */}
                <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-white/90 backdrop-blur-xl border border-white/60 rounded-full text-xs sm:text-sm font-medium text-slate-700 mb-6 sm:mb-8 shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" aria-hidden="true" />
                  <span>First-time setup</span>
                </div>
                
                {/* Brand icon with gradient background */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25 mb-6 sm:mb-8">
                  <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                
                {/* Typography hierarchy consistent with hero */}
                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] sm:leading-[0.95] tracking-tight">
                    <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                      Welcome to PromptMetrics!
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-light">
                    Let's start by connecting your website domain to begin analyzing your brand's performance
                  </p>
                </div>
                
                {/* Form with enhanced styling */}
                <form onSubmit={handleDomainSubmit} className="space-y-6 sm:space-y-8 max-w-lg mx-auto">
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="example.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="h-14 sm:h-16 text-center text-lg sm:text-xl bg-white/80 backdrop-blur-sm border-2 border-slate-200/50 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/5 focus:border-blue-500/50 focus:shadow-blue-500/20 transition-all duration-300"
                      disabled={loading}
                      required
                    />
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                      Enter your website domain (without http:// or https://)
                    </p>
                  </div>
                  
                  <CTAButton
                    type="submit"
                    disabled={!domain.trim() || loading}
                    size="lg"
                    className="w-full sm:w-auto px-12 py-5 text-lg"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                        Saving Domain...
                      </>
                    ) : (
                      'Continue Setup'
                    )}
                  </CTAButton>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8 sm:space-y-12"
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6 sm:space-y-8"
                >
                  {/* Success icon with enhanced styling */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/25 mb-6 sm:mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  {/* Success message with consistent typography */}
                  <div className="space-y-4 sm:space-y-6">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                      <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Perfect!
                      </span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed font-light">
                      Your domain has been saved successfully. You're all set to start analyzing your content!
                    </p>
                  </div>
                </motion.div>
                
                {/* Loading indicator */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-center gap-3 text-slate-500"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-sm sm:text-base ml-2">Redirecting to your dashboard...</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AuroraBackground>
  );
};

export default DomainSetup;
