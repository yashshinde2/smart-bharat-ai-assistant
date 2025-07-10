import { NextResponse } from 'next/server';

// Twilio Configuration (Free Trial)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

// OpenStreetMap API (Free, no key needed)
const OSM_API_URL = 'https://nominatim.openstreetmap.org/reverse';

// Firebase Configuration (Free tier)
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY!;
const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL!;

interface EmergencyAlert {
  id: string;
  type: 'emergency' | 'sos';
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  message: string;
  timestamp: string;
  contact: {
    name: string;
    phone: string;
  };
}

// Get address from coordinates using OpenStreetMap
async function getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(
      `${OSM_API_URL}?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SmartBharat-Emergency-App/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get address');
    }
    
    const data = await response.json();
    return data.display_name || `${latitude}, ${longitude}`;
  } catch (error) {
    console.error('Error getting address:', error);
    return `${latitude}, ${longitude}`;
  }
}

// Store emergency alert in Firebase
async function storeEmergencyAlert(alert: EmergencyAlert): Promise<void> {
  try {
    const response = await fetch(`${FIREBASE_DATABASE_URL}/emergency-alerts.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alert)
    });
    
    if (!response.ok) {
      throw new Error('Failed to store emergency alert');
    }
  } catch (error) {
    console.error('Error storing alert:', error);
    // Continue even if storage fails
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { latitude, longitude, message, contactName, contactPhone } = body;

    // Validate required fields
    if (!latitude || !longitude || !message || !contactName || !contactPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get address from coordinates
    const address = await getAddressFromCoordinates(latitude, longitude);

    // Create emergency alert
    const alert: EmergencyAlert = {
      id: `sos-${Date.now()}`,
      type: 'sos',
      location: {
        latitude,
        longitude,
        address
      },
      message,
      timestamp: new Date().toISOString(),
      contact: {
        name: contactName,
        phone: contactPhone
      }
    };

    // Store alert in Firebase
    await storeEmergencyAlert(alert);

    // Send SMS using Twilio
    const twilioResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        To: contactPhone,
        From: TWILIO_PHONE_NUMBER,
        Body: `EMERGENCY ALERT: ${message}\nLocation: ${address}\nMap: https://www.google.com/maps?q=${latitude},${longitude}`
      })
    });

    if (!twilioResponse.ok) {
      console.error('Failed to send SMS alert');
      // Continue even if SMS fails
    }

    return NextResponse.json({ 
      success: true,
      alert,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Emergency alert error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to send emergency alert',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 