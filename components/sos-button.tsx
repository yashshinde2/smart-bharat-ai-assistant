"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { AlertTriangle, Phone, MessageSquare, MapPin, Loader2, Map, Info, Plus, X, Globe } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface EmergencyContact {
  name: string
  phone: string
  description?: string
  category: "police" | "medical" | "fire" | "women" | "child" | "other"
  alternativeNumbers?: string[]
  website?: string
}

interface SOSButtonProps {
  variant?: "default" | "compact" | "floating"
  label?: string
  icon?: React.ReactNode
  emergencyContacts?: EmergencyContact[]
  showMap?: boolean
  allowCustomContacts?: boolean
  defaultEmergencyNumber?: string
}

// Define available languages
const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "fa", name: "Persian" },
]

export default function SOSButton({
  variant = "default",
  label = "Emergency",
  icon = <AlertTriangle className="h-6 w-6" />,
  showMap = true,
  allowCustomContacts = true,
  defaultEmergencyNumber = "108", // Default to ambulance number
  emergencyContacts = [
    // Medical first since it's the default
    { 
      name: "Ambulance", 
      phone: "108", 
      category: "medical", 
      description: "Emergency medical transport",
      alternativeNumbers: ["102"],
      website: "https://health.gov.in"
    },
    // Police
    { 
      name: "Police", 
      phone: "100", 
      category: "police", 
      description: "Emergency police assistance",
      alternativeNumbers: ["112"],
      website: "https://police.gov.in"
    },
    { 
      name: "Emergency Services", 
      phone: "112", 
      category: "police", 
      description: "General emergency services",
      alternativeNumbers: ["100", "101", "108"]
    },
    
    // Medical
    { 
      name: "COVID-19 Helpline", 
      phone: "1075", 
      category: "medical", 
      description: "COVID-19 related assistance",
      website: "https://covid19.gov.in"
    },
    { 
      name: "Mental Health Helpline", 
      phone: "1800-599-0019", 
      category: "medical", 
      description: "Mental health support",
      website: "https://nimhans.ac.in"
    },
    
    // Fire
    { 
      name: "Fire Department", 
      phone: "101", 
      category: "fire", 
      description: "Fire emergency services",
      alternativeNumbers: ["112"],
      website: "https://fire.gov.in"
    },
    
    // Women
    { 
      name: "Women Helpline", 
      phone: "1091", 
      category: "women", 
      description: "Women's safety and support",
      alternativeNumbers: ["112"],
      website: "https://wcd.gov.in"
    },
    { 
      name: "Women's Commission", 
      phone: "1091", 
      category: "women", 
      description: "Women's rights and protection",
      website: "https://ncw.gov.in"
    },
    
    // Child
    { 
      name: "Child Helpline", 
      phone: "1098", 
      category: "child", 
      description: "Child protection services",
      alternativeNumbers: ["112"],
      website: "https://childlineindia.org"
    },
    
    // Other
    { 
      name: "Disaster Management", 
      phone: "1070", 
      category: "other", 
      description: "Natural disaster assistance",
      alternativeNumbers: ["112"],
      website: "https://ndma.gov.in"
    },
    { 
      name: "Railway Helpline", 
      phone: "139", 
      category: "other", 
      description: "Railway emergency services",
      website: "https://indianrailways.gov.in"
    },
  ],
}: SOSButtonProps) {
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null)
  const [showContactOptions, setShowContactOptions] = useState(false)
  const [customMessage, setCustomMessage] = useState("")
  const [customContact, setCustomContact] = useState<EmergencyContact>({
    name: "",
    phone: "",
    category: "other",
    description: ""
  })

  const handleDirectCall = () => {
    window.location.href = `tel:${defaultEmergencyNumber}`;
  }

  const getLocation = async () => {
    try {
      setIsLoading(true)
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      )
      const { latitude, longitude } = position.coords
      setLocation({ latitude, longitude })
      setIsLoading(false)
    } catch (err) {
      console.error("Location error:", err)
      setError("Could not fetch your location. SMS will be sent without location.")
      setIsLoading(false)
    }
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleSendSMS = async (phone: string, message?: string) => {
    try {
      setIsLoading(true)
      if (!location) await getLocation()

      const defaultMessage = location
        ? `SOS! I need help. My location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`
        : "SOS! I need help."
      
      const finalMessage = message || defaultMessage

      // First make the emergency call
      handleCall(phone);

      // Then prepare the SMS
      setTimeout(() => {
        window.location.href = `sms:${phone}?body=${encodeURIComponent(finalMessage)}`
      }, 100); // Small delay to ensure call is initiated first
    } catch (error) {
      console.error("SMS error:", error)
      setError("Failed to send SMS. Please try calling directly.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCustomContact = () => {
    if (customContact.name && customContact.phone) {
      const newContact = {
        ...customContact,
        description: customContact.description || `Custom emergency contact: ${customContact.name}`
      }
      emergencyContacts.push(newContact)
      setShowContactOptions(false)
      setCustomContact({
        name: "",
        phone: "",
        category: "other",
        description: ""
      })
    }
  }

  const getButtonStyles = () => {
    switch (variant) {
      case "compact":
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 shadow-md"
      case "floating":
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-full flex items-center justify-center shadow-lg fixed bottom-6 right-6 z-50"
      default:
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full flex items-center gap-2 shadow-lg"
    }
  }

  const getSMSButtonStyles = () => {
    switch (variant) {
      case "compact":
        return "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 shadow-md"
      case "floating":
        return "bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-full flex items-center justify-center shadow-lg fixed bottom-6 right-6 z-50"
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full flex items-center gap-2 shadow-lg"
    }
  }

  const categories = ["police", "medical", "fire", "women", "child", "other"]
  
  const filteredContacts = selectedCategory 
    ? emergencyContacts.filter(contact => contact.category === selectedCategory)
    : emergencyContacts

  return (
    <div className="flex gap-2">
      <Button
        variant="destructive"
        size={variant === "compact" ? "sm" : "default"}
        className={getButtonStyles()}
        onClick={handleDirectCall}
        aria-label={`Call emergency at ${defaultEmergencyNumber}`}
        title={`Call emergency at ${defaultEmergencyNumber}`}
      >
        {icon}
        {variant !== "compact" && (
          <span className="ml-2">
            {label} ({defaultEmergencyNumber})
          </span>
        )}
      </Button>

      <Button
        variant="outline"
        size={variant === "compact" ? "sm" : "default"}
        className={getSMSButtonStyles()}
        onClick={() => setShowEmergencyDialog(true)}
        title="View all emergency options"
      >
        <MessageSquare className="h-6 w-6" />
        {variant !== "compact" && <span className="ml-2">More Options</span>}
      </Button>

      {/* Emergency Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Emergency Services
            </DialogTitle>
            <DialogDescription>
              Select a service to contact emergency responders
              {location && (
                <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <span className="h-4 w-4">📍</span>
                  Location will be included in SMS
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-sm mb-3">{error}</div>
          )}

          <Tabs defaultValue={selectedCategory || "services"} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="services">Emergency Services</TabsTrigger>
              <TabsTrigger value="sms">Quick SMS</TabsTrigger>
              {allowCustomContacts && (
                <TabsTrigger value="custom">Add Custom Contact</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="services">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  variant={selectedCategory === null ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map(category => (
                  <Button 
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Emergency Contacts List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(selectedCategory 
                  ? emergencyContacts.filter(contact => contact.category === selectedCategory)
                  : emergencyContacts
                ).map((contact, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowContactOptions(true);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                        {contact.description && (
                          <p className="text-xs text-gray-500 mt-1">{contact.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCall(contact.phone);
                          }}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        {contact.category !== "medical" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendSMS(contact.phone);
                            }}
                            disabled={isLoading}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {isLoading ? "Loading..." : "SMS"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sms">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Select Emergency Contact</Label>
                  <select 
                    id="contact"
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => {
                      const contact = emergencyContacts.find(c => c.phone === e.target.value);
                      if (contact) setSelectedContact(contact);
                    }}
                  >
                    <option value="">Select a contact</option>
                    {emergencyContacts
                      .filter(contact => contact.category !== "medical")
                      .map((contact, index) => (
                        <option key={index} value={contact.phone}>
                          {contact.name} ({contact.phone})
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Custom Message (Optional)</Label>
                  <Textarea 
                    id="message"
                    placeholder="Add your emergency message here..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="h-32"
                  />
                </div>

                {showMap && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </Label>
                    {location ? (
                      <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                        <span className="text-sm">
                          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, '_blank')}
                        >
                          View Map
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={getLocation}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Getting location...
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 mr-2" />
                            Get Location
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}

                <Button 
                  className="w-full"
                  onClick={() => {
                    if (selectedContact) {
                      handleSendSMS(selectedContact.phone, customMessage);
                    }
                  }}
                  disabled={!selectedContact || isLoading}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Emergency SMS
                </Button>
              </div>
            </TabsContent>
            
            {allowCustomContacts && (
              <TabsContent value="custom">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Contact Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Emergency Contact Name" 
                      value={customContact.name}
                      onChange={(e) => setCustomContact({...customContact, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="Emergency Phone Number" 
                      value={customContact.phone}
                      onChange={(e) => setCustomContact({...customContact, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select 
                      id="category"
                      className="w-full p-2 border rounded-md"
                      value={customContact.category}
                      onChange={(e) => setCustomContact({...customContact, category: e.target.value as any})}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Brief description of this emergency contact" 
                      value={customContact.description}
                      onChange={(e) => setCustomContact({...customContact, description: e.target.value})}
                    />
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleAddCustomContact}
                    disabled={!customContact.name || !customContact.phone}
                  >
                    Add Custom Contact
                  </Button>
                </div>
              </TabsContent>
            )}
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEmergencyDialog(false);
                setError(null);
                setSelectedCategory(null);
                setSelectedContact(null);
                setCustomMessage("");
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Options Dialog */}
      {selectedContact && (
        <Dialog open={showContactOptions} onOpenChange={setShowContactOptions}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  {selectedContact.name}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowContactOptions(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
              <DialogDescription>
                {selectedContact.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Primary Contact</p>
                <p className="text-xl font-bold">{selectedContact.phone}</p>
                {selectedContact.alternativeNumbers && selectedContact.alternativeNumbers.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Alternative Numbers</p>
                    {selectedContact.alternativeNumbers.map((number, index) => (
                      <p key={index} className="text-sm">{number}</p>
                    ))}
                  </div>
                )}
              </div>

              {selectedContact.website && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Website</p>
                  <a 
                    href={selectedContact.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedContact.website}
                  </a>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Custom Message (Optional)</h4>
                <Textarea 
                  placeholder="Add a custom message to include in your SMS"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleCall(selectedContact.phone)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                {selectedContact.category !== "medical" && (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleSendSMS(selectedContact.phone, customMessage)}
                    disabled={isLoading}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {isLoading ? "Loading..." : "Send SMS"}
                  </Button>
                )}
              </div>

              {showMap && location && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Your Location</h4>
                  <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, '_blank')}
                    >
                      <Map className="h-4 w-4 mr-1" />
                      View Map
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowContactOptions(false);
                  setCustomMessage("");
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
