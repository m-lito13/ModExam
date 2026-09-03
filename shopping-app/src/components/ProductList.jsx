import ProductCard from './ProductCard';

export default function ProductList({ products, onAdd }) {
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
