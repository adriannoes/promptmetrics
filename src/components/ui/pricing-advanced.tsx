
"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { useState, useRef } from "react";
import NumberFlow from "@number-flow/react";

// Import canvas-confetti dinamicamente para evitar problemas de build
const confetti = typeof window !== 'undefined' ? require('canvas-confetti') : null;

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

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current && confetti) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

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
    }
  };

  const scrollToForm = () => {
    const element = document.getElementById('form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container py-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-slate-900">
          {title}
        </h2>
        <p className="text-slate-600 text-lg whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="flex justify-center items-center gap-4 mb-10">
        <span className="font-semibold text-slate-700">Monthly</span>
        <Label>
          <Switch
            ref={switchRef as any}
            checked={!isMonthly}
            onCheckedChange={handleToggle}
            className="relative"
          />
        </Label>
        <span className="font-semibold text-slate-700">
          Annual <span className="text-blue-600">(Save 45%)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -30 : index === 0 ? 30 : 0,
                    scale: index === 0 || index === 2 ? 0.94 : 1.0,
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
              `relative bg-white/70 backdrop-blur-xl rounded-3xl p-10 border transition-all duration-500 hover:shadow-2xl group`,
              plan.isPopular 
                ? 'border-blue-200/60 shadow-2xl shadow-blue-500/10 scale-105' 
                : 'border-white/50 shadow-xl hover:border-slate-200/60 hover:shadow-slate-300/20',
              "flex flex-col",
              !plan.isPopular && "mt-5",
              index === 0 || index === 2
                ? "z-0 transform translate-x-0 translate-y-0"
                : "z-10",
            )}
          >
            {plan.isPopular && (
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-xl backdrop-blur-sm">
                  <Star className="w-4 h-4" />
                  Popular
                </div>
              </div>
            )}
            
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{plan.name}</h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-6xl font-bold text-slate-900 tracking-tight">
                  <NumberFlow
                    value={
                      isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                    }
                    format={{
                      style: "currency",
                      currency: "USD",
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
                {plan.period !== "Next 3 months" && (
                  <span className="text-slate-600 ml-2 font-medium text-lg">
                    / {plan.period}
                  </span>
                )}
              </div>
              <p className="text-slate-600 font-light text-lg">{plan.description}</p>
            </div>
            
            <ul className="space-y-5 mb-10 flex-1">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-100/80 backdrop-blur-sm rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 shadow-sm">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-slate-700 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={scrollToForm}
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "w-full py-5 px-6 rounded-2xl font-semibold transition-all duration-300 group-hover:scale-[1.02] shadow-lg hover:shadow-xl",
                plan.isPopular 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20 hover:shadow-blue-500/30'
                  : 'bg-white/80 backdrop-blur-sm text-slate-900 hover:bg-white border border-slate-200/60 hover:border-slate-300'
              )}
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
