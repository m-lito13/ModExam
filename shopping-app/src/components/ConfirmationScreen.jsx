import { useDispatch, useSelector } from 'react-redux';
import { selectLastOrder, startNewOrder } from '../features/ui/uiSlice';

export default function ConfirmationScreen() {
  const dispatch = useDispatch();
  const order = useSelector(selectLastOrder);

  if (!order) return null;

  return (
    <div className="screen screen--confirmation">
      <div className="confirmation-card">
        <span className="confirmation-card__mark" aria-hidden="true">✓</span>
        <h1 className="screen-title">ההזמנה התקבלה!</h1>
        <p className="screen-subtitle">
          מספר הזמנה <strong>{order.orderId}</strong> נשלח אל {order.customer.email}
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
          <span>סה״כ ששולם</span>
          <span>{order.total.toFixed(2)} ₪</span>
        </div>

        <button type="button" className="btn btn--primary btn--full" onClick={() => dispatch(startNewOrder())}>
          התחילו הזמנה חדשה
        </button>
      </div>
    </div>
  );
}
