import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityState {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
}

interface AccessibilityContextType extends AccessibilityState {
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReducedMotion: () => void;
  toggleScreenReaderMode: () => void;
  toggleKeyboardNavigation: () => void;
  toggleFocusVisible: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = 'accessibility-settings';

const defaultState: AccessibilityState = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReaderMode: false,
  keyboardNavigation: true,
  focusVisible: true,
};

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AccessibilityState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Handle localStorage errors silently
    }
  }, [state]);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;

    // High contrast
    root.classList.toggle('high-contrast', state.highContrast);
    
    // Large text
    root.classList.toggle('large-text', state.largeText);
    
    // Reduced motion
    root.classList.toggle('reduced-motion', state.reducedMotion);
    
    // Screen reader mode
    root.classList.toggle('screen-reader', state.screenReaderMode);
    
    // Keyboard navigation
    root.classList.toggle('keyboard-nav', state.keyboardNavigation);
    
    // Focus visible
    root.classList.toggle('focus-visible', state.focusVisible);

    // Update CSS custom properties
    root.style.setProperty('--motion-scale', state.reducedMotion ? '0' : '1');
    root.style.setProperty('--text-scale', state.largeText ? '1.25' : '1');

    // Add ARIA live region for announcements
    if (state.screenReaderMode) {
      let liveRegion = document.getElementById('aria-live-region');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
      }
    }
  }, [state]);

  const toggleSetting = (key: keyof AccessibilityState) => {
    setState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const value: AccessibilityContextType = {
    ...state,
    toggleHighContrast: () => toggleSetting('highContrast'),
    toggleLargeText: () => toggleSetting('largeText'),
    toggleReducedMotion: () => toggleSetting('reducedMotion'),
    toggleScreenReaderMode: () => toggleSetting('screenReaderMode'),
    toggleKeyboardNavigation: () => toggleSetting('keyboardNavigation'),
    toggleFocusVisible: () => toggleSetting('focusVisible'),
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// Utility hook for announcing content to screen readers
export const useScreenReaderAnnouncer = () => {
  const { screenReaderMode } = useAccessibility();

  const announce = (message: string) => {
    if (!screenReaderMode) return;

    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  };

  return { announce };
};