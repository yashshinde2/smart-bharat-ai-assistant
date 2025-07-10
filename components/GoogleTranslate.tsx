import { useRef, useEffect } from 'react';

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
  }

  // Define google globally once
  var google: typeof window.google;
}



const GoogleTranslate = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Only add script if not already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY || '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => {
        console.error('Failed to load Google Translate script');
      };
      document.body.appendChild(script);
    }

    // Only initialize if not already present
    window.googleTranslateElementInit = () => {
      if (document.getElementById('google_translate_element')?.children.length) return;
      try {
        // Defensive: wait for google.translate and InlineLayout to be available
        const tryInit = () => {
          if (
            window.google &&
            window.google.translate &&
            window.google.translate.TranslateElement &&
            window.google.translate.TranslateElement.InlineLayout &&
            window.google.translate.TranslateElement.InlineLayout.SIMPLE
          ) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'hi,en,gu,bn,mr,ta,te,kn,ml',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              },
              'google_translate_element'
            );
          } else {
            setTimeout(tryInit, 100);
          }
        };
        tryInit();
      } catch (error) {
        console.error('Failed to initialize Google Translate:', error);
      }
    };

    // If script is already loaded, manually call init
    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
