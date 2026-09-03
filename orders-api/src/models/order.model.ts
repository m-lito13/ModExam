/**
 * A single product line, as selected on screen 1 (shopping list)
 * and carried over to screen 2 (order summary).
 */
export interface OrderProduct {
  category: string;
  productName: string;
  quantity: number;
}

/**
 * The three mandatory fields collected on screen 2, plus the
 * products array that was accumulated on screen 1.
 */
export interface CreateOrderInput {
  fullName: string;
  address: string;
  email: string;
  products: OrderProduct[];
}

export interface Order extends CreateOrderInput {
  id: string;
  createdAt: string;
}
