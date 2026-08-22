const { answerCopilotQuery } = require('../../src/services/ai/copilot');

describe('Copilot Service', () => {
  beforeEach(() => {
    process.env.AI_MODE = 'mock'; // Force mock mode
  });

  const validRequest = {
    message: 'What should I do after Meiji Shrine?',
    itinerary: {
      destination: 'Tokyo',
      days: []
    }
  };

  it('should answer a valid query using mock provider', async () => {
    const result = await answerCopilotQuery(validRequest);
    expect(result.intent).toBe('activity_recommendation');
    expect(result.message).toContain('after visiting Meiji Shrine');
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.actions).toBeDefined();
  });

  it('should throw error for missing message', async () => {
    await expect(answerCopilotQuery({})).rejects.toThrow(/INVALID_INPUT/);
  });
});
