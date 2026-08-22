const { z } = require('zod');

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issue = (error.issues && error.issues[0]) || (error.errors && error.errors[0]);
      return res.status(400).json({
        success: false,
        message: issue ? issue.message : 'Validation error',
      });
    }
    next(error);
  }
};

module.exports = {
  signupSchema,
  loginSchema,
  validateRequest,
};
