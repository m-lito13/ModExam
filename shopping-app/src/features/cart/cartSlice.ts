import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { CartItem, Product } from '../../types';

interface CartState {
  // items keyed by productId for O(1) lookups & easy quantity updates
  items: Record<number, CartItem>;
}

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; categoryId: number | null; quantity: number }>
    ) => {
      const { product, categoryId, quantity } = action.payload;
      const existing = state.items[product.id];
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items[product.id] = {
          productId: product.id,
          categoryId,
          name: product.name,
          price: product.price,
          quantity,
          stockQuantity: product.stockQuantity,
        };
      }
    },
    removeFromCart: (state, action: PayloadAction<{ productId: number }>) => {
      delete state.items[action.payload.productId];
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      if (state.items[productId]) {
        if (quantity <= 0) {
          delete state.items[productId];
        } else {
          state.items[productId].quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state: RootState) => Object.values(state.cart.items);
export const selectCartCount = (state: RootState) =>
  Object.values(state.cart.items).reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: RootState) =>
  Object.values(state.cart.items).reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
export const selectCartHasStockIssues = (state: RootState) =>
  Object.values(state.cart.items).some((item) => item.quantity > item.stockQuantity);
