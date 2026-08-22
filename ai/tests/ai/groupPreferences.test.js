const { resolveGroupPreferences, enforceBudgetLimits } = require('../../src/services/ai/groupPreferences');

describe('Group Preferences Service', () => {
  beforeEach(() => {
    process.env.AI_MODE = 'mock'; // Force mock mode
  });

  const validRequest = {
    members: [
      { id: 'u1', preferences: { interests: ['culture'], pace: 'relaxed', budget: 30000 } },
      { id: 'u2', preferences: { interests: ['food'], pace: 'fast', budget: 40000 } }
    ]
  };

  it('should generate a valid consensus using mock provider', async () => {
    const result = await resolveGroupPreferences(validRequest);
    expect(result.consensus).toBeDefined();
    expect(result.member_satisfaction.length).toBeGreaterThan(0);
    expect(result.conflicts.length).toBeGreaterThan(0);
  });

  it('should enforce strict budget limits algorithmically', () => {
    const parsedOutput = {
      consensus: { budget: 50000 }
    };
    const overridden = enforceBudgetLimits(parsedOutput, validRequest.members);
    
    // Lowest budget was 30000
    expect(overridden.consensus.budget).toBe(30000);
  });

  it('should throw error for invalid input', async () => {
    const invalidReq = { members: [{ id: 'u1' }] }; // Needs at least 2
    await expect(resolveGroupPreferences(invalidReq)).rejects.toThrow(/INVALID_INPUT/);
  });
});
