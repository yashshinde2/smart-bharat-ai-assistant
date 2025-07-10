declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof webkitSpeechRecognition;
  }

  interface SpeechRecognition {
    results: SpeechRecognitionResultList;
    interimResults: boolean;
  }
}

export {};
