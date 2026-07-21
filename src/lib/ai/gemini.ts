import { env } from '@/lib/env';

export type GeminiModel = 'gemini-2.5-flash' | 'gemini-1.5-flash' | 'gemini-1.5-pro';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: (
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  )[];
}

export interface GenerateContentParams {
  prompt: string;
  systemInstruction?: string;
  history?: GeminiMessage[];
  model?: GeminiModel;
  temperature?: number;
  maxOutputTokens?: number;
  inlineImage?: {
    mimeType: string;
    base64Data: string;
  };
}

export interface GeminiResponse {
  text: string;
  success: boolean;
  modelUsed: string;
  error?: string;
}

export class GeminiAIEngine {
  private static getApiKey(): string {
    return env.VITE_GEMINI_API_KEY || '';
  }

  /**
   * Generates content using Google Gemini API (Supports text & base64 image multimodal inputs)
   */
  static async generateContent(params: GenerateContentParams): Promise<GeminiResponse> {
    const apiKey = this.getApiKey();

    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      return {
        text: '⚠️ **Gemini API Key Missing**: Please set `VITE_GEMINI_API_KEY` in your `.env.local` file to enable live AI intelligence responses.',
        success: false,
        modelUsed: 'none',
        error: 'Missing VITE_GEMINI_API_KEY in .env.local',
      };
    }

    const modelName = params.model || 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    // Format conversation contents
    const contents: GeminiMessage[] = [];

    if (params.history && params.history.length > 0) {
      contents.push(...params.history);
    }

    const userParts: any[] = [{ text: params.prompt }];

    if (params.inlineImage) {
      userParts.push({
        inlineData: {
          mimeType: params.inlineImage.mimeType,
          data: params.inlineImage.base64Data.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
    }

    contents.push({
      role: 'user',
      parts: userParts,
    });

    const payload: any = {
      contents,
      generationConfig: {
        temperature: params.temperature ?? 0.7,
        maxOutputTokens: params.maxOutputTokens ?? 2048,
      },
    };

    if (params.systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: params.systemInstruction }],
      };
    }

    try {
      let response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Retries on 429 Rate Limit
      if (response.status === 429) {
        console.warn('[MAXCES Gemini] Rate limited. Retrying after 1.5s...');
        await new Promise((resolve) => setTimeout(resolve, 1500));
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      // Fallback to gemini-1.5-flash if 2.5-flash returns 404
      if (response.status === 404 && modelName === 'gemini-2.5-flash') {
        console.warn('[MAXCES Gemini] gemini-2.5-flash endpoint not found. Falling back to gemini-1.5-flash...');
        const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        response = await fetch(fallbackEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Gemini API HTTP Error ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!generatedText) {
        throw new Error('Received empty response from Gemini API.');
      }

      return {
        text: generatedText,
        success: true,
        modelUsed: modelName,
      };
    } catch (err: any) {
      console.error('[MAXCES Gemini Engine Error]:', err);
      return {
        text: `⚠️ **AI Intelligence Error**: ${err?.message || 'Failed to connect to Gemini AI Engine.'}`,
        success: false,
        modelUsed: modelName,
        error: err?.message,
      };
    }
  }
}
