const { calculateTripCost } = require('./tripCalculations');

/**
 * Calculates the current total cost of the itinerary deterministically.
 */
function calculateItineraryCost(itinerary) {
  if (!itinerary || !Array.isArray(itinerary.days)) return 0;
  return calculateTripCost(itinerary.days);
}

/**
 * Calculates how much the current total exceeds the budget.
 * Returns 0 if within budget.
 */
function calculateOverBudget(currentTotal, budget) {
  if (typeof currentTotal !== 'number' || typeof budget !== 'number') return 0;
  return Math.max(0, currentTotal - budget);
}

/**
 * Validates and repairs a suggestion's math, and checks if it violates must-keep rules.
 * @returns {object} The validated suggestion, or null if it violates a strict rule.
 */
function validateSuggestion(suggestion, itinerary, mustKeepIds = []) {
  if (!suggestion) return null;

  // Protect must-keep activities
  if (suggestion.current_activity_id && mustKeepIds.includes(suggestion.current_activity_id)) {
    console.warn(`[Budget Optimizer] Rejected suggestion trying to modify must-keep activity: ${suggestion.current_activity_id}`);
    return null;
  }

  // Ensure non-negative costs
  const currentCost = Math.max(0, suggestion.current_cost || 0);
  const replacementCost = Math.max(0, suggestion.replacement_cost || 0);
  
  // Deterministically recalculate savings
  const estimatedSavings = Math.max(0, currentCost - replacementCost);
  
  // Return a cloned, fixed suggestion
  return {
    ...suggestion,
    current_cost: currentCost,
    replacement_cost: replacementCost,
    estimated_savings: estimatedSavings
  };
}

/**
 * Calculates the total savings from a list of validated suggestions.
 */
function calculateTotalSavings(suggestions) {
  if (!Array.isArray(suggestions)) return 0;
  return suggestions.reduce((total, sug) => total + (sug.estimated_savings || 0), 0);
}

/**
 * Calculates the projected cost after applying savings.
 */
function calculateProjectedCost(currentTotal, validatedSavings) {
  if (typeof currentTotal !== 'number' || typeof validatedSavings !== 'number') return 0;
  return Math.max(0, currentTotal - validatedSavings);
}

module.exports = {
  calculateItineraryCost,
  calculateOverBudget,
  validateSuggestion,
  calculateTotalSavings,
  calculateProjectedCost
};
