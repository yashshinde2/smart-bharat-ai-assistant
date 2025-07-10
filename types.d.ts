// types.d.ts

export {}

declare global {
  interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
  }

  interface SpeechRecognitionResult {
    isFinal: boolean
    length: number
    [index: number]: SpeechRecognitionAlternative
  }

  interface SpeechRecognitionResultList {
    length: number
    [index: number]: SpeechRecognitionResult
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number
    readonly results: SpeechRecognitionResultList
  }

  interface SpeechRecognition extends EventTarget {
    lang: string
    continuous: boolean
    interimResults: boolean
    maxAlternatives: number

    onaudiostart: ((ev: Event) => any) | null
    onaudioend: ((ev: Event) => any) | null
    onend: ((ev: Event) => any) | null
    onerror: ((ev: SpeechRecognitionErrorEvent) => any) | null
    onnomatch: ((ev: SpeechRecognitionEvent) => any) | null
    onresult: ((ev: SpeechRecognitionEvent) => any) | null
    onsoundstart: ((ev: Event) => any) | null
    onsoundend: ((ev: Event) => any) | null
    onspeechstart: ((ev: Event) => any) | null
    onspeechend: ((ev: Event) => any) | null
    onstart: ((ev: Event) => any) | null

    start(): void
    stop(): void
    abort(): void
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string
    message: string
  }

  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}
