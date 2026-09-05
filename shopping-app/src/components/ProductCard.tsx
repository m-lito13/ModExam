import { useState } from 'react';
import type { Product } from '../types';
import { t } from '../i18n/t';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAdd(product, quantity);
    setQuantity(1);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/\D/g, '');
    setQuantity(digitsOnly === '' ? 1 : Math.max(1, Number(digitsOnly)));
  };

  return (
    <div className="product-card">
      <div className="product-card__info">
        <span className="product-card__name">{product.name}</span>
        <span className="product-card__price">{product.price.toFixed(2)} ₪</span>
      </div>
      <div className="product-card__actions">
        <div className="stepper">
          <button
            type="button"
            className="stepper__btn"
            aria-label={t('product.decreaseQty')}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="stepper__value"
            value={quantity}
            onChange={handleQuantityChange}
            aria-label={t('product.quantityLabel')}
          />
          <button
            type="button"
            className="stepper__btn"
            aria-label={t('product.increaseQty')}
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>
        <button type="button" className="btn btn--primary" onClick={handleAdd}>
          {t('product.addToCart')}
        </button>
      </div>
    </div>
  );
}
