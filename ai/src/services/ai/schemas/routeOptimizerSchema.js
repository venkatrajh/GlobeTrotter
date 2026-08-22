const { z } = require('zod');
const { DaySchema } = require('./tripGeneratorSchema');

// Optional travel metadata between specific activities
const TravelMetadataSchema = z.object({
  from_activity_id: z.string(),
  to_activity_id: z.string(),
  estimated_minutes: z.number().min(0),
  distance_km: z.number().min(0).optional()
});

const RouteOptimizerRequestSchema = z.object({
  itinerary: z.object({
    destination: z.string(),
    days: z.array(DaySchema)
  }),
  preferences: z.object({
    must_keep_activity_ids: z.array(z.string()).optional().default([]),
    fixed_time_activity_ids: z.array(z.string()).optional().default([])
  }).optional(),
  travel_metadata: z.array(TravelMetadataSchema).optional().default([])
});

const RouteChangeSchema = z.object({
  day: z.number().int().min(1),
  original_order: z.array(z.string()),
  optimized_order: z.array(z.string()),
  reason: z.string()
});

const RouteOptimizerResponseSchema = z.object({
  status: z.enum(['optimized', 'no_optimization_possible', 'constraint_conflict']),
  changes: z.array(RouteChangeSchema).default([]),
  estimated_travel_minutes_before: z.number().min(0).default(0),
  estimated_travel_minutes_after: z.number().min(0).default(0),
  estimated_savings_minutes: z.number().default(0),
  itinerary: z.object({
    destination: z.string().optional(),
    days: z.array(DaySchema).optional()
  }).optional(),
  warnings: z.array(z.string()).default([])
});

module.exports = {
  RouteOptimizerRequestSchema,
  RouteOptimizerResponseSchema
};
