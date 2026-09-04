import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearCart, selectCartItems, selectCartTotal } from '../features/cart/cartSlice';
import { selectCategories } from '../features/catalog/catalogSlice';
import { goToScreen, setLastOrder } from '../features/ui/uiSlice';
import { submitOrder } from '../api/ordersApi';
import OrderForm from './OrderForm';
import { SCREEN, type Customer } from '../types';
import { t } from '../i18n/t';

export default function OrderSummaryScreen() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const categories = useAppSelector(selectCategories);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Generated once per visit to this screen (a fresh order) and reused across
  // retries of the same submission, so a duplicate request dedupes server-side.
  const idempotencyKeyRef = useRef<string | null>(null);
  if (idempotencyKeyRef.current === null) {
    idempotencyKeyRef.current = crypto.randomUUID();
  }
  const idempotencyKey = idempotencyKeyRef.current;

  const handleSubmit = async (customer: Customer) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        ...customer,
        products: items.map((item) => ({
          category: categories.find((c) => c.id === item.categoryId)?.name ?? '',
          productName: item.name,
          quantity: item.quantity,
        })),
      };
      const result = await submitOrder(payload, idempotencyKey);
      dispatch(setLastOrder({ ...result, customer, items, total }));
      dispatch(clearCart());
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="screen screen--summary">
      <section className="summary-panel">
        <button type="button" className="link-btn" onClick={() => dispatch(goToScreen(SCREEN.SHOPPING))}>
          {t('summary.back')}
        </button>
        <h1 className="screen-title">{t('summary.title')}</h1>
        <p className="screen-subtitle">{t('summary.subtitle')}</p>

        <ul className="summary-list">
          {items.map((item) => (
            <li key={item.productId} className="summary-list__row">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{(item.price * item.quantity).toFixed(2)} ₪</span>
            </li>
          ))}
        </ul>
        <div className="cart-panel__total">
          <span>{t('summary.totalToPay')}</span>
          <span>{total.toFixed(2)} ₪</span>
        </div>
      </section>

      <section className="form-panel">
        <h2 className="cart-panel__title">{t('summary.shippingDetails')}</h2>
        <OrderForm onSubmit={handleSubmit} submitting={submitting} submitError={submitError} />
      </section>
    </div>
  );
}
