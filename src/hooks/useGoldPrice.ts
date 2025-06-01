import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export default function useGoldPrice(lang: string) {
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [loadingGold, setLoadingGold] = useState(false);

  const fetchGoldPrice = useCallback(async () => {
    setLoadingGold(true);
    try {
      // Replace with real API if available
      setTimeout(() => {
        setGoldPrice(3500);
        setLoadingGold(false);
      }, 700);
    } catch {
      setGoldPrice(null);
      setLoadingGold(false);
      toast.error(lang === 'ar' ? 'تعذر جلب سعر الذهب' : 'Failed to fetch gold price');
    }
  }, [lang]);

  return { goldPrice, loadingGold, fetchGoldPrice };
}
