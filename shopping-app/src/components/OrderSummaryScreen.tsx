import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearCart, selectCartItems, selectCartTotal } from '../features/cart/cartSlice';
import { goToScreen, setLastOrder } from '../features/ui/uiSlice';
import { submitOrder } from '../api/ordersApi';
import OrderForm from './OrderForm';
import type { Customer } from '../types';

export default function OrderSummaryScreen() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (customer: Customer) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        ...customer,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          categoryId: item.categoryId,
          quantity: item.quantity,
        })),
      };
      const result = await submitOrder(payload);
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
        <button type="button" className="link-btn" onClick={() => dispatch(goToScreen('shopping'))}>
          → חזרה לרשימת הקניות
        </button>
        <h1 className="screen-title">סיכום הזמנה</h1>
        <p className="screen-subtitle">בדקו את הפריטים ומלאו את הפרטים כדי לשלוח את ההזמנה.</p>

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
          <span>סה״כ לתשלום</span>
          <span>{total.toFixed(2)} ₪</span>
        </div>
      </section>

      <section className="form-panel">
        <h2 className="cart-panel__title">פרטי משלוח</h2>
        <OrderForm onSubmit={handleSubmit} submitting={submitting} submitError={submitError} />
      </section>
    </div>
  );
}
