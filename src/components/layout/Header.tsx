

import { HeaderBrand } from './navigation/HeaderBrand';
import { DesktopNav } from './navigation/DesktopNav';
import { MobileNav } from './MobileNav';

const Header = () => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-lg shadow-slate-200/10"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <HeaderBrand />
          <DesktopNav onSectionScroll={scrollTo} />
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export { Header };
