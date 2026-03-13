import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export function useProducts({
  search = '',
  page = 1,
  pageSize = 20,
  categoryId = undefined
} = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: pageSize,
    totalPages: 1
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        setLoading(true);

        const trimmedSearch = search.trim();
        let res;

        if (trimmedSearch) {
          res = await api.get('/products/search', {
            params: { q: trimmedSearch }
          });
          if (!cancelled) {
            setProducts(res.data);
            setPagination({
              total: res.data.length,
              page: 1,
              limit: res.data.length || pageSize,
              totalPages: 1
            });
          }
        } else {
          res = await api.get('/products', {
            params: {
              page,
              limit: pageSize,
              ...(categoryId ? { category_id: categoryId } : {})
            }
          });

          if (!cancelled) {
            setProducts(res.data.data);
            setPagination(res.data.pagination);
          }
        }

        if (!cancelled) {
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load products.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [search, page, pageSize, categoryId]);

  return { products, loading, error, pagination };
}


