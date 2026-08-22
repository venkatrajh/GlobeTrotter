const aiClient = require('./aiClient');
const { PackingRequestSchema, PackingResponseSchema } = require('./schemas');
const { buildPackingPrompt } = require('./prompts');

/**
 * Handles Packing Assistant queries.
 * @param {object} request - The packing request
 * @returns {Promise<object>} The validated packing JSON response
 */
async function generatePackingList(request) {
  // 1. Validate Input
  const parsedRequest = PackingRequestSchema.safeParse(request);
  if (!parsedRequest.success) {
    throw new Error(`INVALID_INPUT: ${parsedRequest.error.message}`);
  }
  const validRequest = parsedRequest.data;

  // 2. Build Initial Prompt
  let prompt = buildPackingPrompt(validRequest);
  const provider = aiClient.getProvider();

  let rawResponse;
  let parsedOutput;

  // 3. First Attempt
  try {
    rawResponse = await provider.generateStructuredResponse(prompt, null);
    parsedOutput = PackingResponseSchema.parse(rawResponse);
  } catch (firstError) {
    console.warn(`[PackingAssistant] First attempt failed: ${firstError.message}. Initiating retry.`);
    
    const repairContext = firstError.message;
    prompt = buildPackingPrompt(validRequest, repairContext);
    
    try {
      rawResponse = await provider.generateStructuredResponse(prompt, null);
      parsedOutput = PackingResponseSchema.parse(rawResponse);
    } catch (secondError) {
      console.error(`[PackingAssistant] Retry failed:`, secondError);
      throw new Error(`AI_RESPONSE_INVALID: ${secondError.message}`);
    }
  }

  // 4. Return Output
  return parsedOutput;
}

module.exports = {
  generatePackingList
};
