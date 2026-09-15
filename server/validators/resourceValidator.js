const { z } = require('zod');

const createResourceSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(1, 'Description cannot be empty')
    .max(1000, 'Description cannot exceed 1000 characters'),
  resourceType: z.enum(['NOTES', 'PYQ', 'ASSIGNMENT', 'BOOK', 'OTHER'], {
    errorMap: () => ({
      message: 'Resource type must be one of NOTES, PYQ, ASSIGNMENT, BOOK, OTHER'
    })
  }),
  subject: z
    .string({ required_error: 'Subject is required' })
    .trim()
    .min(1, 'Subject cannot be empty'),
  semester: z.coerce
    .number({ invalid_type_error: 'Semester must be a valid number' })
    .min(1, 'Semester must be at least 1')
    .max(10, 'Semester cannot exceed 10'),
  course: z
    .string({ required_error: 'Course is required' })
    .trim()
    .min(1, 'Course cannot be empty'),
  university: z.string().trim().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional()
});

module.exports = {
  createResourceSchema
};
