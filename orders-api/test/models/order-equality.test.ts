import { describe, it, expect } from 'vitest';
import { isSameOrderContent } from '../../src/models/order-equality';
import { CreateOrderInput } from '../../src/models/order.model';

function baseInput(): CreateOrderInput {
  return {
    fullName: 'Jane Doe',
    address: '123 Main St',
    email: 'jane@example.com',
    products: [{ category: 'books', productName: 'Novel', quantity: 2 }],
  };
}

describe('isSameOrderContent', () => {
  it('returns true for identical content', () => {
    expect(isSameOrderContent(baseInput(), baseInput())).toBe(true);
  });

  it('returns false when fullName differs', () => {
    const other = { ...baseInput(), fullName: 'John Smith' };
    expect(isSameOrderContent(baseInput(), other)).toBe(false);
  });

  it('returns false when address differs', () => {
    const other = { ...baseInput(), address: '456 Other St' };
    expect(isSameOrderContent(baseInput(), other)).toBe(false);
  });

  it('returns false when email differs', () => {
    const other = { ...baseInput(), email: 'other@example.com' };
    expect(isSameOrderContent(baseInput(), other)).toBe(false);
  });

  it('returns false when products length differs', () => {
    const other = {
      ...baseInput(),
      products: [...baseInput().products, { category: 'toys', productName: 'Robot', quantity: 1 }],
    };
    expect(isSameOrderContent(baseInput(), other)).toBe(false);
  });

  it('returns false when a product field differs', () => {
    const other = {
      ...baseInput(),
      products: [{ category: 'books', productName: 'Novel', quantity: 3 }],
    };
    expect(isSameOrderContent(baseInput(), other)).toBe(false);
  });
});
