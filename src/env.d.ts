/// <reference types="astro/client" />

declare global {
  interface Window {
    va: (...args: any[]) => void;
    vaq: any[];
    gtag: (...args: any[]) => void;
  }
}

export {};