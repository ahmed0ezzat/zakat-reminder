export interface Organization {
  id: number;
  name: string;
  city: string;
  country: string;
  service: string;
  description: string;
  contact: { type: 'whatsapp' | 'email' | 'website'; value: string };
  trust: string;
}

export const organizations: Organization[] = [
  {
    id: 1,
    name: 'Zakat Foundation Egypt',
    city: 'Cairo',
    country: 'Egypt',
    service: 'orphans',
    description: 'Supports orphans and vulnerable children.',
    contact: { type: 'website', value: 'https://zakat-eg.org' },
    trust: 'Gov-approved',
  },
  {
    id: 2,
    name: 'Medical Aid Sudan',
    city: 'Khartoum',
    country: 'Sudan',
    service: 'medical',
    description: 'Provides medical aid to those in need.',
    contact: { type: 'whatsapp', value: '+249123456789' },
    trust: 'Gov-approved',
  },
  {
    id: 3,
    name: 'Orphan Care Morocco',
    city: 'Casablanca',
    country: 'Morocco',
    service: 'orphans',
    description: 'Care and education for orphans.',
    contact: { type: 'email', value: 'info@orphancare.ma' },
    trust: 'Trusted',
  },
  {
    id: 4,
    name: 'Food Relief Indonesia',
    city: 'Jakarta',
    country: 'Indonesia',
    service: 'food',
    description: 'Food distribution for the needy.',
    contact: { type: 'website', value: 'https://foodrelief.id' },
    trust: 'Gov-approved',
  },
  {
    id: 5,
    name: 'Medical Aid Egypt',
    city: 'Alexandria',
    country: 'Egypt',
    service: 'medical',
    description: 'Medical support for low-income families.',
    contact: { type: 'email', value: 'contact@medaideg.com' },
    trust: 'Trusted',
  },
];
