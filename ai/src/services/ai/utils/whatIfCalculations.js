const { calculateItineraryCost } = require('./replanCalculations');

/**
 * Calculates deterministic totals for the What-If Simulator.
 * This guarantees we never trust the AI's math, enforcing strict JavaScript addition.
 */
function calculateWhatIfTotals(original, simulated) {
  const originalTotal = calculateItineraryCost(original);
  const simulatedTotal = calculateItineraryCost(simulated);
  const costDifference = simulatedTotal - originalTotal;
  
  return {
    original_total: originalTotal,
    projected_total: simulatedTotal,
    cost_difference: costDifference
  };
}

/**
 * Deep clones the original itinerary to ensure the simulator does not mutate it.
 */
function cloneItinerary(itinerary) {
  return JSON.parse(JSON.stringify(itinerary));
}

module.exports = {
  calculateWhatIfTotals,
  cloneItinerary
};
