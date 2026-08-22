const { z } = require('zod');
const { DaySchema } = require('./tripGeneratorSchema');

const MemberPreferenceSchema = z.object({
  id: z.string(),
  preferences: z.object({
    interests: z.array(z.string()).optional().default([]),
    pace: z.enum(['relaxed', 'balanced', 'fast']).optional().default('balanced'),
    budget: z.number().min(0).optional()
  })
});

const GroupPreferencesRequestSchema = z.object({
  members: z.array(MemberPreferenceSchema).min(2),
  itinerary: z.object({
    destination: z.string(),
    days: z.array(DaySchema).optional()
  }).optional() // Itinerary is optional (can be used before generating a trip)
});

const GroupPreferencesResponseSchema = z.object({
  consensus: z.object({
    interests: z.array(z.string()),
    pace: z.enum(['relaxed', 'balanced', 'fast']),
    budget: z.number().min(0)
  }),
  member_satisfaction: z.array(
    z.object({
      member_id: z.string(),
      satisfaction_level: z.enum(['high', 'medium', 'low']),
      compromises: z.array(z.string())
    })
  ),
  conflicts: z.array(
    z.object({
      topic: z.enum(['budget', 'pace', 'interests']),
      description: z.string(),
      resolution: z.string()
    })
  ),
  recommendations: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  itinerary: z.object({
    destination: z.string().optional(),
    days: z.array(DaySchema).optional()
  }).optional()
});

module.exports = {
  GroupPreferencesRequestSchema,
  GroupPreferencesResponseSchema
};
