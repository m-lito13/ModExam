import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loadCategories,
  loadProductsPage,
  selectCategoriesError,
  selectCategoriesStatus,
  selectCategories,
  selectProductsPage,
} from '../features/catalog/catalogSlice';
import { addToCart } from '../features/cart/cartSlice';
import { goToScreen } from '../features/ui/uiSlice';
import CategorySelector from './CategorySelector';
import ProductList from './ProductList';
import CartSummary from './CartSummary';
import { SCREEN, type Product } from '../types';
import { t } from '../i18n/t';

export default function ShoppingScreen() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const categoriesStatus = useAppSelector(selectCategoriesStatus);
  const categoriesError = useAppSelector(selectCategoriesError);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(loadCategories());
    }
  }, [categoriesStatus, dispatch]);

  useEffect(() => {
    if (categoriesStatus === 'succeeded' && categories.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categoriesStatus, categories, selectedCategoryId]);

  useEffect(() => {
    if (selectedCategoryId !== null) {
      dispatch(loadProductsPage({ categoryId: selectedCategoryId, pageNumber: page }));
    }
  }, [dispatch, selectedCategoryId, page]);

  const productsPage = useAppSelector(selectProductsPage(selectedCategoryId ?? -1, page));

  const handleSelectCategory = (id: number) => {
    setSelectedCategoryId(id);
    setPage(1);
  };

  const handleAdd = (product: Product, quantity: number) => {
    dispatch(addToCart({ product, categoryId: selectedCategoryId, quantity }));
  };

  return (
    <div className="screen screen--shopping">
      <section className="catalog-panel">
        <h1 className="screen-title">{t('shopping.title')}</h1>
        <p className="screen-subtitle">{t('shopping.subtitle')}</p>

        {categoriesStatus === 'loading' && <p className="empty-hint">{t('shopping.loading')}</p>}
        {categoriesStatus === 'failed' && <p className="error-text">{categoriesError}</p>}

        {categoriesStatus === 'succeeded' && (
          <>
            <CategorySelector
              categories={categories}
              selectedId={selectedCategoryId}
              onSelect={handleSelectCategory}
            />
            <ProductList
              products={productsPage?.items}
              status={productsPage?.status ?? 'loading'}
              error={productsPage?.error ?? null}
              page={page}
              totalPages={productsPage?.totalPages ?? 1}
              onPageChange={setPage}
              onAdd={handleAdd}
            />
          </>
        )}
      </section>

      <CartSummary onCheckout={() => dispatch(goToScreen(SCREEN.SUMMARY))} />
    </div>
  );
}
