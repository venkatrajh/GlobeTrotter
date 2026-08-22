const { z } = require('zod');
const { DaySchema, ActivitySchema } = require('./tripGeneratorSchema');

const CopilotRequestSchema = z.object({
  message: z.string().min(1),
  itinerary: z.object({
    destination: z.string().optional(),
    days: z.array(DaySchema).optional()
  }).optional(),
  preferences: z.object({
    travel_style: z.string().optional(),
    interests: z.array(z.string()).optional()
  }).optional(),
  budget: z.number().min(0).optional(),
  currency: z.string().length(3).toUpperCase().optional(),
  conversation_history: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string()
    })
  ).optional().default([])
});

const CopilotActionSchema = z.object({
  type: z.enum(['suggest_replan', 'suggest_budget_optimization', 'suggest_route_optimization']),
  reason: z.string()
});

const CopilotResponseSchema = z.object({
  message: z.string(),
  intent: z.enum([
    'activity_recommendation',
    'itinerary_question',
    'budget_question',
    'replanning_request',
    'route_question',
    'packing_question',
    'destination_question',
    'general_travel',
    'unknown'
  ]),
  suggestions: z.array(ActivitySchema).optional().default([]),
  related_activity_ids: z.array(z.string()).optional().default([]),
  actions: z.array(CopilotActionSchema).optional().default([]),
  warnings: z.array(z.string()).default([])
});

module.exports = {
  CopilotRequestSchema,
  CopilotResponseSchema
};
