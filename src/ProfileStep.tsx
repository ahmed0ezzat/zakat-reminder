import React from 'react';
import type { UserProfile } from './types';

interface ProfileStepProps {
  profile: UserProfile;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNext: () => void;
  lang: string;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ profile, onChange, onNext, lang }) => (
  <>
    <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 tracking-tight drop-shadow">{lang === 'ar' ? 'الملف الشخصي' : 'Profile'}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label htmlFor="name" className="block font-semibold mb-1">{lang === 'ar' ? 'الاسم' : 'Name'}</label>
        <input id="name" name="name" className="input w-full" value={profile.name} onChange={onChange} placeholder={lang === 'ar' ? 'اسمك' : 'Your name'} />
      </div>
      <div>
        <label htmlFor="email" className="block font-semibold mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
        <input id="email" name="email" className="input w-full" value={profile.email} onChange={onChange} placeholder="example@email.com" />
      </div>
      <div>
        <label htmlFor="country" className="block font-semibold mb-1">{lang === 'ar' ? 'الدولة' : 'Country'}</label>
        <input id="country" name="country" className="input w-full" value={profile.country} onChange={onChange} placeholder={lang === 'ar' ? 'مصر' : 'Egypt'} />
      </div>
      <div>
        <label htmlFor="city" className="block font-semibold mb-1">{lang === 'ar' ? 'المدينة' : 'City'}</label>
        <input id="city" name="city" className="input w-full" value={profile.city} onChange={onChange} placeholder={lang === 'ar' ? 'القاهرة' : 'Cairo'} />
      </div>
      <div>
        <label htmlFor="currency" className="block font-semibold mb-1">{lang === 'ar' ? 'العملة' : 'Currency'}</label>
        <input id="currency" name="currency" className="input w-full" value={profile.currency} onChange={onChange} placeholder={lang === 'ar' ? 'جنيه' : 'EGP'} />
      </div>
      <div>
        <label htmlFor="hijriStart" className="block font-semibold mb-1">{lang === 'ar' ? 'تاريخ بداية الحول الهجري' : 'Hijri Start Date'}</label>
        <input id="hijriStart" name="hijriStart" type="date" className="input w-full" value={profile.hijriStart} onChange={onChange} />
      </div>
    </div>
    <div className="flex justify-end">
      <button type="button" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 transition shadow" onClick={onNext}>{lang === 'ar' ? 'التالي: الأصول والزكاة' : 'Next: Assets & Zakat'}</button>
    </div>
  </>
);

export default ProfileStep;
