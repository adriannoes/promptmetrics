import { Home, Sparkles, BarChart3 } from 'lucide-react';
import { NavBar } from '@/components/ui/tubelight-navbar';

export function NavBarDemo() {
  const navItems = [
    { name: 'Dashboard', url: '/analysis#dashboard', icon: Home },
    { name: 'AI Analysis', url: '/analysis#prompts', icon: Sparkles },
    { name: 'Strategic Insights', url: '/analysis#insights', icon: BarChart3 },
  ];

  return <NavBar items={navItems} />;
}


