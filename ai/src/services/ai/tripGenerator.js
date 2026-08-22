const aiClient = require('./aiClient');
const { TripGeneratorRequestSchema, TripGeneratorResponseSchema } = require('./schemas');
const { buildTripGeneratorPrompt } = require('./prompts');
const { 
  calculateDailyCost, 
  calculateTripCost, 
  calculateBudgetStatus 
} = require('./utils/tripCalculations');
const { 
  detectScheduleConflicts, 
  detectDuplicateActivities, 
  validateExactDays 
} = require('./utils/itineraryValidation');

/**
 * Normalizes and overrides LLM responses with deterministic logic.
 */
function normalizeAndOverride(parsedOutput, request) {
  // Deterministic daily and total costs
  parsedOutput.days.forEach(day => {
    day.estimated_daily_cost = calculateDailyCost(day);
  });
  
  parsedOutput.estimated_total = calculateTripCost(parsedOutput.days);
  parsedOutput.budget_status = calculateBudgetStatus(parsedOutput.estimated_total, request.budget);

  // Validation checks
  const conflicts = [];
  parsedOutput.days.forEach(day => {
    conflicts.push(...detectScheduleConflicts(day));
  });
  const duplicates = detectDuplicateActivities(parsedOutput.days);

  // Append warnings
  if (!parsedOutput.warnings) parsedOutput.warnings = [];
  parsedOutput.warnings.push(...conflicts, ...duplicates);
  
  if (parsedOutput.budget_status === 'over_budget') {
    parsedOutput.warnings.push(`Itinerary is over the requested budget of ${request.budget} ${request.currency}.`);
  }

  // Ensure arrays exist
  if (!parsedOutput.assumptions) parsedOutput.assumptions = [];

  return parsedOutput;
}

/**
 * Generates an AI Trip based on the request constraints.
 * @param {object} request - The trip requirements (validated via TripGeneratorRequestSchema)
 * @returns {Promise<object>} The validated, normalized itinerary JSON
 */
async function generateTrip(request) {
  // 1. Validate Input
  const parsedRequest = TripGeneratorRequestSchema.safeParse(request);
  if (!parsedRequest.success) {
    throw new Error(`INVALID_INPUT: ${parsedRequest.error.message}`);
  }
  const validRequest = parsedRequest.data;

  // 2. Build Initial Prompt
  let prompt = buildTripGeneratorPrompt(validRequest);
  const provider = aiClient.getProvider();

  let rawResponse;
  let parsedOutput;

  // 3. First Attempt
  try {
    rawResponse = await provider.generateStructuredResponse(prompt, null); // Schema passed as null for now
    
    // Check exact days length (Critical requirement)
    if (!validateExactDays(rawResponse.days, validRequest.days)) {
      throw new Error(`Generated ${rawResponse.days?.length || 0} days instead of exactly ${validRequest.days} days.`);
    }

    // Validate against Output Schema
    parsedOutput = TripGeneratorResponseSchema.parse(rawResponse);
  } catch (firstError) {
    console.warn(`[TripGenerator] First attempt failed: ${firstError.message}. Initiating retry.`);
    
    // 4. Retry Attempt (Once)
    const repairContext = firstError.message;
    prompt = buildTripGeneratorPrompt(validRequest, repairContext);
    
    try {
      rawResponse = await provider.generateStructuredResponse(prompt, null);
      
      if (!validateExactDays(rawResponse.days, validRequest.days)) {
        throw new Error(`Generated ${rawResponse.days?.length || 0} days instead of exactly ${validRequest.days} days on retry.`);
      }
      
      parsedOutput = TripGeneratorResponseSchema.parse(rawResponse);
    } catch (secondError) {
      console.error(`[TripGenerator] Retry failed:`, secondError);
      throw new Error(`AI_GENERATION_FAILED: ${secondError.message}`);
    }
  }

  // 5. Normalization and Deterministic Overrides
  const finalOutput = normalizeAndOverride(parsedOutput, validRequest);

  return finalOutput;
}

module.exports = {
  generateTrip,
  normalizeAndOverride
};
