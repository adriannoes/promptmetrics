
"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { useState, useRef } from "react";
import NumberFlow from "@number-flow/react";

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function PricingAdvanced({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.",
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);
  const { language } = useLanguage();

  const getCurrency = () => {
    return language === 'pt-BR' ? 'BRL' : 'USD';
  };

  const isNumericPrice = (price: string) => {
    return !isNaN(Number(price)) && price !== '';
  };

  const handleToggle = async (checked: boolean) => {
    setIsMonthly(!checked);
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
      } catch (error) {
        console.log('Confetti not available');
      }
    }
  };

  const scrollToForm = () => {
    const element = document.getElementById('form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container py-12 sm:py-16 md:py-20">
      <div className="text-center space-y-4 mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="flex justify-center items-center gap-4 mb-12 sm:mb-14 md:mb-16">
        <span className="font-semibold text-slate-700 text-sm sm:text-base">Monthly</span>
        <Label>
          <Switch
            ref={switchRef as any}
            checked={!isMonthly}
            onCheckedChange={handleToggle}
            className="relative"
          />
        </Label>
        <span className="font-semibold text-slate-700 text-sm sm:text-base">
          Annual <span className="text-blue-600">(Save 45%)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const currentPrice = isMonthly ? plan.price : plan.yearlyPrice;
          const isNumeric = isNumericPrice(currentPrice);
          
          return (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={
                isDesktop
                  ? {
                      y: plan.isPopular ? -10 : 0,
                      opacity: 1,
                      x: index === 2 ? -15 : index === 0 ? 15 : 0,
                      scale: index === 0 || index === 2 ? 0.97 : 1.0,
                    }
                  : { y: 0, opacity: 1 }
              }
              viewport={{ once: true }}
              transition={{
                duration: 1.6,
                type: "spring",
                stiffness: 100,
                damping: 30,
                delay: 0.4,
                opacity: { duration: 0.5 },
              }}
              className={cn(
                `relative bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border transition-all duration-500 hover:shadow-2xl group`,
                plan.isPopular 
                  ? 'border-blue-200/60 shadow-2xl shadow-blue-500/10 scale-105' 
                  : 'border-white/50 shadow-xl hover:border-slate-200/60 hover:shadow-slate-300/20',
                "flex flex-col",
                !plan.isPopular && "mt-0 md:mt-5",
                index === 0 || index === 2
                  ? "z-0 transform translate-x-0 translate-y-0"
                  : "z-10",
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 sm:-top-5 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-sm">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8 sm:mb-10">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-3 sm:mb-4">
                  {isNumeric ? (
                    <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
                      <NumberFlow
                        value={Number(currentPrice)}
                        format={{
                          style: "currency",
                          currency: getCurrency(),
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }}
                        transformTiming={{
                          duration: 500,
                          easing: "ease-out",
                        }}
                        willChange
                      />
                    </span>
                  ) : (
                    <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
                      {currentPrice}
                    </span>
                  )}
                  {plan.period !== "Next 3 months" && plan.period !== "Próximos 3 meses" && plan.period && (
                    <span className="text-slate-600 ml-2 font-medium text-sm sm:text-base md:text-lg">
                      / {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 font-light text-sm sm:text-base md:text-lg">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 sm:space-y-5 mb-8 sm:mb-10 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3 sm:gap-4">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100/80 backdrop-blur-sm rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 shadow-sm">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600" />
                    </div>
                    <span className="text-slate-700 leading-relaxed text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={scrollToForm}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "w-full py-4 sm:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 group-hover:scale-[1.01] shadow-lg hover:shadow-xl text-sm sm:text-base min-h-[44px]",
                  plan.isPopular 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20 hover:shadow-blue-500/30'
                    : 'bg-white/80 backdrop-blur-sm text-slate-900 hover:bg-white border border-slate-200/60 hover:border-slate-300'
                )}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
