import { useLang } from './lang';
import i18nRaw from './i18n.json';

// Use a more specific type for i18n
interface HomeLabels {
  title: string;
  desc: string;
}
interface I18n {
  ar: { home: HomeLabels };
  en: { home: HomeLabels };
}
const i18n = i18nRaw as I18n;

export default function Home() {
  const lang = useLang();
  const labels = i18n[lang]?.home ?? { title: '', desc: '' };
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">{labels.title}</h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-2">{labels.desc}</p>
    </div>
  );
}
