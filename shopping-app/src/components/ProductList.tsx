import ProductCard from './ProductCard';
import type { Product } from '../types';

interface ProductListProps {
  products: Product[] | undefined;
  onAdd: (product: Product, quantity: number) => void;
}

export default function ProductList({ products, onAdd }: ProductListProps) {
  if (!products || products.length === 0) {
    return <p className="empty-hint">אין מוצרים להצגה בקטגוריה זו.</p>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
