const { z } = require('zod');

// We will expand these in Phase 2. This just sets up the foundation.

const BaseResponseSchema = z.object({
  status: z.string().optional(),
  message: z.string().optional()
});

const { TripGeneratorRequestSchema, TripGeneratorResponseSchema } = require('./tripGeneratorSchema');
const { BudgetOptimizerRequestSchema, BudgetOptimizerResponseSchema } = require('./budgetOptimizerSchema');
const { ReplannerRequestSchema, ReplannerResponseSchema } = require('./replannerSchema');
const { RouteOptimizerRequestSchema, RouteOptimizerResponseSchema } = require('./routeOptimizerSchema');
const { CopilotRequestSchema, CopilotResponseSchema } = require('./copilotSchema');
const { WhatIfRequestSchema, WhatIfResponseSchema } = require('./whatIfSchema');
const { PackingRequestSchema, PackingResponseSchema } = require('./packingSchema');
const { GroupPreferencesRequestSchema, GroupPreferencesResponseSchema } = require('./groupPreferencesSchema');

module.exports = {
  BaseResponseSchema,
  TripGeneratorRequestSchema,
  TripGeneratorResponseSchema,
  BudgetOptimizerRequestSchema,
  BudgetOptimizerResponseSchema,
  ReplannerRequestSchema,
  ReplannerResponseSchema,
  RouteOptimizerRequestSchema,
  RouteOptimizerResponseSchema,
  CopilotRequestSchema,
  CopilotResponseSchema,
  WhatIfRequestSchema,
  WhatIfResponseSchema,
  PackingRequestSchema,
  PackingResponseSchema,
  GroupPreferencesRequestSchema,
  GroupPreferencesResponseSchema
};
