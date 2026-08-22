const { z } = require('zod');

// Input Schema
const TripGeneratorRequestSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  days: z.number().int().min(1).max(30),
  budget: z.number().min(0),
  currency: z.string().length(3).toUpperCase(),
  travel_style: z.string().optional(),
  interests: z.array(z.string()).optional().default([]),
  activity_preferences: z.array(z.string()).optional().default([]),
  pace: z.enum(['relaxed', 'balanced', 'packed']).optional().default('balanced'),
  constraints: z.array(z.string()).optional().default([])
});

// Output Schema structure for Activities
const ActivitySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  category: z.string(),
  description: z.string().optional(),
  suggested_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format, must be HH:MM'),
  duration_minutes: z.number().positive().min(15).max(720), // Max 12 hours
  estimated_cost: z.number().min(0),
  location: z.string().optional(),
  reason: z.string().optional()
});

// Output Schema structure for Days
const DaySchema = z.object({
  day: z.number().int().min(1),
  city: z.string(),
  date: z.string().optional(),
  activities: z.array(ActivitySchema).default([]),
  estimated_daily_cost: z.number().min(0).default(0),
  daily_summary: z.string().optional()
});

// Full Output Schema
const TripGeneratorResponseSchema = z.object({
  trip_summary: z.string(),
  destination: z.string(),
  days: z.array(DaySchema),
  estimated_total: z.number().min(0).default(0),
  currency: z.string().length(3).toUpperCase(),
  budget_status: z.enum(['within_budget', 'over_budget', 'budget_unknown']).default('budget_unknown'),
  warnings: z.array(z.string()).default([]),
  assumptions: z.array(z.string()).default([])
});

module.exports = {
  TripGeneratorRequestSchema,
  TripGeneratorResponseSchema,
  ActivitySchema,
  DaySchema
};
