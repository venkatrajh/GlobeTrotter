const AIProvider = require('./aiProvider');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Real Gemini API Provider implementation.
 */
class GeminiProvider extends AIProvider {
  constructor() {
    super();
    this.genAI = null;
    this.model = null;
  }

  init() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in the environment.');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-pro or gemini-1.5-flash depending on the need.
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('[GeminiProvider] Initialized successfully.');
  }

  async generateStructuredResponse(prompt, schema) {
    if (!this.model) {
      throw new Error('[GeminiProvider] Provider not initialized. Call init() first.');
    }

    try {
      // In Phase 2, this will use schema to enforce structured output via `responseSchema` 
      // or by appending JSON instructions to the prompt.
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          // responseSchema: schema // Will be passed here when full schemas are built
        }
      });
      
      const response = result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('[GeminiProvider] Error generating response:', error);
      throw error;
    }
  }
}

module.exports = GeminiProvider;
