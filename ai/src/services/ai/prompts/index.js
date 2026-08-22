/**
 * Central export for all AI prompts.
 * Prompts should be versioned, e.g., tripGeneratorPromptV1.
 */

const { buildTripGeneratorPrompt } = require('./tripGeneratorPrompt');

module.exports = {
  buildTripGeneratorPrompt,
  // copilotPromptV1: require('./copilotPrompt'),
};
