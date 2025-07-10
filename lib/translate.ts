// .env.local (Place in root, do not expose publicly)
// GEMINI_API_KEY=AIzaSyBrYHsYchgDnAUQSaxRQ3wuZo6YVb2934Q

// -----------------------------
// pages/api/translate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { text, targetLanguage } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_GEMINI_API_URL;
  const translateApiUrl = process.env.NEXT_PUBLIC_TRANSLATE_API_URL;

  if (!apiKey) return res.status(500).json({ error: 'Missing Gemini API Key' });
  if (!text || !targetLanguage) return res.status(400).json({ error: 'Missing text or target language' });

  try {
    const prompt = `Translate this text to ${targetLanguage}:\n\n"${text}"`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const geminiData = await geminiRes.json();
    const translatedText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!translatedText) {
      return res.status(500).json({ error: 'Failed to extract translation' });
    }

    res.status(200).json({
      translatedText,
      sourceLanguage: 'auto',
      targetLanguage,
    });
  } catch (err) {
    console.error('Gemini translation error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// -----------------------------
// utils/translation.ts
export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationError {
  error: string;
}

export type TranslationResult = TranslationResponse | TranslationError;

const translationCache = new Map<string, string>();

export async function translateText(
  text: string,
  targetLanguage: string
): Promise<TranslationResult> {
  if (translationCache.has(text)) {
    return {
      translatedText: translationCache.get(text)!,
      sourceLanguage: 'auto',
      targetLanguage,
    };
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLanguage }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data?.error || 'Translation failed' };
    }

    translationCache.set(text, data.translatedText);
    return data as TranslationResponse;
  } catch (error) {
    console.error('Translation error:', error);
    return { error: 'Translation service error' };
  }
}

export async function translatePage(targetLanguage: string): Promise<void> {
  const textNodes = Array.from(document.querySelectorAll(
    'h1, h2, h3, h4, h5, h6, p, span, div, li, button, a, label, input[placeholder], textarea[placeholder]'
  ))
    .filter(node => {
      const style = window.getComputedStyle(node);
      return style.display !== 'none' &&
             style.visibility !== 'hidden' &&
             node.textContent?.trim() !== '';
    })
    .map(node => ({
      node,
      text: node.textContent?.trim() || ''
    }))
    .filter(item => item.text.length > 0);

  for (const item of textNodes) {
    const result = await translateText(item.text, targetLanguage);
    if ('translatedText' in result) {
      if (item.node instanceof HTMLInputElement || item.node instanceof HTMLTextAreaElement) {
        item.node.placeholder = result.translatedText;
      } else {
        item.node.textContent = result.translatedText;
      }
    } else {
      console.error(`Translation error: ${result.error}`);
    }
  }
}

export async function translateElement(
  element: HTMLElement,
  targetLanguage: string
): Promise<void> {
  if (!element || !element.textContent) return;

  const text = element.textContent.trim();
  if (!text) return;

  const result = await translateText(text, targetLanguage);
  if ('translatedText' in result) {
    element.textContent = result.translatedText;
  } else {
    console.error(`Translation error: ${result.error}`);
  }
}
