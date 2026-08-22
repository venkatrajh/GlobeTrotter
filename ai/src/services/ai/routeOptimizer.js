const aiClient = require('./aiClient');
const { RouteOptimizerRequestSchema, RouteOptimizerResponseSchema } = require('./schemas');
const { buildRouteOptimizerPrompt } = require('./prompts');
const { 
  calculateItineraryTravelMinutes, 
  validateActivitiesIntact,
  validateFixedTimes
} = require('./utils/routeCalculations');

/**
 * Validates, calculates, and normalizes the route optimizer output
 */
function normalizeAndOverride(parsedOutput, request) {
  const original = request.itinerary;
  const replanned = parsedOutput.itinerary;
  
  if (!replanned || !replanned.days) {
    return parsedOutput; // e.g. status: no_optimization_possible
  }

  // 1. Validate Day Boundaries and Intact Activities
  for (let i = 0; i < original.days.length; i++) {
    const origDay = original.days[i];
    const optDay = replanned.days.find(d => d.day === origDay.day);
    if (!validateActivitiesIntact(origDay, optDay)) {
      throw new Error(`AI generated invalid activity sets for day ${origDay.day}`);
    }
    
    // 2. Validate Fixed Times
    const fixedTimeIds = request.preferences?.fixed_time_activity_ids || [];
    if (!validateFixedTimes(origDay, optDay, fixedTimeIds)) {
      return {
        status: 'constraint_conflict',
        warnings: ["The route optimizer illegally shifted fixed-time activities."],
        itinerary: original // Fallback to original
      };
    }
  }

  // 3. Travel Time Calculations
  const meta = request.travel_metadata || [];
  const beforeMins = calculateItineraryTravelMinutes(original, meta);
  const afterMins = calculateItineraryTravelMinutes(replanned, meta);
  const savingsMins = Math.max(0, beforeMins - afterMins);

  return {
    ...parsedOutput,
    estimated_travel_minutes_before: beforeMins,
    estimated_travel_minutes_after: afterMins,
    estimated_savings_minutes: savingsMins
  };
}

/**
 * Optimizes an itinerary's route.
 * @param {object} request - The route optimization request
 * @returns {Promise<object>} The validated, normalized optimization JSON
 */
async function optimizeRoute(request) {
  // 1. Validate Input
  const parsedRequest = RouteOptimizerRequestSchema.safeParse(request);
  if (!parsedRequest.success) {
    throw new Error(`INVALID_INPUT: ${parsedRequest.error.message}`);
  }
  const validRequest = parsedRequest.data;

  // 2. Build Initial Prompt
  let prompt = buildRouteOptimizerPrompt(validRequest);
  const provider = aiClient.getProvider();

  let rawResponse;
  let parsedOutput;

  // 3. First Attempt
  try {
    rawResponse = await provider.generateStructuredResponse(prompt, null);
    parsedOutput = RouteOptimizerResponseSchema.parse(rawResponse);
  } catch (firstError) {
    console.warn(`[RouteOptimizer] First attempt failed: ${firstError.message}. Initiating retry.`);
    
    const repairContext = firstError.message;
    prompt = buildRouteOptimizerPrompt(validRequest, repairContext);
    
    try {
      rawResponse = await provider.generateStructuredResponse(prompt, null);
      parsedOutput = RouteOptimizerResponseSchema.parse(rawResponse);
    } catch (secondError) {
      console.error(`[RouteOptimizer] Retry failed:`, secondError);
      throw new Error(`AI_RESPONSE_INVALID: ${secondError.message}`);
    }
  }

  // 4. Normalization and Validation Overrides
  return normalizeAndOverride(parsedOutput, validRequest);
}

module.exports = {
  optimizeRoute,
  normalizeAndOverride
};
