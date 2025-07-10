"use client"

import { useSettings } from "@/lib/store/settings"
import MainLayout from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Volume2, Bell, Globe, Moon, Smartphone, AlertTriangle, Cloud } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
export default function SettingsPage() {
  const {
    voiceOutput, setVoiceOutput,
    darkMode, setDarkMode,
    healthAlerts, setHealthAlerts,
    weatherAlerts, setWeatherAlerts,
    emergencyAlerts, setEmergencyAlerts,
    language, setLanguage
  } = useSettings();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated",
    })
  }

  return (
    <MainLayout>
      <div className="py-6">
        <h2 className="text-xl font-bold mb-6">सेटिंग्स (Settings)</h2>

        <div className="space-y-6">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg font-medium">Voice & Language</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="voice-output">Voice Output</Label>
                </div>
                <Switch id="voice-output" checked={voiceOutput} onCheckedChange={setVoiceOutput} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="language">Preferred Language</Label>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                    <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg font-medium">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <Label htmlFor="health-alerts">Health Alerts</Label>
                </div>
                <Switch id="health-alerts" checked={healthAlerts} onCheckedChange={setHealthAlerts} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-blue-500" />
                  <Label htmlFor="weather-alerts">Weather Alerts</Label>
                </div>
                <Switch id="weather-alerts" checked={weatherAlerts} onCheckedChange={setWeatherAlerts} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-500" />
                  <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                </div>
                <Switch id="emergency-alerts" checked={emergencyAlerts} onCheckedChange={setEmergencyAlerts} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg font-medium">Display & App</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Install App</Label>
                    <p className="text-xs text-muted-foreground">Add to home screen</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  if ((window as any).deferredPrompt) {
                    (window as any).deferredPrompt.prompt();
                  } else {
                    alert('To install the app, use your browser\'s "Add to Home Screen" feature.');
                  }
                }}>
                  Install
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveSettings} className="w-full bg-brand-green hover:bg-brand-green/90">
            Save Settings
          </Button>
        </div>
      </div>

    </MainLayout>
  );
}

