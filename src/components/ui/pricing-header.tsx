


interface PricingHeaderProps {
  title: string;
  description: string;
}

export function PricingHeader({ title, description }: PricingHeaderProps) {
  return (
    <div className="text-center space-y-2 mb-6 sm:mb-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="text-slate-600 text-sm sm:text-base md:text-lg whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}
