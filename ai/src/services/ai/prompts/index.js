/**
 * Central export for all AI prompts.
 * Prompts should be versioned, e.g., tripGeneratorPromptV1.
 */

const { buildTripGeneratorPrompt } = require('./tripGeneratorPrompt');
const { buildBudgetOptimizerPrompt } = require('./budgetOptimizerPrompt');
const { buildReplannerPrompt } = require('./replannerPrompt');
const { buildRouteOptimizerPrompt } = require('./routeOptimizerPrompt');
const { buildCopilotPrompt } = require('./copilotPrompt');
const { buildWhatIfPrompt } = require('./whatIfPrompt');
const { buildPackingPrompt } = require('./packingPrompt');
const { buildGroupPreferencesPrompt } = require('./groupPreferencesPrompt');

module.exports = {
  buildTripGeneratorPrompt,
  buildBudgetOptimizerPrompt,
  buildReplannerPrompt,
  buildRouteOptimizerPrompt,
  buildCopilotPrompt,
  buildWhatIfPrompt,
  buildPackingPrompt,
  buildGroupPreferencesPrompt
};
