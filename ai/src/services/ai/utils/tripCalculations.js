/**
 * Calculates the total cost for a single day deterministically based on its activities.
 * @param {object} day - The day object containing activities.
 * @returns {number} The calculated daily cost.
 */
function calculateDailyCost(day) {
  if (!day || !Array.isArray(day.activities)) return 0;
  
  return day.activities.reduce((total, activity) => {
    const cost = typeof activity.estimated_cost === 'number' && activity.estimated_cost > 0 
      ? activity.estimated_cost 
      : 0;
    return total + cost;
  }, 0);
}

/**
 * Calculates the total cost for the entire trip deterministically.
 * @param {Array} days - The array of day objects.
 * @returns {number} The calculated total trip cost.
 */
function calculateTripCost(days) {
  if (!Array.isArray(days)) return 0;

  return days.reduce((total, day) => {
    return total + calculateDailyCost(day);
  }, 0);
}

/**
 * Determines the budget status based on the calculated total and requested budget.
 * @param {number} calculatedTotal - The deterministically calculated total.
 * @param {number} requestedBudget - The budget requested by the user.
 * @returns {string} The budget status ('within_budget', 'over_budget', 'budget_unknown').
 */
function calculateBudgetStatus(calculatedTotal, requestedBudget) {
  if (typeof requestedBudget !== 'number' || requestedBudget < 0) {
    return 'budget_unknown';
  }
  if (typeof calculatedTotal !== 'number') {
    return 'budget_unknown';
  }
  
  return calculatedTotal <= requestedBudget ? 'within_budget' : 'over_budget';
}

module.exports = {
  calculateDailyCost,
  calculateTripCost,
  calculateBudgetStatus
};
