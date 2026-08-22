const aiClient = require('./aiClient');
const { ReplannerRequestSchema, ReplannerResponseSchema } = require('./schemas');
const { buildReplannerPrompt } = require('./prompts');
const { 
  calculateItineraryCost, 
  calculateCostDifference 
} = require('./utils/replanCalculations');
const { 
  validateMustKeepActivities,
  findPreservedActivities
} = require('./utils/replanValidation');
const { validateExactDays } = require('./utils/itineraryValidation');

/**
 * Validates, calculates, and normalizes the replanner output
 */
function normalizeAndOverride(parsedOutput, request) {
  const original = request.itinerary;
  const replanned = parsedOutput.itinerary;
  
  // 1. Must-Keep Validation
  const mustKeepIds = request.preferences?.must_keep_activity_ids || [];
  if (!validateMustKeepActivities(original, replanned, mustKeepIds)) {
    return {
      status: 'constraint_conflict',
      warnings: ["The affected activity is marked as must-keep and cannot be automatically replaced."]
    };
  }

  // 2. Exact Day Validation
  if (!validateExactDays(replanned.days, original.days.length)) {
    throw new Error(`Generated ${replanned.days?.length || 0} days instead of exactly ${original.days.length} days.`);
  }

  // 3. Cost Calculations
  const originalTotal = calculateItineraryCost(original);
  const replannedTotal = calculateItineraryCost(replanned);
  const costDiff = calculateCostDifference(originalTotal, replannedTotal);

  // 4. Update Tracking
  const preservedIds = findPreservedActivities(original, replanned);

  return {
    ...parsedOutput,
    status: parsedOutput.status || 'replanned',
    original_total: originalTotal,
    replanned_total: replannedTotal,
    cost_difference: costDiff,
    preserved_activity_ids: preservedIds,
    itinerary: replanned
  };
}

/**
 * Replans an itinerary based on a disruption
 * @param {object} request - The replan request
 * @returns {Promise<object>} The validated, normalized replanned JSON
 */
async function replanTrip(request) {
  // 1. Validate Input
  const parsedRequest = ReplannerRequestSchema.safeParse(request);
  if (!parsedRequest.success) {
    throw new Error(`INVALID_INPUT: ${parsedRequest.error.message}`);
  }
  const validRequest = parsedRequest.data;

  // 2. Build Initial Prompt
  let prompt = buildReplannerPrompt(validRequest);
  const provider = aiClient.getProvider();

  let rawResponse;
  let parsedOutput;

  // 3. First Attempt
  try {
    rawResponse = await provider.generateStructuredResponse(prompt, null);
    parsedOutput = ReplannerResponseSchema.parse(rawResponse);
  } catch (firstError) {
    console.warn(`[Auto-Replanner] First attempt failed: ${firstError.message}. Initiating retry.`);
    
    // 4. Retry Attempt (Once)
    const repairContext = firstError.message;
    prompt = buildReplannerPrompt(validRequest, repairContext);
    
    try {
      rawResponse = await provider.generateStructuredResponse(prompt, null);
      parsedOutput = ReplannerResponseSchema.parse(rawResponse);
    } catch (secondError) {
      console.error(`[Auto-Replanner] Retry failed:`, secondError);
      throw new Error(`AI_RESPONSE_INVALID: ${secondError.message}`);
    }
  }

  // 5. Normalization and Validation Overrides
  return normalizeAndOverride(parsedOutput, validRequest);
}

module.exports = {
  replanTrip,
  normalizeAndOverride
};
