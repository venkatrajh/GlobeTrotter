/**
 * AI Provider Interface/Abstraction.
 * Any specific AI provider (Gemini, OpenAI, Mock) should implement these methods.
 */
class AIProvider {
  /**
   * Initialize the provider with required config/keys.
   */
  init() {
    throw new Error('Not implemented');
  }

  /**
   * Generates a structured response based on a prompt and schema.
   * @param {string} prompt - The system/user prompt.
   * @param {object} schema - The expected JSON schema (optional depending on provider support).
   * @returns {Promise<object>} - Parsed JSON object.
   */
  async generateStructuredResponse(prompt, schema) {
    throw new Error('Not implemented');
  }
}

module.exports = AIProvider;
