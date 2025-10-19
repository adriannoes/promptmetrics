
import { useRef } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";

interface PricingToggleProps {
  isMonthly: boolean;
  onToggle: (checked: boolean) => void;
}

export function PricingToggle({ isMonthly, onToggle }: PricingToggleProps) {
  const switchRef = useRef<HTMLButtonElement>(null);
  const { t } = useLanguage();

  const handleToggle = async (checked: boolean) => {
    onToggle(checked);
    if (checked && switchRef.current && typeof window !== 'undefined') {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 50,
          spread: 60,
          origin: {
            x: x / window.innerWidth,
            y: y / window.innerHeight,
          },
          colors: [
            "#3b82f6",
            "#6366f1", 
            "#8b5cf6",
            "#06b6d4",
          ],
          ticks: 200,
          gravity: 1.2,
          decay: 0.94,
          startVelocity: 30,
          shapes: ["circle"],
        });
      } catch (_error) {
        // Confetti not available, ignore error
      }
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 mb-10 sm:mb-12 md:mb-14">
      <span className="font-semibold text-slate-700 text-sm sm:text-base">{t('pricing.monthly')}</span>
      <Label>
        <Switch
          ref={switchRef as any}
          checked={!isMonthly}
          onCheckedChange={handleToggle}
          className="relative"
        />
      </Label>
      <span className="font-semibold text-slate-700 text-sm sm:text-base">
        {t('pricing.annual')} <span className="text-blue-600">({t('pricing.save')})</span>
      </span>
    </div>
  );
}
