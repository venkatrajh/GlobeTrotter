const { z } = require('zod');
const { DaySchema } = require('./tripGeneratorSchema');

// Input Schema
const BudgetOptimizerRequestSchema = z.object({
  budget: z.number().min(0),
  currency: z.string().length(3).toUpperCase(),
  itinerary: z.object({
    destination: z.string(),
    days: z.array(DaySchema) // Reusing the DaySchema from Trip Generator for consistency
  }),
  preferences: z.object({
    travel_style: z.string().optional(),
    interests: z.array(z.string()).optional(),
    constraints: z.array(z.string()).optional(),
    must_keep_activity_ids: z.array(z.string()).optional().default([])
  }).optional()
});

// Output Schema structures
const SuggestedReplacementSchema = z.object({
  name: z.string(),
  category: z.string(),
  estimated_cost: z.number().min(0)
});

const SuggestionSchema = z.object({
  id: z.string(),
  type: z.enum([
    'activity_swap', 
    'meal_swap', 
    'transport_change', 
    'remove_optional_activity', 
    'lower_cost_alternative', 
    'schedule_based_saving'
  ]),
  priority: z.enum(['high', 'medium', 'low']),
  reason: z.string(),
  current_activity_id: z.string().optional(), // Optional since a transport change might not tie to a single activity ID
  current_activity_name: z.string().optional(),
  suggested_replacement: SuggestedReplacementSchema.optional(), // Omitted if type is remove_optional_activity
  current_cost: z.number().min(0),
  replacement_cost: z.number().min(0),
  estimated_savings: z.number().min(0),
  tradeoffs: z.array(z.string())
});

const BudgetOptimizerResponseSchema = z.object({
  summary: z.string(),
  current_total: z.number().min(0).default(0),
  target_budget: z.number().min(0),
  over_budget_by: z.number().min(0).default(0),
  potential_savings: z.number().min(0).default(0),
  projected_total: z.number().min(0).default(0),
  currency: z.string().length(3).toUpperCase(),
  suggestions: z.array(SuggestionSchema).default([]),
  warnings: z.array(z.string()).default([]),
  assumptions: z.array(z.string()).default([])
});

module.exports = {
  BudgetOptimizerRequestSchema,
  BudgetOptimizerResponseSchema,
  SuggestionSchema
};
