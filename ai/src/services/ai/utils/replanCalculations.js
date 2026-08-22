const { calculateTripCost } = require('./tripCalculations');

/**
 * Calculates the total cost of an itinerary deterministically.
 */
function calculateItineraryCost(itinerary) {
  if (!itinerary || !Array.isArray(itinerary.days)) return 0;
  return calculateTripCost(itinerary.days);
}

/**
 * Calculates the exact cost difference between the original and replanned itinerary.
 * Negative value means savings. Positive value means extra cost.
 */
function calculateCostDifference(originalCost, replannedCost) {
  if (typeof originalCost !== 'number' || typeof replannedCost !== 'number') return 0;
  return replannedCost - originalCost;
}

module.exports = {
  calculateItineraryCost,
  calculateCostDifference
};
