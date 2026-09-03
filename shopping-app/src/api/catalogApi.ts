// API client for backend 1 (.NET 10 + SQL Server).
// GET /api/categories?pageNumber=&pageSize=      -> PagedResult<{ id, name }>
// GET /api/categories/{id}/products?pageNumber=&pageSize= -> PagedResult<{ id, name, price, categoryId }>
// Categories and their products are paginated separately by the backend, so
// fetchCategories() pulls every page of categories, then every page of each
// category's products, and assembles the nested Category[] shape the app uses.

import type { Category, Product } from '../types';

const BASE_URL = import.meta.env.VITE_PRODUCT_API_URL;
const PAGE_SIZE = 100;

interface PagedResult<T> {
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

async function fetchAllPages<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  let pageNumber = 1;
  let totalPages = 1;

  do {
    const response = await fetch(
      `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}pageNumber=${pageNumber}&pageSize=${PAGE_SIZE}`
    );
    if (!response.ok) {
      throw new Error(`שגיאה בטעינת הנתונים מהשרת (${response.status})`);
    }
    const page: PagedResult<T> = await response.json();
    items.push(...page.items);
    totalPages = page.totalPages;
    pageNumber += 1;
  } while (pageNumber <= totalPages);

  return items;
}

export async function fetchCategories(): Promise<Category[]> {
  const categoryDtos = await fetchAllPages<CategoryDto>('/api/categories');

  return Promise.all(
    categoryDtos.map(async (category): Promise<Category> => {
      const productDtos = await fetchAllPages<ProductDto>(`/api/categories/${category.id}/products`);
      const products: Product[] = productDtos.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
      }));
      return { id: category.id, name: category.name, products };
    })
  );
}
