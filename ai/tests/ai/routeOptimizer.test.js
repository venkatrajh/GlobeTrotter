const { optimizeRoute } = require('../../src/services/ai/routeOptimizer');

describe('Route Optimizer Service', () => {
  beforeEach(() => {
    process.env.AI_MODE = 'mock'; // Force mock mode
  });

  const validRequest = {
    itinerary: {
      destination: 'Tokyo',
      days: [
        {
          day: 1,
          city: 'Tokyo',
          activities: [
            { id: 'a1', name: 'Act 1', category: 'attraction', suggested_time: '09:00', duration_minutes: 60, estimated_cost: 0 },
            { id: 'a2', name: 'Act 2', category: 'attraction', suggested_time: '11:00', duration_minutes: 60, estimated_cost: 0 },
            { id: 'a3', name: 'Act 3', category: 'attraction', suggested_time: '13:00', duration_minutes: 60, estimated_cost: 0 }
          ]
        }
      ]
    },
    preferences: {
      fixed_time_activity_ids: []
    },
    travel_metadata: [
      { from_activity_id: 'a1', to_activity_id: 'a2', estimated_minutes: 30 },
      { from_activity_id: 'a2', to_activity_id: 'a3', estimated_minutes: 30 },
      { from_activity_id: 'a1', to_activity_id: 'a3', estimated_minutes: 10 },
      { from_activity_id: 'a3', to_activity_id: 'a2', estimated_minutes: 10 }
    ]
  };

  it('should generate a valid optimized route using mock provider', async () => {
    const result = await optimizeRoute(validRequest);
    expect(result.status).toBe('optimized');
    expect(result.estimated_travel_minutes_before).toBe(60); // 30 + 30
    
    // In our mock, it will reorder to a1 -> a3 -> a2
    expect(result.estimated_travel_minutes_after).toBe(20); // 10 + 10
    expect(result.estimated_savings_minutes).toBe(40);
  });

  it('should reject optimization if fixed times are violated', async () => {
    const strictRequest = {
      ...validRequest,
      preferences: {
        fixed_time_activity_ids: ['a2'] // The mock reorders a2 to 13:00
      }
    };

    const result = await optimizeRoute(strictRequest);
    expect(result.status).toBe('constraint_conflict');
    expect(result.warnings[0]).toContain('fixed-time activities');
  });

  it('should throw error for invalid input', async () => {
    await expect(optimizeRoute({})).rejects.toThrow(/INVALID_INPUT/);
  });
});
