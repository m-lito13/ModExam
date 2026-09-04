import ProductCard from './ProductCard';
import type { Product } from '../types';
import { t } from '../i18n/t';

interface ProductListProps {
  products: Product[] | undefined;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAdd: (product: Product, quantity: number) => void;
}

export default function ProductList({
  products,
  status,
  error,
  page,
  totalPages,
  onPageChange,
  onAdd,
}: ProductListProps) {
  if (status === 'failed') {
    return <p className="error-text">{error}</p>;
  }

  if (status === 'loading' && !products?.length) {
    return <p className="empty-hint">{t('shopping.loading')}</p>;
  }

  if (!products || products.length === 0) {
    return <p className="empty-hint">{t('product.empty')}</p>;
  }

  return (
    <>
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="btn btn--primary"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            {t('product.pagePrevious')}
          </button>
          <span className="pagination__indicator">
            {t('product.pageIndicator', { page, total: totalPages })}
          </span>
          <button
            type="button"
            className="btn btn--primary"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            {t('product.pageNext')}
          </button>
        </div>
      )}
    </>
  );
}
