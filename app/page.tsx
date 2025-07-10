"use client";

import MainLayout from "@/components/main-layout";
import VoiceAssistant from "@/components/voice-assistant";

import React, { useState } from "react";
import axios from "axios";

export default function Page() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleAsk = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_GEMINI_API_URL;

    if (!apiKey || !apiUrl) {
      setResponse("API key or URL not configured.");
      return;
    }

    try {
      const res = await axios.post(
        `${apiUrl}?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: input }]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const reply = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
      setResponse(reply || 'No response from Gemini.');
    } catch (error: any) {
      console.error("Error response:", error?.response?.data || error);
      setResponse('Error: ' + (error?.response?.data?.error?.message || "Something went wrong."));
    }
  };

  return (
    <MainLayout>
      <div className="py-6 max-w-lg mx-auto pb-28 px-4">
        <h2 className="text-xl font-bold mb-6 text-center">
          आपका स्वागत है! (Welcome!)
        </h2>

        <VoiceAssistant />

        <div className="mt-8 w-full">
          <div className="flex items-center gap-2 bg-[#f5f6fa] rounded-full px-4 py-2 shadow-sm border border-gray-200">
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
            />
            <button
              className="bg-[#ff7900] text-white text-sm px-4 py-1.5 rounded-full hover:bg-orange-600"
              onClick={handleAsk}
            >
              Send
            </button>
          </div>

          {response && (
            <p className="mt-4 text-sm text-gray-700 bg-white p-4 rounded-lg shadow-md">
              {response}
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}