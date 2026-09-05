import { describe, it, expect } from 'vitest';
import { createOrderSchema } from '../../src/validation/order.schema';

function validInput() {
  return {
    fullName: 'Jane Doe',
    address: '123 Main St',
    email: 'jane@example.com',
    products: [{ category: 'books', productName: 'Novel', quantity: 1 }],
  };
}

describe('createOrderSchema', () => {
  it('accepts a valid order', () => {
    const result = createOrderSchema.safeParse(validInput());
    expect(result.success).toBe(true);
  });

  it('trims fullName and address', () => {
    const result = createOrderSchema.safeParse({
      ...validInput(),
      fullName: '  Jane Doe  ',
      address: '  123 Main St  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe('Jane Doe');
      expect(result.data.address).toBe('123 Main St');
    }
  });

  it('rejects a fullName shorter than 2 characters', () => {
    const result = createOrderSchema.safeParse({ ...validInput(), fullName: 'J' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty address', () => {
    const result = createOrderSchema.safeParse({ ...validInput(), address: '' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = createOrderSchema.safeParse({ ...validInput(), email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty products array', () => {
    const result = createOrderSchema.safeParse({ ...validInput(), products: [] });
    expect(result.success).toBe(false);
  });

  it('rejects a product with a non-positive quantity', () => {
    const result = createOrderSchema.safeParse({
      ...validInput(),
      products: [{ category: 'books', productName: 'Novel', quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects a product with a non-integer quantity', () => {
    const result = createOrderSchema.safeParse({
      ...validInput(),
      products: [{ category: 'books', productName: 'Novel', quantity: 1.5 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects a product missing a required field', () => {
    const result = createOrderSchema.safeParse({
      ...validInput(),
      products: [{ category: 'books', quantity: 1 }],
    });
    expect(result.success).toBe(false);
  });
});
