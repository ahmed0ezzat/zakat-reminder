import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const t = {
  ar: {
    home: 'الرئيسية',
    calculator: 'حاسبة الزكاة',
    reminder: 'التذكير',
    distribution: 'التوزيع',
    lang: 'English',
  },
  en: {
    home: 'Home',
    calculator: 'Calculator',
    reminder: 'Reminder',
    distribution: 'Distribution',
    lang: 'العربية',
  },
};

export default function Navbar() {
  const [lang, setLang] = useState<'ar' | 'en'>(localStorage.getItem('lang') === 'en' ? 'en' : 'ar');
  const labels = t[lang];

  // Update lang context and localStorage on switch
  const handleLangSwitch = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    window.location.reload(); // reload to update context everywhere
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded transition-colors duration-200 text-sm font-medium ${
      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
    }`;

  return (
    <nav className="bg-white shadow mb-6 sticky top-0 z-10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <div className="text-xl font-bold text-blue-600">Zakat Reminder</div>
        <div className="space-x-1 flex flex-wrap">
          <NavLink to="/" className={linkClass} end>{labels.home}</NavLink>
          <NavLink to="/calculator" className={linkClass}>{labels.calculator}</NavLink>
          <NavLink to="/reminder" className={linkClass}>{labels.reminder}</NavLink>
          <NavLink to="/distribution" className={linkClass}>{labels.distribution}</NavLink>
        </div>
        <button onClick={handleLangSwitch} className="ml-4 px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition text-xs font-semibold">
          {labels.lang}
        </button>
      </div>
    </nav>
  );
}
