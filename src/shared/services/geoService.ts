export interface GeoInfo {
  country_code: string;
  currency: string;
  languages: string;
}

// French-speaking country codes (subset — expand as needed)
const FRENCH_COUNTRIES = new Set([
  'FR','BE','CH','LU','MC','SN','CI','ML','BF','NE','TG','BJ','GN','CD','CG',
  'GA','CM','CF','TD','DJ','KM','MG','MU','SC','RW','BI','HT','CA','MR','GW',
]);

export type AppCurrency = 'USD' | 'EUR' | 'RWF';
export type AppLanguage = 'en' | 'fr' | 'rw';

export function resolveCurrency(countryCode: string): AppCurrency {
  if (countryCode === 'RW') return 'RWF';
  // Euro-zone countries
  const EURO_ZONE = new Set([
    'AT','BE','CY','EE','FI','FR','DE','GR','IE','IT','LV','LT','LU','MT',
    'NL','PT','SK','SI','ES','AD','MC','SM','VA','ME','XK',
  ]);
  if (EURO_ZONE.has(countryCode)) return 'EUR';
  return 'USD';
}

export function resolveLanguage(countryCode: string): AppLanguage {
  if (countryCode === 'RW') return 'rw';
  if (FRENCH_COUNTRIES.has(countryCode)) return 'fr';
  return 'en';
}

export async function fetchGeoInfo(): Promise<{ currency: AppCurrency; language: AppLanguage }> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data: GeoInfo = await res.json();
    return {
      currency: resolveCurrency(data.country_code),
      language: resolveLanguage(data.country_code),
    };
  } catch {
    return { currency: 'USD', language: 'en' };
  }
}
