import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadCategories,
  selectCatalogError,
  selectCatalogStatus,
  selectCategories,
} from '../features/catalog/catalogSlice';
import { addToCart } from '../features/cart/cartSlice';
import { goToScreen } from '../features/ui/uiSlice';
import CategorySelector from './CategorySelector';
import ProductList from './ProductList';
import CartSummary from './CartSummary';

export default function ShoppingScreen() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const status = useSelector(selectCatalogStatus);
  const error = useSelector(selectCatalogError);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadCategories());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === 'succeeded' && categories.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [status, categories, selectedCategoryId]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleAdd = (product, quantity) => {
    dispatch(addToCart({ product, categoryId: selectedCategoryId, quantity }));
  };

  return (
    <div className="screen screen--shopping">
      <section className="catalog-panel">
        <h1 className="screen-title">רשימת קניות</h1>
        <p className="screen-subtitle">בחרו קטגוריה, הוסיפו מוצרים והמשיכו להזמנה.</p>

        {status === 'loading' && <p className="empty-hint">טוען קטגוריות ומוצרים…</p>}
        {status === 'failed' && <p className="error-text">{error}</p>}

        {status === 'succeeded' && (
          <>
            <CategorySelector
              categories={categories}
              selectedId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
            />
            <ProductList products={selectedCategory?.products} onAdd={handleAdd} />
          </>
        )}
      </section>

      <CartSummary onCheckout={() => dispatch(goToScreen('summary'))} />
    </div>
  );
}
