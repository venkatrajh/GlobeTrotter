const { calculateDailyCost, calculateTripCost, calculateBudgetStatus } = require('../../src/services/ai/utils/tripCalculations');

describe('Trip Calculations', () => {
  describe('calculateDailyCost', () => {
    it('should sum activity costs correctly', () => {
      const day = {
        activities: [
          { estimated_cost: 1000 },
          { estimated_cost: 2500 }
        ]
      };
      expect(calculateDailyCost(day)).toBe(3500);
    });

    it('should handle missing costs gracefully', () => {
      const day = {
        activities: [
          { estimated_cost: 1000 },
          { estimated_cost: null },
          {}
        ]
      };
      expect(calculateDailyCost(day)).toBe(1000);
    });

    it('should return 0 for empty day', () => {
      expect(calculateDailyCost({})).toBe(0);
    });
  });

  describe('calculateTripCost', () => {
    it('should sum daily costs correctly', () => {
      const days = [
        { activities: [{ estimated_cost: 1000 }] },
        { activities: [{ estimated_cost: 2000 }] }
      ];
      expect(calculateTripCost(days)).toBe(3000);
    });
  });

  describe('calculateBudgetStatus', () => {
    it('should return within_budget when total is less than or equal to budget', () => {
      expect(calculateBudgetStatus(4000, 5000)).toBe('within_budget');
      expect(calculateBudgetStatus(5000, 5000)).toBe('within_budget');
    });

    it('should return over_budget when total exceeds budget', () => {
      expect(calculateBudgetStatus(6000, 5000)).toBe('over_budget');
    });

    it('should return budget_unknown for invalid input', () => {
      expect(calculateBudgetStatus(null, 5000)).toBe('budget_unknown');
      expect(calculateBudgetStatus(5000, -1)).toBe('budget_unknown');
    });
  });
});
