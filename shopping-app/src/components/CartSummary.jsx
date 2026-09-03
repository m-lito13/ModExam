import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  selectCartItems,
  selectCartTotal,
  updateCartQuantity,
} from '../features/cart/cartSlice';

export default function CartSummary({ onCheckout }) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  return (
    <aside className="cart-panel">
      <h2 className="cart-panel__title">הסל שלך</h2>

      {items.length === 0 ? (
        <p className="empty-hint">הסל ריק. הוסיפו מוצרים כדי להתחיל.</p>
      ) : (
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.productId} className="cart-list__row">
              <div className="cart-list__details">
                <span className="cart-list__name">{item.name}</span>
                <span className="cart-list__price">
                  {(item.price * item.quantity).toFixed(2)} ₪
                </span>
              </div>
              <div className="cart-list__controls">
                <input
                  type="number"
                  min="1"
                  className="cart-list__qty"
                  value={item.quantity}
                  onChange={(event) =>
                    dispatch(
                      updateCartQuantity({
                        productId: item.productId,
                        quantity: Number(event.target.value),
                      })
                    )
                  }
                  aria-label={`כמות עבור ${item.name}`}
                />
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`הסר ${item.name} מהסל`}
                  onClick={() => dispatch(removeFromCart({ productId: item.productId }))}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="cart-panel__footer">
        <div className="cart-panel__total">
          <span>סה״כ</span>
          <span>{total.toFixed(2)} ₪</span>
        </div>
        <button
          type="button"
          className="btn btn--accent btn--full"
          disabled={items.length === 0}
          onClick={onCheckout}
        >
          המשך להזמנה
        </button>
      </div>
    </aside>
  );
}
