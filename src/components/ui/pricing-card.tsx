
import React from 'react';
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
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

interface PricingCardProps {
  plan: PricingPlan;
  index: number;
  isMonthly: boolean;
  onButtonClick: () => void;
}

export function PricingCard({ plan, index, isMonthly, onButtonClick }: PricingCardProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { language } = useLanguage();

  const getCurrency = () => {
    return language === 'pt-BR' ? 'BRL' : 'USD';
  };

  const isNumericPrice = (price: string) => {
    return !isNaN(Number(price)) && price !== '';
  };

  const currentPrice = isMonthly ? plan.price : plan.yearlyPrice;
  const isNumeric = isNumericPrice(currentPrice);

  return (
    <motion.div
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
        onClick={onButtonClick}
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
}
