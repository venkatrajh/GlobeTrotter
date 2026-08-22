const { z } = require('zod');
const { DaySchema } = require('./tripGeneratorSchema');

// Input Schema
const DisruptionSchema = z.object({
  type: z.enum([
    'activity_unavailable',
    'delay',
    'cancellation',
    'user_change',
    'late_arrival',
    'time_constraint',
    'weather_issue',
    'custom'
  ]),
  description: z.string(),
  affected_activity_id: z.string().optional(),
  affected_day: z.number().int().min(1).optional(),
  available_from: z.string().optional(),
  available_until: z.string().optional(),
  delay_minutes: z.number().int().min(1).optional(),
  arrival_time: z.string().optional()
});

const ReplannerRequestSchema = z.object({
  itinerary: z.object({
    destination: z.string(),
    days: z.array(DaySchema) // Reusing DaySchema
  }),
  disruption: DisruptionSchema,
  preferences: z.object({
    travel_style: z.string().optional(),
    interests: z.array(z.string()).optional(),
    constraints: z.array(z.string()).optional(),
    must_keep_activity_ids: z.array(z.string()).optional().default([])
  }).optional(),
  budget: z.number().min(0).optional(),
  currency: z.string().length(3).toUpperCase().optional()
});

// Output Schema structures
const ChangeSchema = z.object({
  type: z.enum(['replacement', 'removal', 'addition', 'reschedule']),
  day: z.number().int().min(1),
  original_activity_id: z.string().optional(),
  original_activity_name: z.string().optional(),
  replacement_activity: z.any().optional(), // In the actual response, this is an activity, but allowing flexible Zod checks for now
  reason: z.string(),
  tradeoffs: z.array(z.string()).default([])
});

const ReplannerResponseSchema = z.object({
  status: z.enum(['replanned', 'constraint_conflict', 'infeasible']),
  summary: z.string().optional(),
  original_total: z.number().min(0).default(0),
  replanned_total: z.number().min(0).default(0),
  cost_difference: z.number().default(0),
  changes: z.array(ChangeSchema).default([]),
  preserved_activity_ids: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  assumptions: z.array(z.string()).default([]),
  itinerary: z.object({
    destination: z.string().optional(),
    days: z.array(DaySchema).optional()
  }).optional()
});

module.exports = {
  ReplannerRequestSchema,
  ReplannerResponseSchema
};
