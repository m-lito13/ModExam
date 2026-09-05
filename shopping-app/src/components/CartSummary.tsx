import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  removeFromCart,
  selectCartHasStockIssues,
  selectCartItems,
  selectCartTotal,
  updateCartQuantity,
} from '../features/cart/cartSlice';
import { t } from '../i18n/t';

interface CartSummaryProps {
  onCheckout: () => void;
}

export default function CartSummary({ onCheckout }: CartSummaryProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const hasStockIssues = useAppSelector(selectCartHasStockIssues);

  return (
    <aside className="cart-panel">
      <h2 className="cart-panel__title">{t('cart.title')}</h2>

      {items.length === 0 ? (
        <p className="empty-hint">{t('cart.empty')}</p>
      ) : (
        <ul className="cart-list">
          {items.map((item) => {
            const exceedsStock = item.quantity > item.stockQuantity;
            return (
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
                    aria-label={t('cart.qtyLabel', { name: item.name })}
                  />
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={t('cart.removeLabel', { name: item.name })}
                    onClick={() => dispatch(removeFromCart({ productId: item.productId }))}
                  >
                    ✕
                  </button>
                </div>
                {exceedsStock && (
                  <span className="error-text">
                    {t('summary.stockExceeded', { name: item.name, stock: item.stockQuantity })}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="cart-panel__footer">
        <div className="cart-panel__total">
          <span>{t('cart.total')}</span>
          <span>{total.toFixed(2)} ₪</span>
        </div>
        <button
          type="button"
          className="btn btn--accent btn--full"
          disabled={items.length === 0 || hasStockIssues}
          onClick={onCheckout}
        >
          {t('cart.checkout')}
        </button>
      </div>
    </aside>
  );
}
