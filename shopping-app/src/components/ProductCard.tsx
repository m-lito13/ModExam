import { useState } from 'react';
import type { Product } from '../types';

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
            aria-label="הפחת כמות"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="stepper__value">{quantity}</span>
          <button
            type="button"
            className="stepper__btn"
            aria-label="הוסף כמות"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>
        <button type="button" className="btn btn--primary" onClick={handleAdd}>
          הוסף לסל
        </button>
      </div>
    </div>
  );
}
