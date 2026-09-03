import { configureStore } from '@reduxjs/toolkit';
import catalogReducer from '../features/catalog/catalogSlice';
import cartReducer from '../features/cart/cartSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    cart: cartReducer,
    ui: uiReducer,
  },
});
