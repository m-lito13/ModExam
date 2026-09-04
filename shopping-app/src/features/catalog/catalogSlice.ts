import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCategories, fetchProductsPage } from '../../api/catalogApi';
import type { RootState } from '../../app/store';
import type { Category, Product } from '../../types';
import { t } from '../../i18n/t';

type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface ProductsPageState {
  items: Product[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  status: LoadStatus;
  error: string | null;
}

interface CatalogState {
  categories: Category[];
  categoriesStatus: LoadStatus;
  categoriesError: string | null;
  // Keyed by `${categoryId}:${pageNumber}` so pages already fetched for a
  // category are cached and re-visiting them doesn't hit the API again.
  productPages: Record<string, ProductsPageState>;
}

const pageKey = (categoryId: number, pageNumber: number) => `${categoryId}:${pageNumber}`;

export const loadCategories = createAsyncThunk('catalog/loadCategories', async () => {
  return fetchCategories();
});

export const loadProductsPage = createAsyncThunk(
  'catalog/loadProductsPage',
  async ({ categoryId, pageNumber }: { categoryId: number; pageNumber: number }) => {
    const page = await fetchProductsPage(categoryId, pageNumber);
    return { categoryId, pageNumber, page };
  },
  {
    condition: ({ categoryId, pageNumber }, { getState }) => {
      const existing = (getState() as RootState).catalog.productPages[pageKey(categoryId, pageNumber)];
      // Already cached or already in flight - skip the request.
      return !existing || (existing.status !== 'succeeded' && existing.status !== 'loading');
    },
  }
);

const initialState: CatalogState = {
  categories: [],
  categoriesStatus: 'idle',
  categoriesError: null,
  productPages: {},
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.categoriesStatus = 'loading';
        state.categoriesError = null;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.categoriesError = action.error.message ?? t('errors.loadCategories');
      })
      .addCase(loadProductsPage.pending, (state, action) => {
        const key = pageKey(action.meta.arg.categoryId, action.meta.arg.pageNumber);
        const existing = state.productPages[key];
        state.productPages[key] = {
          items: existing?.items ?? [],
          pageNumber: action.meta.arg.pageNumber,
          totalPages: existing?.totalPages ?? 1,
          totalCount: existing?.totalCount ?? 0,
          status: 'loading',
          error: null,
        };
      })
      .addCase(loadProductsPage.fulfilled, (state, action) => {
        const { categoryId, pageNumber, page } = action.payload;
        state.productPages[pageKey(categoryId, pageNumber)] = {
          items: page.items,
          pageNumber,
          totalPages: page.totalPages,
          totalCount: page.totalCount,
          status: 'succeeded',
          error: null,
        };
      })
      .addCase(loadProductsPage.rejected, (state, action) => {
        const key = pageKey(action.meta.arg.categoryId, action.meta.arg.pageNumber);
        state.productPages[key] = {
          items: [],
          pageNumber: action.meta.arg.pageNumber,
          totalPages: 1,
          totalCount: 0,
          status: 'failed',
          error: action.error.message ?? t('errors.loadData', { status: '' }),
        };
      });
  },
});

export default catalogSlice.reducer;

export const selectCategories = (state: RootState) => state.catalog.categories;
export const selectCategoriesStatus = (state: RootState) => state.catalog.categoriesStatus;
export const selectCategoriesError = (state: RootState) => state.catalog.categoriesError;

export const selectProductsPage =
  (categoryId: number, pageNumber: number) =>
  (state: RootState): ProductsPageState | undefined =>
    state.catalog.productPages[pageKey(categoryId, pageNumber)];
