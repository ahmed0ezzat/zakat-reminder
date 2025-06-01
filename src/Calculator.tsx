import { useState } from 'react';
import { useLang } from './lang';

interface StockInput {
  name: string;
  shares: string;
  price: string;
}

interface CalculatorInputs {
  cash: string;
  goldWeight: string;
  goldPrice: string;
  stocks: StockInput[];
  business: string;
  fitr: string;
  hijri: string;
}

interface CalculatorErrors {
  cash?: string;
  goldWeight?: string;
  goldPrice?: string;
  business?: string;
  fitr?: string;
  hijri?: string;
  [key: string]: string | undefined;
}

interface ZakatResult {
  cash: number;
  gold: number;
  stocks: number;
  business: number;
  fitr: number;
  total: number;
}

function validatePositiveNumber(value: string) {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
}

export default function Calculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    cash: '',
    goldWeight: '',
    goldPrice: '',
    stocks: [{ name: '', shares: '', price: '' }],
    business: '',
    fitr: '',
    hijri: '',
  });
  const [errors, setErrors] = useState<CalculatorErrors>({});
  const [result, setResult] = useState<ZakatResult | null>(null);
  const lang = useLang();

  // AR/EN labels
  const t = {
    ar: {
      title: 'حاسبة الزكاة',
      cash: 'النقد (بالعملة المحلية)',
      business: 'قيمة البضائع التجارية',
      goldWeight: 'وزن الذهب/الفضة (غرام)',
      goldPrice: 'سعر الغرام',
      stocks: 'الأسهم',
      stockName: 'اسم السهم',
      stockShares: 'عدد الأسهم',
      stockPrice: 'سعر السهم',
      addStock: '+ إضافة سهم',
      remove: 'حذف',
      fitr: 'زكاة الفطر (عدد الأفراد)',
      hijri: 'تاريخ بداية الحول الهجري',
      calc: 'احسب الزكاة',
      result: 'نتيجة حساب الزكاة',
      cashR: 'النقد',
      goldR: 'الذهب/الفضة',
      stocksR: 'الأسهم',
      businessR: 'البضائع التجارية',
      fitrR: 'زكاة الفطر',
      total: 'الإجمالي',
      required: 'مطلوب',
      mustBePositive: 'يجب أن يكون رقماً موجباً',
    },
    en: {
      title: 'Zakat Calculator',
      cash: 'Cash (local currency)',
      business: 'Business Goods (inventory value)',
      goldWeight: 'Gold/Silver Weight (g)',
      goldPrice: 'Gold/Silver Price per gram',
      stocks: 'Stocks',
      stockName: 'Stock name',
      stockShares: 'Shares',
      stockPrice: 'Price',
      addStock: '+ Add Stock',
      remove: 'Remove',
      fitr: 'Zakat al-Fitr (family members)',
      hijri: 'Hijri Start Date',
      calc: 'Calculate Zakat',
      result: 'Zakat Calculation Result',
      cashR: 'Cash',
      goldR: 'Gold/Silver',
      stocksR: 'Stocks',
      businessR: 'Business Goods',
      fitrR: 'Zakat al-Fitr',
      total: 'Total',
      required: 'Required',
      mustBePositive: 'Must be positive',
    },
  }[lang];

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx?: number) => {
    const { name, value } = e.target;
    if (name.startsWith('stock-') && typeof idx === 'number') {
      const field = name.split('-')[1];
      setInputs((prev) => {
        const stocks = [...prev.stocks];
        stocks[idx] = { ...stocks[idx], [field]: value };
        return { ...prev, stocks };
      });
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addStock = () => {
    setInputs((prev) => ({ ...prev, stocks: [...prev.stocks, { name: '', shares: '', price: '' }] }));
  };

  const removeStock = (idx: number) => {
    setInputs((prev) => ({ ...prev, stocks: prev.stocks.filter((_, i) => i !== idx) }));
  };

  const validate = () => {
    const newErrors: CalculatorErrors = {};
    // Only hijri is required
    if (!inputs.hijri) newErrors.hijri = t.required;
    // If provided, must be positive
    if (inputs.cash && !validatePositiveNumber(inputs.cash)) newErrors.cash = t.mustBePositive;
    if (inputs.goldWeight && !validatePositiveNumber(inputs.goldWeight)) newErrors.goldWeight = t.mustBePositive;
    if (inputs.goldPrice && !validatePositiveNumber(inputs.goldPrice)) newErrors.goldPrice = t.mustBePositive;
    if (inputs.business && !validatePositiveNumber(inputs.business)) newErrors.business = t.mustBePositive;
    if (inputs.fitr && !validatePositiveNumber(inputs.fitr)) newErrors.fitr = t.mustBePositive;
    inputs.stocks.forEach((s, i) => {
      if (s.name || s.shares || s.price) {
        if (!s.name) newErrors[`stockName${i}`] = t.required;
        if (!s.shares || !validatePositiveNumber(s.shares)) newErrors[`stockShares${i}`] = t.mustBePositive;
        if (!s.price || !validatePositiveNumber(s.price)) newErrors[`stockPrice${i}`] = t.mustBePositive;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    if (!validate()) return;
    const cash = Number(inputs.cash) || 0;
    const goldWeight = Number(inputs.goldWeight) || 0;
    const goldPrice = Number(inputs.goldPrice) || 0;
    const gold = goldWeight * goldPrice * 0.025;
    const stocks = inputs.stocks.reduce((sum, s) => {
      if (s.name && s.shares && s.price) {
        return sum + Number(s.shares) * Number(s.price) * 0.025;
      }
      return sum;
    }, 0);
    const business = Number(inputs.business) || 0;
    const fitr = Number(inputs.fitr) ? Number(inputs.fitr) * 25 : 0;
    const total = cash * 0.025 + gold + stocks + business * 0.025 + fitr;
    setResult({ cash: cash * 0.025, gold, stocks, business: business * 0.025, fitr, total });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl mt-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 tracking-tight drop-shadow">{t.title}</h2>
      <form className="space-y-6" onSubmit={e => { e.preventDefault(); calculate(); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="cash" className="block font-semibold text-gray-700 mb-1">{t.cash}</label>
            <input id="cash" name="cash" type="number" min="0" className="input w-full border-2 border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 bg-white shadow-sm" value={inputs.cash} onChange={handleInput} placeholder={lang === 'ar' ? 'مثال: ١٠٠٠٠' : 'e.g. 10000'} />
            {errors.cash && <div className="text-red-500 text-xs mt-1">{errors.cash}</div>}
          </div>
          <div>
            <label htmlFor="business" className="block font-semibold text-gray-700 mb-1">{t.business}</label>
            <input id="business" name="business" type="number" min="0" className="input w-full border-2 border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 bg-white shadow-sm" value={inputs.business} onChange={handleInput} placeholder={lang === 'ar' ? 'مثال: ٥٠٠٠' : 'e.g. 5000'} />
            {errors.business && <div className="text-red-500 text-xs mt-1">{errors.business}</div>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="goldWeight" className="block font-semibold text-gray-700 mb-1">{t.goldWeight}</label>
            <input id="goldWeight" name="goldWeight" type="number" min="0" className="input w-full border-2 border-yellow-200 focus:border-yellow-500 rounded-lg px-3 py-2 bg-white shadow-sm" value={inputs.goldWeight} onChange={handleInput} placeholder={lang === 'ar' ? 'مثال: ٨٥' : 'e.g. 85'} />
            {errors.goldWeight && <div className="text-red-500 text-xs mt-1">{errors.goldWeight}</div>}
          </div>
          <div>
            <label htmlFor="goldPrice" className="block font-semibold text-gray-700 mb-1">{t.goldPrice}</label>
            <input id="goldPrice" name="goldPrice" type="number" min="0" className="input w-full border-2 border-yellow-200 focus:border-yellow-500 rounded-lg px-3 py-2 bg-white shadow-sm" value={inputs.goldPrice} onChange={handleInput} placeholder={lang === 'ar' ? 'مثال: ٣٠٠' : 'e.g. 300'} />
            {errors.goldPrice && <div className="text-red-500 text-xs mt-1">{errors.goldPrice}</div>}
          </div>
        </div>
        <div className="bg-white/80 rounded-xl p-4 shadow-inner">
          <label className="block font-semibold text-gray-700 mb-2" htmlFor="stock-name-0">{t.stocks}</label>
          {inputs.stocks.map((s, i) => (
            <div key={s.name + i + s.shares + s.price} className="flex flex-col md:flex-row gap-2 mb-2 items-center">
              <input id={`stock-name-${i}`} name="stock-name" placeholder={t.stockName} className="input flex-1 border-2 border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 bg-white shadow-sm" value={s.name} onChange={e => handleInput({ ...e, target: { ...e.target, name: 'stock-name' } }, i)} />
              <input id={`stock-shares-${i}`} name="stock-shares" type="number" min="0" placeholder={t.stockShares} className="input w-24 border-2 border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 bg-white shadow-sm" value={s.shares} onChange={e => handleInput({ ...e, target: { ...e.target, name: 'stock-shares' } }, i)} />
              <input id={`stock-price-${i}`} name="stock-price" type="number" min="0" placeholder={t.stockPrice} className="input w-24 border-2 border-blue-200 focus:border-blue-500 rounded-lg px-3 py-2 bg-white shadow-sm" value={s.price} onChange={e => handleInput({ ...e, target: { ...e.target, name: 'stock-price' } }, i)} />
              {inputs.stocks.length > 1 && <button type="button" className="text-red-500 text-lg px-2" onClick={() => removeStock(i)} title={t.remove}>✕</button>}
            </div>
          ))}
          <button type="button" className="text-blue-600 underline text-sm mt-1" onClick={addStock}>{t.addStock}</button>
          {inputs.stocks.map((_, i) => (
            <div key={i + 'err'}>
              {errors[`stockName${i}`] && <div className="text-red-500 text-xs">{errors[`stockName${i}`]}</div>}
              {errors[`stockShares${i}`] && <div className="text-red-500 text-xs">{errors[`stockShares${i}`]}</div>}
              {errors[`stockPrice${i}`] && <div className="text-red-500 text-xs">{errors[`stockPrice${i}`]}</div>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fitr" className="block font-semibold text-gray-700 mb-1">{t.fitr}</label>
            <input id="fitr" name="fitr" type="number" min="0" className="input w-full border-2 border-green-200 focus:border-green-500 rounded-lg px-3 py-2 bg-white shadow-sm" value={inputs.fitr} onChange={handleInput} placeholder={lang === 'ar' ? 'مثال: ٤' : 'e.g. 4'} />
            {errors.fitr && <div className="text-red-500 text-xs mt-1">{errors.fitr}</div>}
          </div>
          <div>
            <label htmlFor="hijri" className="block font-semibold text-gray-700 mb-1">{t.hijri}</label>
            <input id="hijri" name="hijri" type="date" className="input w-full border-2 border-gray-200 focus:border-blue-400 rounded-lg px-3 py-2 bg-white shadow-sm" value={inputs.hijri} onChange={handleInput} />
            {errors.hijri && <div className="text-red-500 text-xs mt-1">{errors.hijri}</div>}
          </div>
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-xl font-bold text-lg shadow hover:from-blue-700 hover:to-blue-500 transition">{t.calc}</button>
      </form>
      {result && (
        <div className="mt-8 bg-white/90 p-6 rounded-xl shadow-lg border-t-4 border-blue-400 animate-fade-in">
          <h3 className="text-xl font-bold mb-4 text-blue-700">{t.result}</h3>
          <ul className="space-y-2 text-lg">
            <li className="flex justify-between"><span>{t.cashR}:</span> <span className="font-mono">{result.cash.toFixed(2)}</span></li>
            <li className="flex justify-between"><span>{t.goldR}:</span> <span className="font-mono">{result.gold.toFixed(2)}</span></li>
            <li className="flex justify-between"><span>{t.stocksR}:</span> <span className="font-mono">{result.stocks.toFixed(2)}</span></li>
            <li className="flex justify-between"><span>{t.businessR}:</span> <span className="font-mono">{result.business.toFixed(2)}</span></li>
            <li className="flex justify-between"><span>{t.fitrR}:</span> <span className="font-mono">{result.fitr.toFixed(2)}</span></li>
            <li className="font-bold flex justify-between border-t pt-2 mt-2 text-blue-700 text-xl"><span>{t.total}:</span> <span className="font-mono">{result.total.toFixed(2)}</span></li>
          </ul>
        </div>
      )}
    </div>
  );
}
