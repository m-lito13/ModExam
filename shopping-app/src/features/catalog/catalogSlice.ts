import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCategories } from '../../api/catalogApi';
import type { RootState } from '../../app/store';
import type { Category } from '../../types';

type CatalogStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface CatalogState {
  categories: Category[];
  status: CatalogStatus;
  error: string | null;
}

export const loadCategories = createAsyncThunk('catalog/loadCategories', async () => {
  const categories = await fetchCategories();
  return categories;
});

const initialState: CatalogState = {
  categories: [],
  status: 'idle',
  error: null,
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'שגיאה בטעינת הקטגוריות';
      });
  },
});

export default catalogSlice.reducer;

export const selectCategories = (state: RootState) => state.catalog.categories;
export const selectCatalogStatus = (state: RootState) => state.catalog.status;
export const selectCatalogError = (state: RootState) => state.catalog.error;
