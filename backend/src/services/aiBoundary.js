const { generateTrip } = require('../../../ai/src/services/ai/tripGenerator');
const { optimizeBudget } = require('../../../ai/src/services/ai/budgetOptimizer');
const schemas = require('../../../ai/src/services/ai/schemas');

module.exports = {
  generateTrip,
  optimizeBudget,
  schemas
};
