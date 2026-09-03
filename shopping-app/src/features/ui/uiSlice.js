import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    screen: 'shopping', // shopping | summary | confirmation
    lastOrder: null,
  },
  reducers: {
    goToScreen: (state, action) => {
      state.screen = action.payload;
    },
    setLastOrder: (state, action) => {
      state.lastOrder = action.payload;
      state.screen = 'confirmation';
    },
    startNewOrder: (state) => {
      state.lastOrder = null;
      state.screen = 'shopping';
    },
  },
});

export const { goToScreen, setLastOrder, startNewOrder } = uiSlice.actions;
export default uiSlice.reducer;

export const selectScreen = (state) => state.ui.screen;
export const selectLastOrder = (state) => state.ui.lastOrder;
