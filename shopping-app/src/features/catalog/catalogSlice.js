import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCategories } from '../../api/catalogApi';

export const loadCategories = createAsyncThunk(
  'catalog/loadCategories',
  async () => {
    const categories = await fetchCategories();
    return categories;
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    categories: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
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

export const selectCategories = (state) => state.catalog.categories;
export const selectCatalogStatus = (state) => state.catalog.status;
export const selectCatalogError = (state) => state.catalog.error;
