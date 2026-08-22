require('dotenv').config();
const MockProvider = require('./providers/mockProvider');
const GeminiProvider = require('./providers/geminiProvider');

/**
 * Singleton factory to get the initialized AI provider based on environment config.
 */
class AIClient {
  constructor() {
    this.provider = null;
  }

  getProvider() {
    if (this.provider) {
      return this.provider;
    }

    const mode = process.env.AI_MODE || 'mock';

    if (mode === 'gemini') {
      this.provider = new GeminiProvider();
    } else {
      // Default to mock for safety and demo purposes
      this.provider = new MockProvider();
    }

    try {
      this.provider.init();
    } catch (error) {
      console.warn(`[AIClient] Failed to initialize ${mode} provider. Falling back to mock. Error: ${error.message}`);
      // Hard fallback if real provider fails to init (e.g. missing API key)
      this.provider = new MockProvider();
      this.provider.init();
    }

    return this.provider;
  }
}

// Export a singleton instance
module.exports = new AIClient();
