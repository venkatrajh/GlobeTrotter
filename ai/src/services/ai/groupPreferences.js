const aiClient = require('./aiClient');
const { GroupPreferencesRequestSchema, GroupPreferencesResponseSchema } = require('./schemas');
const { buildGroupPreferencesPrompt } = require('./prompts');

/**
 * Validates and overrides the AI's consensus budget to ensure it does not exceed the group's minimum limit.
 */
function enforceBudgetLimits(parsedOutput, members) {
  const budgets = members
    .map(m => m.preferences?.budget)
    .filter(b => typeof b === 'number' && b > 0);
    
  if (budgets.length > 0) {
    const minBudget = Math.min(...budgets);
    if (parsedOutput.consensus.budget > minBudget) {
      console.warn(`[GroupPreferences] AI hallucinated a budget (${parsedOutput.consensus.budget}) higher than the group minimum (${minBudget}). Overriding.`);
      parsedOutput.consensus.budget = minBudget;
    }
  }
  return parsedOutput;
}

/**
 * Handles Group Preference queries.
 * @param {object} request - The group preferences request
 * @returns {Promise<object>} The validated group preferences JSON response
 */
async function resolveGroupPreferences(request) {
  // 1. Validate Input
  const parsedRequest = GroupPreferencesRequestSchema.safeParse(request);
  if (!parsedRequest.success) {
    throw new Error(`INVALID_INPUT: ${parsedRequest.error.message}`);
  }
  const validRequest = parsedRequest.data;

  // 2. Build Initial Prompt
  let prompt = buildGroupPreferencesPrompt(validRequest);
  const provider = aiClient.getProvider();

  let rawResponse;
  let parsedOutput;

  // 3. First Attempt
  try {
    rawResponse = await provider.generateStructuredResponse(prompt, null);
    parsedOutput = GroupPreferencesResponseSchema.parse(rawResponse);
  } catch (firstError) {
    console.warn(`[GroupPreferences] First attempt failed: ${firstError.message}. Initiating retry.`);
    
    const repairContext = firstError.message;
    prompt = buildGroupPreferencesPrompt(validRequest, repairContext);
    
    try {
      rawResponse = await provider.generateStructuredResponse(prompt, null);
      parsedOutput = GroupPreferencesResponseSchema.parse(rawResponse);
    } catch (secondError) {
      console.error(`[GroupPreferences] Retry failed:`, secondError);
      throw new Error(`AI_RESPONSE_INVALID: ${secondError.message}`);
    }
  }

  // 4. Overrides and Logic Enforcement
  parsedOutput = enforceBudgetLimits(parsedOutput, validRequest.members);

  return parsedOutput;
}

module.exports = {
  resolveGroupPreferences,
  enforceBudgetLimits
};
