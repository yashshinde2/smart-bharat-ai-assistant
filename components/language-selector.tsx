"use client"

import { useEffect, useState, useRef } from "react"

// Define languages
const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी (Hindi)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "te", name: "తెలుగు (Telugu)" },
]

export function LanguageSelector() {
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationError, setTranslationError] = useState<string | null>(null)
  const [isGoogleTranslateLoaded, setIsGoogleTranslateLoaded] = useState(false)
  const scriptLoadAttempts = useRef(0)
  const maxScriptLoadAttempts = 3
  const translateElementRef = useRef<HTMLDivElement>(null)

  // Function to load Google Translate script
  const loadGoogleTranslateScript = () => {
    if (document.getElementById("google-translate-script")) {
      console.log("Google Translate script already exists");
      return;
    }

    console.log(`Attempting to load Google Translate script (attempt ${scriptLoadAttempts.current + 1}/${maxScriptLoadAttempts})`);
    
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    
    script.onload = () => {
      console.log("Google Translate script loaded successfully");
    };
    
    script.onerror = () => {
      console.error("Failed to load Google Translate script");
      scriptLoadAttempts.current += 1;
      
      if (scriptLoadAttempts.current < maxScriptLoadAttempts) {
        console.log("Retrying script load...");
        setTimeout(loadGoogleTranslateScript, 1000);
      } else {
        setTranslationError("Failed to load translation service. Please refresh the page.");
      }
    };
    
    document.body.appendChild(script);
  };

  // Initialize Google Translate
  useEffect(() => {
    // Define the init function globally
    (window as any).googleTranslateElementInit = () => {
      try {
        console.log("Initializing Google Translate element");
        
        // Check if Google Translate API is available
        if (!(window as any).google || !(window as any).google.translate) {
          console.error("Google Translate API not available");
          setTranslationError("Translation service not available. Please refresh the page.");
          return;
        }
        
        // Create the translate element with the built-in bar
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: languages.map((l) => l.code).join(','),
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            gaTrack: false,
            multilanguagePage: true
          },
          "google_translate_element"
        );
        
        // Set a flag to indicate Google Translate is loaded
        setIsGoogleTranslateLoaded(true);
        console.log("Google Translate initialized successfully");
      } catch (error) {
        console.error("Error initializing Google Translate:", error);
        setTranslationError("Failed to initialize translation service.");
      }
    };

    // Load the script
    loadGoogleTranslateScript();
    
    // Cleanup function
    return () => {
      const script = document.getElementById("google-translate-script");
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Google Translate element */}
      <div 
        id="google_translate_element" 
        ref={translateElementRef} 
        className="mb-4"
      ></div>
      
      {translationError && (
        <div className="absolute top-10 right-0 bg-red-100 text-red-800 p-2 rounded text-xs max-w-xs z-50">
          {translationError}
        </div>
      )}
    </div>
  )
}
