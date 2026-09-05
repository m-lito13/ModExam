import { z } from 'zod';

export const orderProductSchema = z.object({
  category: z.string().min(1, 'category is required'),
  productName: z.string().min(1, 'productName is required'),
  quantity: z.number().int().positive('quantity must be a positive integer'),
});

export const createOrderSchema = z.object({
  // "שם פרטי ומשפחה" - first + last name, required
  fullName: z.string().trim().min(2, 'fullName is required'),
  // "כתובת מלאה" - full address, required
  address: z.string().trim().min(1, 'address is required'),
  // "מייל" - email, required
  email: z.string().trim().email('email must be a valid email address'),
  // products chosen on screen 1, must not be empty
  products: z.array(orderProductSchema).min(1, 'products array must not be empty'),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
