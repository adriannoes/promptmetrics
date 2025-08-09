// configurações globais de testes
import '@testing-library/jest-dom';

// Polyfills for JSDOM environment used by components with framer-motion
// IntersectionObserver
if (!(global as any).IntersectionObserver) {
  (global as any).IntersectionObserver = class {
    constructor(_cb: any, _options?: any) {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  } as any;
}

// ResizeObserver (defensive)
if (!(global as any).ResizeObserver) {
  (global as any).ResizeObserver = class {
    constructor(_cb: any) {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}


