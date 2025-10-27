// Google Analytics gtag types
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params: Record<string, unknown>
    ) => void;
  }
}

export {};
