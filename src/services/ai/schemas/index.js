const { z } = require('zod');

// We will expand these in Phase 2. This just sets up the foundation.

const BaseResponseSchema = z.object({
  status: z.string().optional(),
  message: z.string().optional()
});

const { TripGeneratorRequestSchema, TripGeneratorResponseSchema } = require('./tripGeneratorSchema');

module.exports = {
  BaseResponseSchema,
  TripGeneratorRequestSchema,
  TripGeneratorResponseSchema
};
