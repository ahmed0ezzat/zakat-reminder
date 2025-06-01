import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export default function useFitrValue(lang: string) {
  const [fitrValue, setFitrValue] = useState<number | null>(null);
  const [loadingFitr, setLoadingFitr] = useState(false);

  const fetchFitrValue = useCallback(async () => {
    setLoadingFitr(true);
    try {
      // Replace with real API if available
      setTimeout(() => {
        setFitrValue(60);
        setLoadingFitr(false);
      }, 700);
    } catch {
      setFitrValue(null);
      setLoadingFitr(false);
      toast.error(lang === 'ar' ? 'تعذر جلب قيمة الفطر' : 'Failed to fetch fitr value');
    }
  }, [lang]);

  return { fitrValue, loadingFitr, fetchFitrValue };
}
