const { z } = require('zod');

const registerSchema = z.object({
  name: z.string({ required_error: 'Name is required' })
    .trim()
    .min(1, 'Name cannot be empty')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z.string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address'),
  password: z.string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
  college: z.string().trim().optional(),
  course: z.string().trim().optional(),
  semester: z.number().min(1).max(10).optional().nullable()
});

const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address'),
  password: z.string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
});

module.exports = {
  registerSchema,
  loginSchema
};
