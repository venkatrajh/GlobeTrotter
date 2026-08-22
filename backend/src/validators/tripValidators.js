const { z } = require('zod');

const dateStringRefinement = (val) => !isNaN(Date.parse(val));

const createTripSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().refine(dateStringRefinement, 'Invalid start date format'),
  endDate: z.string().refine(dateStringRefinement, 'Invalid end date format'),
  destination: z.string().optional(),
}).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

const updateTripSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  startDate: z.string().refine(dateStringRefinement, 'Invalid start date format').optional(),
  endDate: z.string().refine(dateStringRefinement, 'Invalid end date format').optional(),
  destination: z.string().optional(),
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

const createTripStopSchema = z.object({
  cityId: z.string().min(1, 'City ID is required'),
  startDate: z.string().refine(dateStringRefinement, 'Invalid start date format'),
  endDate: z.string().refine(dateStringRefinement, 'Invalid end date format'),
  order: z.number().int().min(0),
}).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

const updateTripStopSchema = z.object({
  startDate: z.string().refine(dateStringRefinement, 'Invalid start date format').optional(),
  endDate: z.string().refine(dateStringRefinement, 'Invalid end date format').optional(),
  order: z.number().int().min(0).optional(),
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

const createStopActivitySchema = z.object({
  activityId: z.string().min(1, 'Activity ID is required'),
  scheduledDate: z.string().refine(dateStringRefinement, 'Invalid date format').optional().nullable(),
  order: z.number().int().min(0),
  notes: z.string().optional().nullable(),
});

const updateStopActivitySchema = z.object({
  scheduledDate: z.string().refine(dateStringRefinement, 'Invalid date format').optional().nullable(),
  order: z.number().int().min(0).optional(),
  notes: z.string().optional().nullable(),
});

module.exports = {
  createTripSchema,
  updateTripSchema,
  createTripStopSchema,
  updateTripStopSchema,
  createStopActivitySchema,
  updateStopActivitySchema,
};
