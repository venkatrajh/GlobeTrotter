const { generateTrip } = require('../../src/services/ai/tripGenerator');

describe('Trip Generator Service', () => {
  beforeEach(() => {
    process.env.AI_MODE = 'mock'; // Force mock mode
  });

  it('should generate a valid trip using the mock provider', async () => {
    const request = {
      destination: 'Tokyo',
      days: 3,
      budget: 30000,
      currency: 'INR',
      travel_style: 'balanced'
    };

    const trip = await generateTrip(request);

    expect(trip.destination).toBe('Tokyo');
    expect(trip.days.length).toBe(3);
    expect(trip.currency).toBe('INR');
    
    // Check deterministic math overrides
    expect(trip.estimated_total).toBe(15000); // 3 days * 5000 (from mock)
    expect(trip.budget_status).toBe('within_budget'); // 15000 <= 30000
    expect(trip.warnings).toBeDefined();
  });

  it('should throw INVALID_INPUT for missing required fields', async () => {
    const request = {
      days: 3,
      budget: 30000,
      currency: 'INR'
    }; // Missing destination

    await expect(generateTrip(request)).rejects.toThrow(/INVALID_INPUT/);
  });

  it('should throw INVALID_INPUT for negative budget', async () => {
    const request = {
      destination: 'Tokyo',
      days: 3,
      budget: -500,
      currency: 'INR'
    };

    await expect(generateTrip(request)).rejects.toThrow(/INVALID_INPUT/);
  });
});
