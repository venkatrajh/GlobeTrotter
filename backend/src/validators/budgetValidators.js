const { z } = require('zod');

const allowedCategories = ['transport', 'stay', 'activity', 'meal', 'other'];

const createBudgetItemSchema = z.object({
  amount: z.number()
    .min(0, 'Amount must be greater than or equal to zero')
    .max(999999999, 'Amount too large'),
  category: z.string().refine(val => allowedCategories.includes(val.toLowerCase()), {
    message: 'Invalid category. Allowed: transport, stay, activity, meal, other',
  }).transform(val => val.toLowerCase()),
  description: z.string().optional().nullable(),
});

const updateBudgetItemSchema = z.object({
  amount: z.number()
    .min(0, 'Amount must be greater than or equal to zero')
    .max(999999999, 'Amount too large')
    .optional(),
  category: z.string().refine(val => allowedCategories.includes(val.toLowerCase()), {
    message: 'Invalid category. Allowed: transport, stay, activity, meal, other',
  }).transform(val => val.toLowerCase()).optional(),
  description: z.string().optional().nullable(),
});

module.exports = {
  createBudgetItemSchema,
  updateBudgetItemSchema,
};
