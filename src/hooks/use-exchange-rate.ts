import { useState, useEffect } from 'react';

export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/exchange-rate`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rate');
        }
        const data = await response.json();
        if (data.success && data.rate) {
          setExchangeRate(data.rate);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (err) {
        console.error("Error fetching exchange rate:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        // Fallback rate
        setExchangeRate(126.28);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, []);

  return { exchangeRate, isLoading, error };
}