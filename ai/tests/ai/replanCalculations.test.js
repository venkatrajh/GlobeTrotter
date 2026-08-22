const { calculateItineraryCost, calculateCostDifference } = require('../../src/services/ai/utils/replanCalculations');

describe('Replan Calculations', () => {
  it('should calculate cost difference deterministically', () => {
    expect(calculateCostDifference(10000, 8000)).toBe(-2000); // Savings
    expect(calculateCostDifference(10000, 15000)).toBe(5000); // Extra cost
    expect(calculateCostDifference(5000, 5000)).toBe(0);
  });

  it('should calculate itinerary cost accurately', () => {
    const itinerary = {
      days: [
        { activities: [{ estimated_cost: 1000 }] },
        { activities: [{ estimated_cost: 2000 }] }
      ]
    };
    expect(calculateItineraryCost(itinerary)).toBe(3000);
    expect(calculateItineraryCost(null)).toBe(0);
  });
});
