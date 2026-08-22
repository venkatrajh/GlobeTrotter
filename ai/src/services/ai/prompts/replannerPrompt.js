/**
 * System prompt for the Auto-Replanner.
 * Version: auto-replanner-v1
 */

function buildReplannerPrompt(input, repairContext = null) {
  const {
    itinerary,
    disruption,
    preferences,
    budget,
    currency
  } = input;

  const mustKeep = preferences?.must_keep_activity_ids || [];
  
  let prompt = `
ROLE:
You are an intelligent Auto-Replanner for a travel application. Your job is to adapt an existing itinerary to handle a specific disruption.

INPUT CONTEXT:
Disruption Type: ${disruption.type}
Disruption Description: ${disruption.description}
Affected Activity ID (if applicable): ${disruption.affected_activity_id || 'None'}
Affected Day (if applicable): ${disruption.affected_day || 'None'}

Budget constraint: ${budget ? `${budget} ${currency}` : 'None'}
Travel Style: ${preferences?.travel_style || 'Not specified'}
Constraints: ${preferences?.constraints?.length > 0 ? preferences.constraints.join(', ') : 'None'}
Must-Keep Activity IDs (DO NOT REMOVE OR REPLACE THESE): ${mustKeep.length > 0 ? mustKeep.join(', ') : 'None'}

EXISTING ITINERARY:
${JSON.stringify(itinerary, null, 2)}

OBJECTIVE:
Analyze the disruption and output a completely revised JSON itinerary. 

CONSTRAINTS & RULES (MINIMAL CHANGE PRINCIPLE):
1. PRESERVE UNAFFECTED ACTIVITIES. Do not regenerate the entire itinerary unless the disruption makes the existing plan infeasible. Preserve as many original activities with their original times as possible.
2. MUST-KEEP PROTECTION: You MUST NOT remove or replace any activity whose ID is in the Must-Keep list. If the disruption directly affects a must-keep activity and replacing it is impossible without breaking this rule, you must find a way to shift it.
3. SCHEDULE RULES: Ensure durations are reasonable (15-720 mins) and activities on the same day do not have overlapping times.
4. BUDGET RULES: If a budget is provided, avoid unnecessarily increasing the total cost of the itinerary.
5. Provide a summary of exactly what changed and why, alongside an array of the specific changes.

OUTPUT FORMAT:
Return strict JSON adhering to the following structure:
{
  "summary": "String explaining how the itinerary was adapted.",
  "changes": [
    {
      "type": "replacement" | "removal" | "addition" | "reschedule",
      "day": number,
      "original_activity_id": "string (if applicable)",
      "original_activity_name": "string (if applicable)",
      "replacement_activity": {
        "id": "new-unique-id",
        "name": "string",
        "category": "string",
        "suggested_time": "HH:MM",
        "duration_minutes": number,
        "estimated_cost": number
      },
      "reason": "String explaining this specific change.",
      "tradeoffs": ["string"]
    }
  ],
  "warnings": ["string"],
  "assumptions": ["string"],
  "itinerary": {
    "destination": "Same destination string",
    "days": [
      // The fully revised days array matching the DaySchema format
    ]
  }
}
`;

  if (repairContext) {
    prompt += `\n\nCRITICAL FIX REQUIRED:\nThe previous attempt failed validation. Please fix the following errors and return the corrected JSON: ${repairContext}`;
  }

  return prompt;
}

module.exports = {
  buildReplannerPrompt
};
