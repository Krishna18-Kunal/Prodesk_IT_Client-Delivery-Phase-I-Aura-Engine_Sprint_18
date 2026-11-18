import { z } from 'zod';

const productShape = {
  productName: z.string().trim().min(2).max(180),
  sku: z.string().trim().min(2).max(60).regex(/^[a-zA-Z0-9_-]+$/),
  category: z.string().trim().min(2).max(80),
  price: z.coerce.number().finite().min(0),
  cost: z.coerce.number().finite().min(0),
  stockQuantity: z.coerce.number().int().min(0),
  reorderLevel: z.coerce.number().int().min(0),
};

const createSchema = z.object(productShape).strict().superRefine((data, ctx) => {
  if (data.price < data.cost) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['price'],
      message: 'Price cannot be lower than cost.',
    });
  }
});

const updateSchema = z.object({
  ...Object.fromEntries(Object.entries(productShape).map(([key, value]) => [key, value.optional()])),
}).strict().superRefine((data, ctx) => {
  if (data.price !== undefined && data.cost !== undefined && data.price < data.cost) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['price'],
      message: 'Price cannot be lower than cost.',
    });
  }
});

export function validateProduct(mode = 'create') {
  return (req, res, next) => {
    const schema = mode === 'update' ? updateSchema : createSchema;
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    req.validatedBody = result.data;
    next();
  };
}
