import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Search, 
  Settings, 
  Share2, 
  Download, 
  Zap,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';

interface FloatingAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary';
  hotkey?: string;
}

interface FloatingActionBarProps {
  actions?: FloatingAction[];
  className?: string;
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  actions,
  className = '',
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Default actions based on current route
  const defaultActions: FloatingAction[] = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: Home,
      onClick: () => navigate('/home'),
      hotkey: 'H'
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: BarChart3,
      onClick: () => navigate('/analysis'),
      hotkey: 'A'
    },
    {
      id: 'new-analysis',
      label: 'New Analysis',
      icon: Search,
      onClick: () => navigate('/analysis'),
      variant: 'primary' as const,
      hotkey: 'N'
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      onClick: () => {
        if (navigator.share) {
          navigator.share({
            title: 'AI Domain Analysis',
            url: window.location.href
          });
        } else {
          navigator.clipboard.writeText(window.location.href);
        }
      },
      hotkey: 'S'
    }
  ];

  const finalActions = actions || defaultActions;

  // Auto-hide on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
        setIsExpanded(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        finalActions.forEach(action => {
          if (action.hotkey && e.key.toLowerCase() === action.hotkey.toLowerCase()) {
            e.preventDefault();
            action.onClick();
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [finalActions]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-center':
        return 'bottom-6 left-1/2 -translate-x-1/2';
      default:
        return 'bottom-6 right-6';
    }
  };

  const getVariantClasses = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl';
      case 'secondary':
        return 'bg-white/90 hover:bg-white text-slate-700 border border-slate-200/60';
      default:
        return 'bg-white/80 hover:bg-white/90 text-slate-700 backdrop-blur-lg border border-white/60';
    }
  };

  if (!isVisible) return null;

  return (
    <TooltipProvider>
      <div className={cn(
        'fixed z-50 transition-all duration-300',
        getPositionClasses(),
        className
      )}>
        <div className="relative">
          {/* Expanded Actions */}
          {isExpanded && (
            <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in">
              {finalActions.slice(0, -1).map((action, index) => (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={action.onClick}
                      className={cn(
                        'w-12 h-12 rounded-full shadow-2xl backdrop-blur-lg transition-all duration-300 hover:scale-110',
                        getVariantClasses(action.variant),
                        'animate-scale-in'
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <action.icon className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-black/90 text-white">
                    <div className="flex items-center gap-2">
                      {action.label}
                      {action.hotkey && (
                        <kbd className="px-1.5 py-0.5 text-xs bg-white/20 rounded">
                          ⌘{action.hotkey}
                        </kbd>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}

          {/* Main Toggle Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  'w-14 h-14 rounded-full shadow-2xl backdrop-blur-lg transition-all duration-300 hover:scale-110 group',
                  getVariantClasses('primary')
                )}
              >
                {isExpanded ? (
                  <ChevronDown className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" />
                ) : (
                  <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black/90 text-white">
              {isExpanded ? 'Close Actions' : 'Quick Actions'}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default FloatingActionBar;