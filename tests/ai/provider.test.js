const aiClient = require('../../src/services/ai/aiClient');
const MockProvider = require('../../src/services/ai/providers/mockProvider');

describe('AI Provider Abstraction', () => {
  beforeEach(() => {
    // Reset env vars before each test
    delete process.env.AI_MODE;
    delete process.env.GEMINI_API_KEY;
  });

  it('should default to MockProvider when AI_MODE is not set', () => {
    const provider = aiClient.getProvider();
    expect(provider).toBeInstanceOf(MockProvider);
  });

  it('should return a deterministic mock response for trip generation', async () => {
    process.env.AI_MODE = 'mock';
    const provider = aiClient.getProvider();
    
    const response = await provider.generateStructuredResponse('generate-trip for Tokyo', null);
    
    expect(response).toBeDefined();
    expect(response.estimated_total).toBe(50000);
    expect(response.trip_summary).toContain('Tokyo');
  });

  it('should fallback to mock if gemini is selected but no API key is provided', () => {
    process.env.AI_MODE = 'gemini';
    // No GEMINI_API_KEY set
    const provider = aiClient.getProvider();
    
    // It should catch the error and fallback to mock
    expect(provider).toBeInstanceOf(MockProvider);
  });
});
