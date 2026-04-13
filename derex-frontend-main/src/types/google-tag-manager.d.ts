interface GAEvent {
  event: string;
  [key: string]: any;
}

export {};
declare global {
  interface Window {
    dataLayer: GAEvent[];
  }
}
