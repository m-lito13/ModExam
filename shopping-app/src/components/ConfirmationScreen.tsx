import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectLastOrder, startNewOrder } from '../features/ui/uiSlice';
import { t } from '../i18n/t';

export default function ConfirmationScreen() {
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectLastOrder);

  if (!order) return null;

  return (
    <div className="screen screen--confirmation">
      <div className="confirmation-card">
        <span className="confirmation-card__mark" aria-hidden="true">✓</span>
        <h1 className="screen-title">{t('confirmation.title')}</h1>
        <p className="screen-subtitle">
          {t('confirmation.subtitle', { orderId: order.orderId, email: order.customer.email })}
        </p>

        <ul className="summary-list">
          {order.items.map((item) => (
            <li key={item.productId} className="summary-list__row">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{(item.price * item.quantity).toFixed(2)} ₪</span>
            </li>
          ))}
        </ul>
        <div className="cart-panel__total">
          <span>{t('confirmation.totalPaid')}</span>
          <span>{order.total.toFixed(2)} ₪</span>
        </div>

        <button type="button" className="btn btn--primary btn--full" onClick={() => dispatch(startNewOrder())}>
          {t('confirmation.newOrder')}
        </button>
      </div>
    </div>
  );
}
