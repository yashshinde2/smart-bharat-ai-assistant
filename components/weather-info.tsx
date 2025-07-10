"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, Wind } from "lucide-react";
import UpdateCard from "./update-card";

export default function WeatherInfo() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // For testing - replace this with your actual API key
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "YOUR_API_KEY_HERE";
        
        if (apiKey === "YOUR_API_KEY_HERE") {
          throw new Error("Please add your WeatherAPI.com API key to .env.local file. Get a free API key from https://www.weatherapi.com/");
        }

        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Kolhapur`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Failed to fetch weather data");
        }

        const data = await response.json();
        setWeather(data);
      } catch (err: any) {
        console.error("Failed to fetch weather:", err);
        setError(err.message || "Failed to load weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <UpdateCard title="Weather Info" icon={<Sun className="h-5 w-5" />} color="bg-brand-blue">
        <p>Loading weather...</p>
      </UpdateCard>
    );
  }

  if (error || !weather?.current) {
    return (
      <UpdateCard title="Weather Info" icon={<Sun className="h-5 w-5" />} color="bg-brand-blue">
        <p className="text-red-500">{error}</p>
      </UpdateCard>
    );
  }

  const {
    temp_c,
    condition,
    wind_kph,
    humidity,
    cloud,
  } = weather.current;

  return (
    <UpdateCard title="Weather Info" icon={<Sun className="h-5 w-5" />} color="bg-brand-blue">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">{temp_c}°C</h3>
            <p className="text-sm text-gray-600">{condition?.text || "No condition info"}</p>
          </div>
          {condition?.icon && (
            <img src={condition.icon} alt={condition.text} className="h-12 w-12" />
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Wind className="h-5 w-5 mx-auto text-gray-500" />
            <p className="text-xs mt-1">{wind_kph} km/h</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <CloudRain className="h-5 w-5 mx-auto text-gray-500" />
            <p className="text-xs mt-1">{humidity}%</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <Cloud className="h-5 w-5 mx-auto text-gray-500" />
            <p className="text-xs mt-1">{cloud}%</p>
          </div>
        </div>

        <div className="text-sm">
          <p>
            {condition?.text?.toLowerCase().includes("rain")
              ? "Carry an umbrella. Rain is expected."
              : "Good day for farming activities. No rain expected."}
          </p>
        </div>
      </div>
    </UpdateCard>
  );
}
