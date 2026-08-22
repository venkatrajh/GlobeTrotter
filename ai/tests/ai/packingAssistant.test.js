const { generatePackingList } = require('../../src/services/ai/packingAssistant');

describe('Packing Assistant Service', () => {
  beforeEach(() => {
    process.env.AI_MODE = 'mock'; // Force mock mode
  });

  const validRequest = {
    destination: 'Tokyo',
    duration_days: 7,
    activities: ['Hiking Mt. Fuji', 'City tours'],
    travel_style: 'Backpacker'
  };

  it('should generate a valid packing list using mock provider', async () => {
    const result = await generatePackingList(validRequest);
    expect(result.categories.length).toBeGreaterThan(0);
    expect(result.essentials).toContain('Passport');
    
    // In our mock, weather context is missing, so it should warn
    expect(result.warnings.some(w => w.toLowerCase().includes('weather'))).toBe(true);
  });

  it('should throw error for invalid input', async () => {
    const invalidReq = { destination: 'Tokyo' }; // Missing duration_days
    await expect(generatePackingList(invalidReq)).rejects.toThrow(/INVALID_INPUT/);
  });
});
