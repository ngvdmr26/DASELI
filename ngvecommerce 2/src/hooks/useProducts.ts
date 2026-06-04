import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { mockProducts } from '../data';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts); // Start with mock
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'mock' | 'api'>('mock');

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getProducts();
      if (response.data && response.data.length > 0) {
        setProducts(response.data);
        setDataSource('api');
      } else if (response.error) {
        console.warn('API error, using mock data:', response.error);
        setProducts(mockProducts);
        setDataSource('mock');
        setError(response.error);
      } else {
        // API returned empty, use mock
        setProducts(mockProducts);
        setDataSource('mock');
      }
    } catch (err: any) {
      console.warn('Failed to fetch products, using mock data:', err);
      setProducts(mockProducts);
      setDataSource('mock');
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, dataSource, refetch: fetchProducts };
}
