import { useState } from 'react';

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
    if (!inputs.cash || !validatePositiveNumber(inputs.cash)) newErrors.cash = 'Required, must be positive';
    if (!inputs.goldWeight || !validatePositiveNumber(inputs.goldWeight)) newErrors.goldWeight = 'Required, must be positive';
    if (!inputs.goldPrice || !validatePositiveNumber(inputs.goldPrice)) newErrors.goldPrice = 'Required, must be positive';
    if (!inputs.business || !validatePositiveNumber(inputs.business)) newErrors.business = 'Required, must be positive';
    if (!inputs.fitr || !validatePositiveNumber(inputs.fitr)) newErrors.fitr = 'Required, must be positive';
    if (!inputs.hijri) newErrors.hijri = 'Required';
    inputs.stocks.forEach((s, i) => {
      if (!s.name) newErrors[`stockName${i}`] = 'Required';
      if (!s.shares || !validatePositiveNumber(s.shares)) newErrors[`stockShares${i}`] = 'Required, must be positive';
      if (!s.price || !validatePositiveNumber(s.price)) newErrors[`stockPrice${i}`] = 'Required, must be positive';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    if (!validate()) return;
    const cash = Number(inputs.cash) * 0.025;
    const gold = Number(inputs.goldWeight) * Number(inputs.goldPrice) * 0.025;
    const stocks = inputs.stocks.reduce((sum, s) => sum + Number(s.shares) * Number(s.price) * 0.025, 0);
    const business = Number(inputs.business) * 0.025;
    const fitr = Number(inputs.fitr) * 25; // Assume 25 per person
    const total = cash + gold + stocks + business + fitr;
    setResult({ cash, gold, stocks, business, fitr, total });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Zakat Calculator</h2>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); calculate(); }}>
        <div>
          <label htmlFor="cash" className="block font-medium">Cash (local currency)</label>
          <input id="cash" name="cash" type="number" min="0" className="input" value={inputs.cash} onChange={handleInput} />
          {errors.cash && <div className="text-red-500 text-sm">{errors.cash}</div>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="goldWeight" className="block font-medium">Gold/Silver Weight (g)</label>
            <input id="goldWeight" name="goldWeight" type="number" min="0" className="input" value={inputs.goldWeight} onChange={handleInput} />
            {errors.goldWeight && <div className="text-red-500 text-sm">{errors.goldWeight}</div>}
          </div>
          <div>
            <label htmlFor="goldPrice" className="block font-medium">Gold/Silver Price per gram</label>
            <input id="goldPrice" name="goldPrice" type="number" min="0" className="input" value={inputs.goldPrice} onChange={handleInput} />
            {errors.goldPrice && <div className="text-red-500 text-sm">{errors.goldPrice}</div>}
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="stock-name-0">Stocks</label>
          {inputs.stocks.map((s, i) => (
            <div key={s.name + i + s.shares + s.price} className="flex gap-2 mb-2">
              <input id={`stock-name-${i}`} name="stock-name" placeholder="Stock name" className="input flex-1" value={s.name} onChange={e => handleInput({ ...e, target: { ...e.target, name: 'stock-name' } }, i)} />
              <input id={`stock-shares-${i}`} name="stock-shares" type="number" min="0" placeholder="Shares" className="input w-24" value={s.shares} onChange={e => handleInput({ ...e, target: { ...e.target, name: 'stock-shares' } }, i)} />
              <input id={`stock-price-${i}`} name="stock-price" type="number" min="0" placeholder="Price" className="input w-24" value={s.price} onChange={e => handleInput({ ...e, target: { ...e.target, name: 'stock-price' } }, i)} />
              {inputs.stocks.length > 1 && <button type="button" className="text-red-500" onClick={() => removeStock(i)}>✕</button>}
            </div>
          ))}
          <button type="button" className="text-blue-600 underline text-sm" onClick={addStock}>+ Add Stock</button>
          {inputs.stocks.map((_, i) => (
            <div key={i + 'err'}>
              {errors[`stockName${i}`] && <div className="text-red-500 text-sm">{errors[`stockName${i}`]}</div>}
              {errors[`stockShares${i}`] && <div className="text-red-500 text-sm">{errors[`stockShares${i}`]}</div>}
              {errors[`stockPrice${i}`] && <div className="text-red-500 text-sm">{errors[`stockPrice${i}`]}</div>}
            </div>
          ))}
        </div>
        <div>
          <label htmlFor="business" className="block font-medium">Business Goods (inventory value)</label>
          <input id="business" name="business" type="number" min="0" className="input" value={inputs.business} onChange={handleInput} />
          {errors.business && <div className="text-red-500 text-sm">{errors.business}</div>}
        </div>
        <div>
          <label htmlFor="fitr" className="block font-medium">Zakat al-Fitr (family members)</label>
          <input id="fitr" name="fitr" type="number" min="0" className="input" value={inputs.fitr} onChange={handleInput} />
          {errors.fitr && <div className="text-red-500 text-sm">{errors.fitr}</div>}
        </div>
        <div>
          <label htmlFor="hijri" className="block font-medium">Hijri Start Date</label>
          <input id="hijri" name="hijri" type="date" className="input" value={inputs.hijri} onChange={handleInput} />
          {errors.hijri && <div className="text-red-500 text-sm">{errors.hijri}</div>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Calculate Zakat</button>
      </form>
      {result && (
        <div className="mt-6 bg-blue-50 p-4 rounded">
          <h3 className="text-lg font-bold mb-2">Zakat Calculation Result</h3>
          <ul className="space-y-1">
            <li>Cash: <span className="font-mono">{result.cash.toFixed(2)}</span></li>
            <li>Gold/Silver: <span className="font-mono">{result.gold.toFixed(2)}</span></li>
            <li>Stocks: <span className="font-mono">{result.stocks.toFixed(2)}</span></li>
            <li>Business Goods: <span className="font-mono">{result.business.toFixed(2)}</span></li>
            <li>Zakat al-Fitr: <span className="font-mono">{result.fitr.toFixed(2)}</span></li>
            <li className="font-bold mt-2">Total: <span className="font-mono text-blue-700">{result.total.toFixed(2)}</span></li>
          </ul>
        </div>
      )}
    </div>
  );
}
