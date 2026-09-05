import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { SCREEN, type LastOrder, type Screen } from '../../types';

interface UiState {
  screen: Screen;
  lastOrder: LastOrder | null;
}

const initialState: UiState = {
  screen: SCREEN.SHOPPING,
  lastOrder: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    goToScreen: (state, action: PayloadAction<Screen>) => {
      state.screen = action.payload;
    },
    setLastOrder: (state, action: PayloadAction<LastOrder>) => {
      state.lastOrder = action.payload;
      state.screen = SCREEN.CONFIRMATION;
    },
    startNewOrder: (state) => {
      state.lastOrder = null;
      state.screen = SCREEN.SHOPPING;
    },
  },
});

export const { goToScreen, setLastOrder, startNewOrder } = uiSlice.actions;
export default uiSlice.reducer;

export const selectScreen = (state: RootState) => state.ui.screen;
export const selectLastOrder = (state: RootState) => state.ui.lastOrder;
