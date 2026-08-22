const { simulateWhatIf } = require('../../src/services/ai/whatIf');
const { calculateWhatIfTotals } = require('../../src/services/ai/utils/whatIfCalculations');

describe('What-If Simulator Service', () => {
  beforeEach(() => {
    process.env.AI_MODE = 'mock'; // Force mock mode
  });

  const validRequest = {
    scenario: 'remove_activity',
    description: 'What if I remove Tokyo Tower?',
    itinerary: {
      destination: 'Tokyo',
      days: [
        {
          day: 1,
          city: 'Tokyo',
          activities: [
            { id: 'a1', name: 'Act 1', category: 'attraction', suggested_time: '09:00', duration_minutes: 60, estimated_cost: 2000 },
            { id: 'a2', name: 'Tokyo Tower', category: 'attraction', suggested_time: '11:00', duration_minutes: 60, estimated_cost: 3000 }
          ]
        }
      ]
    },
    budget: 50000,
    currency: 'INR'
  };

  it('should calculate what-if totals deterministically', () => {
    const original = validRequest.itinerary;
    const simulated = {
      days: [
        { activities: [{ estimated_cost: 2000 }] } // a2 removed
      ]
    };
    
    const totals = calculateWhatIfTotals(original, simulated);
    expect(totals.original_total).toBe(5000); // 2000 + 3000
    expect(totals.projected_total).toBe(2000);
    expect(totals.cost_difference).toBe(-3000);
  });

  it('should generate a valid simulated itinerary using mock provider', async () => {
    const result = await simulateWhatIf(validRequest);
    
    expect(result.scenario).toBe('remove_activity');
    expect(result.original_total).toBe(5000);
    
    // In our mock, we will remove Tokyo Tower (3000)
    expect(result.projected_total).toBe(2000); 
    expect(result.cost_difference).toBe(-3000);
    expect(result.itinerary.days[0].activities.length).toBe(1);
  });

  it('should throw error for invalid input', async () => {
    const invalidReq = { scenario: 'unknown' };
    await expect(simulateWhatIf(invalidReq)).rejects.toThrow(/INVALID_INPUT/);
  });
});
