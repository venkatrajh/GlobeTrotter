const aiClient = require('./aiClient');
const { CopilotRequestSchema, CopilotResponseSchema } = require('./schemas');
const { buildCopilotPrompt } = require('./prompts');

/**
 * Handles conversational queries as a Travel Copilot.
 * @param {object} request - The copilot request
 * @returns {Promise<object>} The validated copilot JSON response
 */
async function answerCopilotQuery(request) {
  // 1. Validate Input
  const parsedRequest = CopilotRequestSchema.safeParse(request);
  if (!parsedRequest.success) {
    throw new Error(`INVALID_INPUT: ${parsedRequest.error.message}`);
  }
  const validRequest = parsedRequest.data;

  // 2. Build Initial Prompt
  let prompt = buildCopilotPrompt(validRequest);
  const provider = aiClient.getProvider();

  let rawResponse;
  let parsedOutput;

  // 3. First Attempt
  try {
    rawResponse = await provider.generateStructuredResponse(prompt, null);
    parsedOutput = CopilotResponseSchema.parse(rawResponse);
  } catch (firstError) {
    console.warn(`[Copilot] First attempt failed: ${firstError.message}. Initiating retry.`);
    
    const repairContext = firstError.message;
    prompt = buildCopilotPrompt(validRequest, repairContext);
    
    try {
      rawResponse = await provider.generateStructuredResponse(prompt, null);
      parsedOutput = CopilotResponseSchema.parse(rawResponse);
    } catch (secondError) {
      console.error(`[Copilot] Retry failed:`, secondError);
      throw new Error(`AI_RESPONSE_INVALID: ${secondError.message}`);
    }
  }

  // 4. Return Output
  return parsedOutput;
}

module.exports = {
  answerCopilotQuery
};
