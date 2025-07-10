"use client"

import { useState } from 'react';
import { Button } from './ui/button';
import { AlertTriangle, Loader2, Phone } from 'lucide-react';

interface EmergencyButtonProps {
  variant?: 'default' | 'compact' | 'floating';
  label?: string;
  icon?: React.ReactNode;
  ambulanceNumber?: string;
  onClick?: () => void;
}

export default function EmergencyButton({ 
  variant = 'default',
  label = 'Emergency',
  icon = <AlertTriangle className="h-6 w-6" />,
  ambulanceNumber = "108",
  onClick
}: EmergencyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEmergency = async () => {
    try {
      setIsLoading(true);
      
      // If a custom onClick handler is provided, use it
      if (onClick) {
        onClick();
      } else {
        // Default behavior: directly call ambulance number
        window.location.href = `tel:${ambulanceNumber}`;
      }
    } catch (error) {
      console.error('Emergency call error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Button styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'compact':
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 shadow-md";
      case 'floating':
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-full flex items-center justify-center shadow-lg fixed bottom-6 right-6 z-50";
      default:
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full flex items-center gap-2 shadow-lg";
    }
  };

  return (
    <Button
      onClick={handleEmergency}
      disabled={isLoading}
      className={getButtonStyles()}
    >
      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        icon
      )}
      {variant !== 'floating' && <span>{label}</span>}
    </Button>
  );
}
