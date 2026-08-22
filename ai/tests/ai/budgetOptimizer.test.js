const { optimizeBudget } = require('../../src/services/ai/budgetOptimizer');

describe('Budget Optimizer Service', () => {
  beforeEach(() => {
    process.env.AI_MODE = 'mock'; // Force mock mode
  });

  const validRequest = {
    budget: 50000,
    currency: 'INR',
    itinerary: {
      destination: 'Tokyo',
      days: [
        {
          day: 1,
          city: 'Tokyo',
          activities: [
            {
              id: 'a1',
              name: 'Premium Activity',
              category: 'attraction',
              suggested_time: '10:00',
              duration_minutes: 120,
              estimated_cost: 62000
            }
          ]
        }
      ]
    },
    preferences: {
      must_keep_activity_ids: []
    }
  };

  it('should generate a valid budget optimization using mock provider', async () => {
    const result = await optimizeBudget(validRequest);
    
    // Check deterministic math overrides
    expect(result.current_total).toBe(62000);
    expect(result.target_budget).toBe(50000);
    expect(result.over_budget_by).toBe(12000);
    
    // Check mock suggestion applied
    expect(result.suggestions.length).toBe(1);
    expect(result.suggestions[0].estimated_savings).toBe(4000); // 5000 - 1000
    
    expect(result.potential_savings).toBe(4000);
    expect(result.projected_total).toBe(58000);
  });

  it('should strip out must-keep activities', async () => {
    const strictRequest = {
      ...validRequest,
      preferences: {
        must_keep_activity_ids: ['a1'] // The mock returns a suggestion targeting 'a1'
      }
    };

    const result = await optimizeBudget(strictRequest);
    
    // Because a1 was must-keep, the suggestion modifying it must have been discarded
    expect(result.suggestions.length).toBe(0);
    expect(result.potential_savings).toBe(0);
    expect(result.projected_total).toBe(62000);
  });

  it('should throw INVALID_INPUT for negative budget', async () => {
    const invalidReq = { ...validRequest, budget: -100 };
    await expect(optimizeBudget(invalidReq)).rejects.toThrow(/INVALID_INPUT/);
  });

  it('should throw INVALID_INPUT for missing itinerary', async () => {
    const invalidReq = { budget: 50000, currency: 'INR' };
    await expect(optimizeBudget(invalidReq)).rejects.toThrow(/INVALID_INPUT/);
  });
});
