"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  onItemClick?: (item: NavItem) => void;
  position?: 'fixed' | 'static';
}

export function NavBar({ items, className, onItemClick, position = 'fixed' }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name ?? '');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={cn(
        position === 'fixed'
          ? 'fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6'
          : 'relative w-full flex justify-center',
        className,
      )}
    >
      <div className="flex items-center gap-3 bg-background/60 border-2 border-primary/20 backdrop-blur-lg py-1 px-1 rounded-full shadow-md">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => {
                setActiveTab(item.name);
                onItemClick?.(item);
              }}
              className={cn(
                'relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors',
                'text-foreground/80 hover:text-primary',
                isActive && 'bg-primary/15 text-primary ring-1 ring-primary/30',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/25 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/25 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/25 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}


