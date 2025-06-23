
"use client";

import { useState } from "react";
import { PricingHeader } from "./pricing-header";
import { PricingToggle } from "./pricing-toggle";
import { PricingCard } from "./pricing-card";

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

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
  };

  const scrollToForm = () => {
    const element = document.getElementById('form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container py-8 sm:py-12 md:py-16">
      <PricingHeader title={title} description={description} />
      
      <PricingToggle isMonthly={isMonthly} onToggle={handleToggle} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <PricingCard
            key={index}
            plan={plan}
            index={index}
            isMonthly={isMonthly}
            onButtonClick={scrollToForm}
          />
        ))}
      </div>
    </div>
  );
}
