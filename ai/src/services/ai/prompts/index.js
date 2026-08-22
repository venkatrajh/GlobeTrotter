/**
 * Central export for all AI prompts.
 * Prompts should be versioned, e.g., tripGeneratorPromptV1.
 */

const { buildTripGeneratorPrompt } = require('./tripGeneratorPrompt');
const { buildBudgetOptimizerPrompt } = require('./budgetOptimizerPrompt');

module.exports = {
  buildTripGeneratorPrompt,
  buildBudgetOptimizerPrompt
};
