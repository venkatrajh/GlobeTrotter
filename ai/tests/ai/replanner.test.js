const { replanTrip } = require('../../src/services/ai/replanner');

describe('Auto-Replanner Service', () => {
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
            {
              id: 'a1',
              name: 'Meiji Shrine',
              category: 'culture',
              suggested_time: '09:00',
              duration_minutes: 120,
              estimated_cost: 0,
              location: 'Shibuya'
            },
            {
              id: 'a2',
              name: 'Tokyo Tower',
              category: 'attraction',
              suggested_time: '13:00',
              duration_minutes: 120,
              estimated_cost: 3000,
              location: 'Minato'
            },
            {
              id: 'a3',
              name: 'Shibuya Crossing',
              category: 'attraction',
              suggested_time: '16:00',
              duration_minutes: 60,
              estimated_cost: 0,
              location: 'Shibuya'
            }
          ]
        }
      ]
    },
    disruption: {
      type: 'activity_unavailable',
      description: 'Tokyo Tower is unavailable today.',
      affected_activity_id: 'a2',
      affected_day: 1
    },
    preferences: {
      must_keep_activity_ids: ['a1']
    }
  };

  it('should generate a valid replanned itinerary using mock provider', async () => {
    const result = await replanTrip(validRequest);
    
    expect(result.status).toBe('replanned');
    expect(result.cost_difference).toBeDefined();
    
    // Check minimal-change tracking
    expect(result.preserved_activity_ids).toContain('a1');
    expect(result.preserved_activity_ids).toContain('a3');
    
    // Ensure the new itinerary contains the replacement
    const replacement = result.itinerary.days[0].activities.find(a => a.id === 'replacement-1');
    expect(replacement).toBeDefined();
    expect(replacement.name).toBe('Mori Art Museum');
  });

  it('should reject must-keep constraint violations', async () => {
    const strictRequest = {
      ...validRequest,
      preferences: {
        must_keep_activity_ids: ['a2'] // The mock removes a2, so this must trigger a conflict
      }
    };

    const result = await replanTrip(strictRequest);
    
    expect(result.status).toBe('constraint_conflict');
    expect(result.warnings[0]).toContain('must-keep');
  });

  it('should throw INVALID_INPUT for missing disruption', async () => {
    const invalidReq = { itinerary: validRequest.itinerary };
    await expect(replanTrip(invalidReq)).rejects.toThrow(/INVALID_INPUT/);
  });
});
