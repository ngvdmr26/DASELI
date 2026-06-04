import { useState, useEffect, useCallback, useRef } from 'react';
import { StockInfo } from '../types';
import { api } from '../services/api';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useStock() {
  const [stockMap, setStockMap] = useState<Map<string, StockInfo>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStock = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.getStock();
      if (response.data && response.data.length > 0) {
        const map = new Map<string, StockInfo>();
        response.data.forEach((item) => {
          map.set(item.productId, item);
        });
        setStockMap(map);
      }
    } catch (err) {
      console.warn('Failed to fetch stock data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();

    intervalRef.current = setInterval(fetchStock, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStock]);

  return { stockMap, isLoading, refetch: fetchStock };
}
