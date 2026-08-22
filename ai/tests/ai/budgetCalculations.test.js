const {
  calculateItineraryCost,
  calculateOverBudget,
  validateSuggestion,
  calculateTotalSavings,
  calculateProjectedCost
} = require('../../src/services/ai/utils/budgetCalculations');

describe('Budget Calculations', () => {
  describe('calculateItineraryCost', () => {
    it('should sum activity costs correctly', () => {
      const itinerary = {
        days: [
          { activities: [{ estimated_cost: 1000 }] },
          { activities: [{ estimated_cost: 2000 }] }
        ]
      };
      expect(calculateItineraryCost(itinerary)).toBe(3000);
    });

    it('should return 0 for empty or invalid itinerary', () => {
      expect(calculateItineraryCost(null)).toBe(0);
      expect(calculateItineraryCost({})).toBe(0);
    });
  });

  describe('calculateOverBudget', () => {
    it('should correctly calculate over budget amount', () => {
      expect(calculateOverBudget(60000, 50000)).toBe(10000);
    });

    it('should return 0 if within budget', () => {
      expect(calculateOverBudget(40000, 50000)).toBe(0);
    });
  });

  describe('validateSuggestion', () => {
    const mockItinerary = {}; // Currently unused in calculation but kept for future expansion

    it('should protect must-keep activities', () => {
      const sug = { current_activity_id: 'a1', current_cost: 5000 };
      expect(validateSuggestion(sug, mockItinerary, ['a1'])).toBeNull();
    });

    it('should recalculate estimated savings accurately', () => {
      const sug = { current_cost: 5000, replacement_cost: 2000, estimated_savings: 99999 };
      const valid = validateSuggestion(sug, mockItinerary, []);
      expect(valid.estimated_savings).toBe(3000); // Deterministically overriding the AI math
    });

    it('should ensure non-negative costs', () => {
      const sug = { current_cost: -500, replacement_cost: -200 };
      const valid = validateSuggestion(sug, mockItinerary, []);
      expect(valid.current_cost).toBe(0);
      expect(valid.replacement_cost).toBe(0);
      expect(valid.estimated_savings).toBe(0);
    });
  });

  describe('calculateTotalSavings', () => {
    it('should sum valid savings', () => {
      const sugs = [{ estimated_savings: 1000 }, { estimated_savings: 2500 }];
      expect(calculateTotalSavings(sugs)).toBe(3500);
    });
  });

  describe('calculateProjectedCost', () => {
    it('should subtract savings from total', () => {
      expect(calculateProjectedCost(62000, 14500)).toBe(47500);
    });

    it('should cap at zero', () => {
      expect(calculateProjectedCost(5000, 10000)).toBe(0);
    });
  });
});
