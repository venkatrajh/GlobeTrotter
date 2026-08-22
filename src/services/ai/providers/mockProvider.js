const AIProvider = require('./aiProvider');

/**
 * Deterministic Mock Provider for Fallback/Demo mode.
 */
class MockProvider extends AIProvider {
  init() {
    this.isInitialized = true;
    console.log('[MockProvider] Initialized successfully.');
  }

  async generateStructuredResponse(prompt, schema) {
    if (!this.isInitialized) {
      throw new Error('[MockProvider] Provider not initialized.');
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Basic deterministic routing based on prompt keywords.
    // In Phase 2, this will be expanded to return realistic mock data.
    if (prompt.includes('generate-trip')) {
      return {
        trip_summary: "A wonderful mock trip to Tokyo.",
        estimated_total: 50000,
        days: [],
        warnings: ["This is a mock response."]
      };
    }

    if (prompt.includes('copilot')) {
      return {
        message: "Mock copilot acknowledges your request.",
        actions: []
      };
    }

    // Default mock fallback
    return {
      status: "success",
      mock_data: true,
      message: "This is a deterministic mock response from MockProvider."
    };
  }
}

module.exports = MockProvider;
