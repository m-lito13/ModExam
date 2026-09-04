// API client for backend 1 (.NET 10 + SQL Server).
// GET /api/categories?pageNumber=&pageSize=      -> PagedResult<{ id, name }>
// GET /api/categories/{id}/products?pageNumber=&pageSize= -> PagedResult<{ id, name, price, categoryId }>
// Categories are few, so fetchCategories() pulls every page and returns the
// full list. Products can be many per category, so they're fetched one page
// at a time via fetchProductsPage() instead of being loaded eagerly.

import type { Category, Product } from '../types';
import { t } from '../i18n/t';

const BASE_URL = import.meta.env.VITE_PRODUCT_API_URL;
const CATEGORY_PAGE_SIZE = 100;
export const PRODUCTS_PAGE_SIZE = 5;

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

interface CategoryDto {
  id: number;
  name: string;
}

interface ProductDto {
  id: number;
  name: string;
  price: number;
  categoryId: number;
}

async function fetchPage<T>(path: string, pageNumber: number, pageSize: number): Promise<PagedResult<T>> {
  const response = await fetch(
    `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  if (!response.ok) {
    throw new Error(t('errors.loadData', { status: response.status }));
  }
  return response.json();
}

async function fetchAllPages<T>(path: string, pageSize: number): Promise<T[]> {
  const items: T[] = [];
  let pageNumber = 1;
  let totalPages = 1;

  do {
    const page = await fetchPage<T>(path, pageNumber, pageSize);
    items.push(...page.items);
    totalPages = page.totalPages;
    pageNumber += 1;
  } while (pageNumber <= totalPages);

  return items;
}

export async function fetchCategories(): Promise<Category[]> {
  const categoryDtos = await fetchAllPages<CategoryDto>('/api/categories', CATEGORY_PAGE_SIZE);
  return categoryDtos.map((category) => ({ id: category.id, name: category.name }));
}

export async function fetchProductsPage(
  categoryId: number,
  pageNumber: number,
  pageSize: number = PRODUCTS_PAGE_SIZE
): Promise<PagedResult<Product>> {
  const page = await fetchPage<ProductDto>(`/api/categories/${categoryId}/products`, pageNumber, pageSize);
  return {
    ...page,
    items: page.items.map((product) => ({ id: product.id, name: product.name, price: product.price })),
  };
}
