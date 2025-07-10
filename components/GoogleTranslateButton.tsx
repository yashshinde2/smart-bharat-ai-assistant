"use client";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी (Hindi)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "mr", label: "मराठी (Marathi)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "gu", label: "ગુજરાતી (Gujarati)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", label: "മലയാളം (Malayalam)" },
];

export default function GoogleTranslateButton() {
  const [show, setShow] = useState(false);

  // Helper to trigger Google Translate
  const handleTranslate = (langCode: string) => {
    // Google Translate widget adds a select element to the DOM
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      alert("Google Translate is still loading. Please try again in a moment.");
    }
    setShow(false);
  };

  return (
    <div className="relative inline-block">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setShow((v) => !v)}
        aria-label="Translate this page"
      >
        <Languages className="h-4 w-4" />
        Translate
      </Button>
      {show && (
        <div className="absolute right-0 mt-2 z-50 bg-white border rounded shadow p-2 min-w-[180px]">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
              onClick={() => handleTranslate(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
      {/* Google Translate widget must be present in the DOM for select to work */}
      <div style={{ display: "none" }}>
        <div id="google_translate_element"></div>
      </div>
    </div>
  );
}
