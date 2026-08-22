const { z } = require('zod');

const PackingRequestSchema = z.object({
  destination: z.string(),
  duration_days: z.number().int().min(1),
  activities: z.array(z.string()).optional().default([]),
  travel_style: z.string().optional(),
  weather_context: z.string().optional(),
  special_requirements: z.array(z.string()).optional().default([])
});

const PackingItemSchema = z.object({
  name: z.string(),
  quantity: z.number().int().min(1).default(1),
  reason: z.string().optional()
});

const PackingCategorySchema = z.object({
  name: z.string(),
  items: z.array(PackingItemSchema)
});

const PackingResponseSchema = z.object({
  categories: z.array(PackingCategorySchema),
  essentials: z.array(z.string()).default([]),
  activity_specific: z.array(z.string()).default([]),
  optional_items: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([])
});

module.exports = {
  PackingRequestSchema,
  PackingResponseSchema
};
