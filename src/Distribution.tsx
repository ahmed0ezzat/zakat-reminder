import { useState } from 'react';
import { organizations } from './organizations';

const serviceTypes = [
  { value: '', label: 'All Services' },
  { value: 'orphans', label: 'Orphans' },
  { value: 'medical', label: 'Medical Aid' },
  { value: 'food', label: 'Food Relief' },
];

export default function Distribution() {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [service, setService] = useState('');

  const filtered = organizations.filter(org =>
    (!country || org.country.toLowerCase().includes(country.toLowerCase())) &&
    (!city || org.city.toLowerCase().includes(city.toLowerCase())) &&
    (!service || org.service === service)
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Zakat Distribution</h2>
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <input
          className="input w-36"
          placeholder="Country"
          value={country}
          onChange={e => setCountry(e.target.value)}
        />
        <input
          className="input w-36"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        <select
          className="input w-40"
          value={service}
          onChange={e => setService(e.target.value)}
        >
          {serviceTypes.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.length === 0 && <div className="col-span-2 text-center text-gray-500">No organizations found.</div>}
        {filtered.map(org => (
          <div key={org.id} className="border rounded p-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">{org.name}</div>
              <span className={`px-2 py-1 text-xs rounded ${org.trust === 'Gov-approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{org.trust}</span>
            </div>
            <div className="text-sm text-gray-600">{org.city}, {org.country}</div>
            <div className="text-gray-700">{org.description}</div>
            <div className="text-xs text-blue-700 font-medium">Service: {org.service.charAt(0).toUpperCase() + org.service.slice(1)}</div>
            <div className="flex gap-2 items-center">
              {org.contact.type === 'whatsapp' && (
                <a href={`https://wa.me/${org.contact.value.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener" className="text-green-600 underline">WhatsApp</a>
              )}
              {org.contact.type === 'email' && (
                <a href={`mailto:${org.contact.value}`} className="text-blue-600 underline">Email</a>
              )}
              {org.contact.type === 'website' && (
                <a href={org.contact.value} target="_blank" rel="noopener" className="text-blue-600 underline">Website</a>
              )}
            </div>
            <button className="mt-2 bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition" onClick={() => window.open(org.contact.value, '_blank')}>Donate</button>
          </div>
        ))}
      </div>
    </div>
  );
}
