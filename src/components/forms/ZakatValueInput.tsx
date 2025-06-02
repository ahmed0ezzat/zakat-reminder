import React from 'react';

interface ZakatValueInputProps {
  value: string;
  onChange: (v: string) => void;
  selectedType: string;
  lang: string;
}

const ZakatValueInput: React.FC<ZakatValueInputProps> = ({ value, onChange, selectedType, lang }) => (
  <input
    className="input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200"
    type={selectedType === 'gold' || selectedType === 'silver' ? 'number' : 'number'}
    min="0"
    step={selectedType === 'gold' || selectedType === 'silver' ? '0.01' : '1'}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={(() => {
      if (selectedType === 'gold') return lang === 'ar' ? 'أدخل وزن الذهب بالجرام' : 'Enter gold weight in grams';
      if (selectedType === 'silver') return lang === 'ar' ? 'أدخل وزن الفضة بالجرام' : 'Enter silver weight in grams';
      if (selectedType === 'fitr') return lang === 'ar' ? 'عدد الأفراد' : 'Number of people';
      if (selectedType === 'stocks') return lang === 'ar' ? 'قيمة الأسهم بالجنيه' : 'Stock value in EGP';
      if (selectedType === 'cash') return lang === 'ar' ? 'المبلغ النقدي بالجنيه' : 'Cash amount in EGP';
      if (selectedType === 'business') return lang === 'ar' ? 'قيمة التجارة بالجنيه' : 'Business value in EGP';
      return lang === 'ar' ? 'أدخل القيمة' : 'Enter value';
    })()}
  />
);

export default ZakatValueInput;
