import { NextRequest, NextResponse } from 'next/server';

// DeepSeek API configuration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare the prompt for translation
    const prompt = `Translate the following text to ${targetLanguage}. Only return the translated text without any explanations or additional content: "${text}"`;

    // Call DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek API error:', errorData);
      return NextResponse.json(
        { error: 'Translation service error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract the translated text from the response
    const translatedText = data.choices[0]?.message?.content?.trim() || text;

    return NextResponse.json({
      translatedText,
      sourceLanguage: 'auto',
      targetLanguage,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 