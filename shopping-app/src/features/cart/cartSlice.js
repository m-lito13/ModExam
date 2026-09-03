import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    // items keyed by productId for O(1) lookups & easy quantity updates
    items: {},
  },
  reducers: {
    addToCart: (state, action) => {
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
          unit: product.unit,
          quantity,
        };
      }
    },
    removeFromCart: (state, action) => {
      delete state.items[action.payload.productId];
    },
    updateCartQuantity: (state, action) => {
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

export const selectCartItems = (state) => Object.values(state.cart.items);
export const selectCartCount = (state) =>
  Object.values(state.cart.items).reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state) =>
  Object.values(state.cart.items).reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
