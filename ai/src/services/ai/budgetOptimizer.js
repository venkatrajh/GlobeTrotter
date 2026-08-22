const aiClient = require('./aiClient');
const { BudgetOptimizerRequestSchema, BudgetOptimizerResponseSchema } = require('./schemas');
const { buildBudgetOptimizerPrompt } = require('./prompts');
const { 
  calculateItineraryCost, 
  calculateOverBudget, 
  validateSuggestion, 
  calculateTotalSavings, 
  calculateProjectedCost 
} = require('./utils/budgetCalculations');

/**
 * Normalizes the LLM response using deterministic math.
 */
function normalizeAndOverride(parsedOutput, request) {
  const currentTotal = calculateItineraryCost(request.itinerary);
  const targetBudget = request.budget;
  const overBudgetBy = calculateOverBudget(currentTotal, targetBudget);
  
  const mustKeepIds = request.preferences?.must_keep_activity_ids || [];

  // 1. Validate each suggestion
  const rawSuggestions = parsedOutput.suggestions || [];
  const validSuggestions = [];
  
  for (const sug of rawSuggestions) {
    const validSug = validateSuggestion(sug, request.itinerary, mustKeepIds);
    if (validSug) {
      validSuggestions.push(validSug);
    }
  }

  // 2. Deterministically calculate totals based on VALID suggestions
  const potentialSavings = calculateTotalSavings(validSuggestions);
  const projectedTotal = calculateProjectedCost(currentTotal, potentialSavings);

  // 3. Re-assemble final output
  return {
    ...parsedOutput,
    current_total: currentTotal,
    target_budget: targetBudget,
    over_budget_by: overBudgetBy,
    potential_savings: potentialSavings,
    projected_total: projectedTotal,
    currency: request.currency,
    suggestions: validSuggestions
  };
}

/**
 * Analyzes an itinerary and suggests budget optimizations.
 * @param {object} request - The budget optimization request
 * @returns {Promise<object>} The validated, normalized optimization JSON
 */
async function optimizeBudget(request) {
  // 1. Validate Input
  const parsedRequest = BudgetOptimizerRequestSchema.safeParse(request);
  if (!parsedRequest.success) {
    throw new Error(`INVALID_INPUT: ${parsedRequest.error.message}`);
  }
  const validRequest = parsedRequest.data;

  // 2. Build Initial Prompt
  let prompt = buildBudgetOptimizerPrompt(validRequest);
  const provider = aiClient.getProvider();

  let rawResponse;
  let parsedOutput;

  // 3. First Attempt
  try {
    rawResponse = await provider.generateStructuredResponse(prompt, null);
    parsedOutput = BudgetOptimizerResponseSchema.parse(rawResponse);
  } catch (firstError) {
    console.warn(`[BudgetOptimizer] First attempt failed: ${firstError.message}. Initiating retry.`);
    
    // 4. Retry Attempt (Once)
    const repairContext = firstError.message;
    prompt = buildBudgetOptimizerPrompt(validRequest, repairContext);
    
    try {
      rawResponse = await provider.generateStructuredResponse(prompt, null);
      parsedOutput = BudgetOptimizerResponseSchema.parse(rawResponse);
    } catch (secondError) {
      console.error(`[BudgetOptimizer] Retry failed:`, secondError);
      throw new Error(`AI_RESPONSE_INVALID: ${secondError.message}`);
    }
  }

  // 5. Normalization and Deterministic Overrides
  return normalizeAndOverride(parsedOutput, validRequest);
}

module.exports = {
  optimizeBudget,
  normalizeAndOverride
};
