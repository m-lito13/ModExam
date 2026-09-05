import { CreateOrderInput } from './order.model';

/**
 * Compares order content field-by-field (not id/createdAt) so an
 * idempotency-key match can be told apart from a genuine key collision
 * between two different orders.
 */
export function isSameOrderContent(a: CreateOrderInput, b: CreateOrderInput): boolean {
  if (a.fullName !== b.fullName || a.address !== b.address || a.email !== b.email) {
    return false;
  }
  if (a.products.length !== b.products.length) {
    return false;
  }
  return a.products.every((product, i) => {
    const other = b.products[i];
    return (
      product.category === other.category &&
      product.productName === other.productName &&
      product.quantity === other.quantity
    );
  });
}
