const { z } = require('zod');
const { DaySchema, ActivitySchema } = require('./tripGeneratorSchema');

const WhatIfRequestSchema = z.object({
  scenario: z.enum([
    'budget_change',
    'add_day',
    'remove_day',
    'add_activity',
    'remove_activity',
    'change_pace',
    'change_style',
    'destination_change',
    'custom'
  ]),
  description: z.string(),
  itinerary: z.object({
    destination: z.string(),
    days: z.array(DaySchema)
  }),
  budget: z.number().min(0).optional(),
  currency: z.string().length(3).toUpperCase().optional()
});

const WhatIfChangeSchema = z.object({
  type: z.enum(['replacement', 'removal', 'addition', 'reschedule']),
  day: z.number().int().min(1),
  original_activity_id: z.string().optional(),
  original_activity_name: z.string().optional(),
  replacement_activity: z.any().optional(), // Can hold a partial or full activity structure
  reason: z.string()
});

const WhatIfResponseSchema = z.object({
  scenario: z.string(),
  summary: z.string(),
  original_total: z.number().min(0).default(0),
  projected_total: z.number().min(0).default(0),
  cost_difference: z.number().default(0),
  changes: z.array(WhatIfChangeSchema).default([]),
  warnings: z.array(z.string()).default([]),
  itinerary: z.object({
    destination: z.string().optional(),
    days: z.array(DaySchema).optional()
  }).optional()
});

module.exports = {
  WhatIfRequestSchema,
  WhatIfResponseSchema
};
