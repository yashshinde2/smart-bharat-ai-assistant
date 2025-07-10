"use client";

import { useState, useRef, useEffect } from "react";
import { useSettings } from "@/lib/store/settings";
import { Mic, MicOff, Volume2, VolumeX, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { geminiAPI } from "@/app/utils/gemini";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "नमस्ते ! में आपकी कैसे मदत कर सकती हूँ? (Hello! How can I help you today?)",
      isUser: false,
    },
  ]);
  const { voiceOutput, setVoiceOutput, language } = useSettings();
  // Removed showVoicePrompt and related popup logic

  // Utility: Speak text in selected language, always use the first available female voice if possible
  // Utility: Speak text in selected language, always use the first available female voice if possible
  const speakText = (text: string) => {
    if (!voiceOutput || !text) return;
    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const speakWithVoice = () => {
          speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          const langMap: Record<string, string> = {
            hi: "hi-IN",
            en: "en-US",
            bn: "bn-IN",
            mr: "mr-IN",
            ta: "ta-IN",
            te: "te-IN",
          };
          utterance.lang = langMap[language] || "en-US";
          const voices = window.speechSynthesis.getVoices();
          // Prefer a female voice for the selected language
          let selectedVoice = voices.find(v => v.lang === utterance.lang && v.name.toLowerCase().includes("female"));
          if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang === utterance.lang);
          }
          if (!selectedVoice) {
            selectedVoice = voices.find(v => v.name.toLowerCase().includes("female"));
          }
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
          utterance.onerror = () => {
            utterance.lang = "en-US";
            speechSynthesis.speak(utterance);
          };
          speechSynthesis.speak(utterance);
        };
        if (window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.onvoiceschanged = speakWithVoice;
        } else {
          speakWithVoice();
        }
      }
    } catch (e) {
      // ignore
    }
  };


  // Track if intro has been spoken
  const introSpokenRef = useRef(false);

  // Always speak the intro message on mount and when toggling voice output or intro/language changes
  useEffect(() => {
    if (voiceOutput && messages[0]?.text) {
      speakText(messages[0].text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceOutput, messages[0]?.text, language]);

  // Remove auto-speak on first user interaction, now handled by explicit button

  // Also speak AI responses (not user messages)
  useEffect(() => {
    if (voiceOutput && messages.length > 1) {
      const last = messages[messages.length - 1];
      if (!last.isUser) {
        speakText(last.text);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);
  const [showHttpsWarning, setShowHttpsWarning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  const apiUrl = process.env.NEXT_PUBLIC_GEMINI_API_URL;

  const isSecureContext =
    typeof window !== "undefined" &&
    (window.location.protocol === "https:" ||
      window.location.hostname === "localhost");

  const requestMicrophonePermission = async () => {
    if (typeof window === "undefined") return;

    if (!isSecureContext) {
      setShowHttpsWarning(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          text: "माइक्रोफ़ोन एक्सेस के लिए HTTPS की आवश्यकता है। (HTTPS is required for microphone access.)",
          isUser: false,
        },
      ]);
      return;
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("MediaDevices API not supported");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      console.log("Microphone access granted.");
    } catch (err: any) {
      console.error("Microphone access error:", err);
      let errorMessage =
        "माइक्रोफ़ोन एक्सेस की अनुमति नहीं मिली। कृपया अपने ब्राउज़र सेटिंग्स में जाकर माइक्रोफ़ोन की अनुमति दें।";

      if (err.message === "MediaDevices API not supported") {
        errorMessage =
          "आपका ब्राउज़र माइक्रोफ़ोन का समर्थन नहीं करता है। कृपया Chrome का उपयोग करें।";
      } else if (err.name === "NotAllowedError") {
        errorMessage =
          "माइक्रोफ़ोन एक्सेस की अनुमति नहीं मिली। कृपया अपने ब्राउज़र सेटिंग्स में जाकर माइक्रोफ़ोन की अनुमति दें।";
      } else if (err.name === "NotFoundError") {
        errorMessage = "कोई माइक्रोफ़ोन नहीं मिला। कृपया एक माइक्रोफ़ोन कनेक्ट करें।";
      }

      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, text: errorMessage, isUser: false },
      ]);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!isSecureContext) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          text: "वॉइस रिकग्निशन के लिए HTTPS की आवश्यकता है। (HTTPS is required for voice recognition.)",
          isUser: false,
        },
      ]);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const isChrome =
        /Chrome/.test(navigator.userAgent) &&
        /Google Inc/.test(navigator.vendor);
      const errorMessage = isChrome
        ? "Chrome ब्राउज़र में वॉइस रिकग्निशन उपलब्ध नहीं है। कृपया Chrome को अपडेट करें।"
        : "आपका ब्राउज़र वॉइस रिकग्निशन का समर्थन नहीं करता है। कृपया Google Chrome का उपयोग करें।";

      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, text: errorMessage, isUser: false },
      ]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      let errorMessage = "कृपया पुनः प्रयास करें।";

      if (event.error === "not-allowed") {
        errorMessage =
          "माइक्रोफ़ोन एक्सेस की अनुमति नहीं मिली। कृपया अपने ब्राउज़र सेटिंग्स में जाकर माइक्रोफ़ोन की अनुमति दें।";
        requestMicrophonePermission();
      } else if (event.error === "network") {
        errorMessage =
          "स्पीच सर्वर से कनेक्ट नहीं हो सका। कृपया अपना इंटरनेट कनेक्शन जांचें और फिर से प्रयास करें। (Could not connect to the speech server. Please check your internet connection and try again.)";
      }

      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, text: errorMessage, isUser: false },
      ]);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    requestMicrophonePermission();

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // (Removed duplicate effect that directly used speechSynthesis. All speaking is now handled by speakText and the two effects above.)

  // Improved: Timeout and instant feedback for Gemini API
  const callGenerativeAI = async (text: string) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout
    try {
      const result = await geminiAPI.generateContent(text, controller.signal);
      clearTimeout(timeout);
      // If the error is due to abort, return a friendly message
      if (result.error && result.error.toLowerCase().includes('abort')) {
        return "Sorry, the assistant took too long to respond. Please try again.";
      }
      if (result.error) {
        if (result.error.toLowerCase().includes("overloaded")) {
          // Show a user-friendly message if Gemini is overloaded
          return "Gemini AI is currently overloaded. Please try again in a few moments.";
        }
        console.error("Gemini API error:", result.error);
        throw new Error(result.error);
      }
      if (!result.response) {
        throw new Error("No response generated");
      }
      return result.response;
    } catch (error) {
      clearTimeout(timeout);
      if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'AbortError') {
        // Don't log or throw for intentional aborts (timeout)
        return "Sorry, the assistant took too long to respond. Please try again.";
      }
      // Only log unexpected errors
      if (!(typeof error === 'object' && error !== null && 'message' in error && (error as any).message === 'signal is aborted without reason')) {
        console.error("Error calling Gemini API:", error);
      }
      throw error;
    }
  };

  const handleSpeechResult = async (event: SpeechRecognitionEvent) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    console.log("Transcript:", transcript);

    if (event.results[event.results.length - 1].isFinal) {
      const userMsgId = `${Date.now()}-${Math.random()}`;
      setMessages((prev) => [
        ...prev,
        { id: userMsgId, text: transcript, isUser: true },
      ]);

      const loadingId = `loading-${Date.now()}-${Math.random()}`;
      setMessages((prev) => [
        ...prev,
        { id: loadingId, text: "सोच रही हूँ...", isUser: false },
      ]);

      // Give instant feedback to the user
      setTimeout(() => {
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === loadingId)) {
            return prev.map((msg) =>
              msg.id === loadingId
                ? { ...msg, text: "थोड़ा इंतजार करें, जवाब आ रहा है..." }
                : msg
            );
          }
          return prev;
        });
      }, 4000);

      try {
        const aiReply = await callGenerativeAI(transcript);

        const aiMsgId = `${Date.now()}-${Math.random()}`;
        setMessages((prev) =>
          prev
            .filter((msg) => msg.id !== loadingId)
            .concat({ id: aiMsgId, text: aiReply, isUser: false })
        );
      } catch (err) {
        console.error("AI API Error:", err);
        setMessages((prev) =>
          prev
            .filter((msg) => msg.id !== loadingId)
            .concat({
              id: `${Date.now()}-${Math.random()}`,
              text: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
              isUser: false,
            })
        );
      } finally {
        setIsListening(false);
      }
    }
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Speech recognition उपलब्ध नहीं है। कृपया Google Chrome का उपयोग करें।");
      return;
    }

    if (!isListening) {
      setIsListening(true);
      try {
        recognition.start();
        recognition.onresult = handleSpeechResult;
      } catch (error) {
        console.error("Speech start error:", error);
        alert("Speech recognition शुरू करने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
        setIsListening(false);
      }
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  const toggleVoiceOutput = () => setVoiceOutput(!voiceOutput);

  return (
    <div className="flex flex-col h-full relative">
      {showHttpsWarning && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>HTTPS Required</AlertTitle>
          <AlertDescription>
            Voice recognition requires a secure connection (HTTPS). Please run
            the application with HTTPS enabled.
            <div className="mt-2 text-sm">
              <a href="/HTTPS_SETUP.md" className="underline">
                View setup instructions
              </a>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 max-w-[80%] rounded-2xl ${
                message.isUser
                  ? "bg-brand-orange text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm sm:text-base">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isListening && (
        <div className="flex justify-center mb-6">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-8 bg-brand-orange rounded-full wave"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center space-y-4">
        <Button
          onClick={toggleVoiceOutput}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          {voiceOutput ? (
            <Volume2 className="h-4 w-4 text-brand-green" />
          ) : (
            <VolumeX className="h-4 w-4 text-gray-400" />
          )}
          <span className="ml-2 text-sm">
            {voiceOutput ? "Voice Output On" : "Voice Output Off"}
          </span>
        </Button>

        <Button
          onClick={toggleListening}
          className={`rounded-full w-20 h-20 ${
            isListening
              ? "bg-red-500 hover:bg-red-600"
              : "bg-brand-orange hover:bg-brand-orange/90"
          } flex items-center justify-center`}
          disabled={false}
        >
          {isListening ? (
            <MicOff className="h-10 w-10" />
          ) : (
            <Mic className="h-10 w-10" />
          )}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          {isListening ? "Tap to Stop" : "Tap to Speak"}
        </p>
      </div>
    </div>
  );
}