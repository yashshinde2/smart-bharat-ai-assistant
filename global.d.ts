// types/global.d.ts
export {};

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: any;
            autoDisplay: boolean;
            gaTrack?: boolean;
            gaId?: string;
          },
          element: string
        ) => void;
        InlineLayout: {
          SIMPLE: any;
        };
      };
    };
    googleTranslateElementInit?: () => void;

    // DeepSeek API typings
    deepseek?: {
      chat: (options: { prompt: string }) => Promise<string>;
      // Add more DeepSeek methods/properties as needed
    };
  }

  // Define google globally once
  var google: typeof window.google;
  // Define deepseek globally once
  var deepseek: typeof window.deepseek;
}
