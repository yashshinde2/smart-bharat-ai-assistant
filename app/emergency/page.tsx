"use client"

import { useState, useEffect, useCallback } from "react"
import { Phone, MessageSquare, AlertTriangle, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/main-layout"

interface Hospital {
  name: string
  distance: string
  phone: string
}

const hospitals: Hospital[] = [
  {
    name: "District Hospital",
    distance: "2.5 km away",
    phone: "0123456789"
  },
  {
    name: "Primary Health Center",
    distance: "1.2 km away",
    phone: "0123456790"
  },
  {
    name: "Ayushman Hospital",
    distance: "4.8 km away",
    phone: "0123456791"
  }
]

export default function EmergencyPage() {
  // ...existing code...
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

  const handleVoiceCommand = useCallback((command: string) => {
    // Emergency keywords in multiple languages
    if (
      command.includes('ambulance') || command.includes('एम्बुलेंस') ||
      command.includes('emergency') || command.includes('आपातकालीन') ||
      command.includes('help') || command.includes('मदद') ||
      command.includes('hospital') || command.includes('अस्पताल')
    ) {
      handleCallAmbulance();
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting voice recognition:', error);
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'hi-IN'; // Set to Hindi by default

        recognitionInstance.onstart = () => {
          setIsListening(true);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionInstance.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map(result => result.transcript)
            .join('');
          
          setTranscript(transcript);
          handleVoiceCommand(transcript.toLowerCase());
        };

        setRecognition(recognitionInstance);
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [handleVoiceCommand]);

  const handleCallAmbulance = () => {
    window.location.href = "tel:108"
  }

  const handleSendSMS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        const message = `Emergency! Need help! My location: https://www.google.com/maps?q=${latitude},${longitude}`
        window.location.href = `sms:108?body=${encodeURIComponent(message)}`
      }, () => {
        window.location.href = "sms:108?body=Emergency! Need help!"
      })
    } else {
      window.location.href = "sms:108?body=Emergency! Need help!"
    }
  }

  const handleCallHospital = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto p-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">आपातकालीन सहायता (Emergency Help)</h1>
          <p className="text-gray-600 mb-4">Tap any button or speak for immediate assistance</p>
          {/* Voice Input Status */}
          {transcript && (
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-600">Heard: {transcript}</p>
            </div>
          )}
          {/* Voice Input Button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full mb-4"
            onClick={() => isListening ? stopListening() : startListening()}
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-6 w-6 text-red-500" />
                Stop Voice Input
              </>
            ) : (
              <>
                <Mic className="mr-2 h-6 w-6 text-green-500" />
                Start Voice Input (बोलें)
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="destructive" 
            size="lg" 
            className="w-full py-6 text-lg"
            onClick={handleCallAmbulance}
          >
            <Phone className="mr-2 h-6 w-6" />
            Call Ambulance
          </Button>

          <Button 
            variant="destructive" 
            size="lg" 
            className="w-full py-6 text-lg"
            onClick={handleSendSMS}
          >
            <MessageSquare className="mr-2 h-6 w-6" />
            Send SMS
          </Button>
        </div>

        <Button 
          variant="destructive" 
          size="lg" 
          className="w-full py-6 text-xl font-bold"
          onClick={handleCallAmbulance}
        >
          <AlertTriangle className="mr-2 h-6 w-6" />
          PANIC BUTTON
        </Button>

        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Nearest Hospitals</h2>
          <div className="space-y-4">
            {hospitals.map((hospital, index) => (
              <div 
                key={index}
                className="flex items-center justify-between py-2 border-b border-blue-500 last:border-0"
              >
                <div>
                  <h3 className="font-medium">{hospital.name}</h3>
                  <p className="text-sm text-blue-200">{hospital.distance}</p>
                </div>
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCallHospital(hospital.phone)}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full py-4"
          onClick={() => {
            // Add first aid tips functionality
          }}
        >
          <span className="text-red-500 mr-2">♥</span>
          Show First Aid Tips
        </Button>
      </div>
    </MainLayout>
  )
}
