import ProductCard from './ProductCard';
import type { Product } from '../types';
import { t } from '../i18n/t';

interface ProductListProps {
  products: Product[] | undefined;
  onAdd: (product: Product, quantity: number) => void;
}

export default function ProductList({ products, onAdd }: ProductListProps) {
  if (!products || products.length === 0) {
    return <p className="empty-hint">{t('product.empty')}</p>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
