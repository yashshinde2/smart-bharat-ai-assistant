// Gemini API configuration and types
export interface GeminiConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
}

export interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
}

export interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: {
    message: string;
    code?: number;
  };
}

export class GeminiAPI {
  private apiKey: string;
  private apiUrl: string;

  constructor(config: { apiKey: string; apiUrl: string }) {
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl;
  }

  async generateContent(prompt: string, signal?: AbortSignal): Promise<{ response?: string; error?: string }> {
    try {
      if (!this.apiKey || !this.apiUrl) {
        throw new Error('Gemini API key or URL is not configured');
      }

      const url = `${this.apiUrl}?key=${this.apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        } as GeminiRequest),
        signal
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error?.message || `Request failed with status ${response.status}`
        };
      }

      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!generatedText) {
        return { error: 'No response generated' };
      }

      return { response: generatedText };

    } catch (error) {
      console.error('Gemini API Error:', error);
      return { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }

  // Validate API key
  async validateApiKey(): Promise<boolean> {
    try {
      const result = await this.generateContent('Test connection');
      return !result.error;
    } catch {
      return false;
    }
  }
}

// Create and export default instance
const createGeminiAPI = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  const apiUrl = process.env.NEXT_PUBLIC_GEMINI_API_URL || '';
  return new GeminiAPI({
    apiKey,
    apiUrl
  });
};

export const geminiAPI = createGeminiAPI();