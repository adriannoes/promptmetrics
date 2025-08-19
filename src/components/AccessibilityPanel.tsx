import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { 
  Accessibility, 
  Eye, 
  Volume2, 
  Keyboard, 
  MousePointer,
  Type,
  Contrast,
  X
} from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { cn } from '@/lib/utils';

export const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    highContrast,
    largeText,
    reducedMotion,
    screenReaderMode,
    keyboardNavigation,
    focusVisible,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleScreenReaderMode,
    toggleKeyboardNavigation,
    toggleFocusVisible
  } = useAccessibility();

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-20 z-50 bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg"
        size="sm"
        aria-label="Open accessibility panel"
      >
        <Accessibility className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed top-4 right-4 w-80 z-50 bg-background/95 backdrop-blur-lg border shadow-xl",
      "animate-fade-in"
    )}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Accessibility className="w-5 h-5" />
            Accessibility
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            aria-label="Close accessibility panel"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Visual Accessibility */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Visual
            </h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="flex items-center gap-2">
                <Contrast className="w-4 h-4" />
                High Contrast
              </Label>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={toggleHighContrast}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="large-text" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Large Text
              </Label>
              <Switch
                id="large-text"
                checked={largeText}
                onCheckedChange={toggleLargeText}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion" className="flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                Reduce Motion
              </Label>
              <Switch
                id="reduced-motion"
                checked={reducedMotion}
                onCheckedChange={toggleReducedMotion}
              />
            </div>
          </div>

          <Separator />

          {/* Interaction Accessibility */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Interaction
            </h4>

            <div className="flex items-center justify-between">
              <Label htmlFor="screen-reader" className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Screen Reader Mode
              </Label>
              <Switch
                id="screen-reader"
                checked={screenReaderMode}
                onCheckedChange={toggleScreenReaderMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="keyboard-nav" className="flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                Keyboard Navigation
              </Label>
              <Switch
                id="keyboard-nav"
                checked={keyboardNavigation}
                onCheckedChange={toggleKeyboardNavigation}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="focus-visible" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Enhanced Focus
              </Label>
              <Switch
                id="focus-visible"
                checked={focusVisible}
                onCheckedChange={toggleFocusVisible}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            These settings are saved locally and will persist across sessions.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AccessibilityPanel;