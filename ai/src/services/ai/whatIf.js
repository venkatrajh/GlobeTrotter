const aiClient = require('./aiClient');
const { WhatIfRequestSchema, WhatIfResponseSchema } = require('./schemas');
const { buildWhatIfPrompt } = require('./prompts');
const { calculateWhatIfTotals, cloneItinerary } = require('./utils/whatIfCalculations');

/**
 * Handles What-If Simulator queries.
 * @param {object} request - The what-if request
 * @returns {Promise<object>} The validated what-if JSON response
 */
async function simulateWhatIf(request) {
  // 1. Validate Input
  const parsedRequest = WhatIfRequestSchema.safeParse(request);
  if (!parsedRequest.success) {
    throw new Error(`INVALID_INPUT: ${parsedRequest.error.message}`);
  }
  const validRequest = parsedRequest.data;

  // 2. Build Initial Prompt
  let prompt = buildWhatIfPrompt(validRequest);
  const provider = aiClient.getProvider();

  let rawResponse;
  let parsedOutput;

  // 3. First Attempt
  try {
    rawResponse = await provider.generateStructuredResponse(prompt, null);
    parsedOutput = WhatIfResponseSchema.parse(rawResponse);
  } catch (firstError) {
    console.warn(`[WhatIf] First attempt failed: ${firstError.message}. Initiating retry.`);
    
    const repairContext = firstError.message;
    prompt = buildWhatIfPrompt(validRequest, repairContext);
    
    try {
      rawResponse = await provider.generateStructuredResponse(prompt, null);
      parsedOutput = WhatIfResponseSchema.parse(rawResponse);
    } catch (secondError) {
      console.error(`[WhatIf] Retry failed:`, secondError);
      throw new Error(`AI_RESPONSE_INVALID: ${secondError.message}`);
    }
  }

  // 4. Override with Deterministic Calculations
  const baselineItinerary = cloneItinerary(validRequest.itinerary);
  const simulatedItinerary = parsedOutput.itinerary || { days: [] };
  
  const totals = calculateWhatIfTotals(baselineItinerary, simulatedItinerary);

  return {
    ...parsedOutput,
    original_total: totals.original_total,
    projected_total: totals.projected_total,
    cost_difference: totals.cost_difference
  };
}

module.exports = {
  simulateWhatIf
};
