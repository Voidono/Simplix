// src/components/LanguageSwitcher.tsx
'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { ChangeEvent } from 'react';

// Assuming you have your locales defined in this file, or a similar one
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  // Ensure currentLocale is treated as one of your specific locale types
  const currentLocale = params.locale as typeof routing.locales[number]; // This casts it to "en" | "vi"
  
  // Get locales directly from your routing config
  // The type of supportedLocales will correctly be ("en" | "vi")[]
  const supportedLocales = routing.locales; 

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // nextLocale will be a string from the select input
    const nextLocale = e.target.value;

    const pathSegments: string[] = pathname.split('/').filter(Boolean);

    let newPathSegments: string[];

    // Check if the first segment is a *known* locale from your supported list
    // We need to cast pathSegments[0] to a compatible type for `includes`
    if (pathSegments.length > 0 && supportedLocales.includes(pathSegments[0] as typeof supportedLocales[number])) {
      // Path already has a locale, replace it
      newPathSegments = [nextLocale, ...pathSegments.slice(1)];
    } else {
      // Path does not have a locale (e.g., initial "/" if middleware redirects)
      newPathSegments = [nextLocale, ...pathSegments];
    }
    
    const newPath = `/${newPathSegments.join('/')}`;
    
    router.push(newPath);
  };

  return (
    <div className="language-switcher-container">
      <label htmlFor="language-select" className="sr-only">
        Select Language
      </label>
      <select
        id="language-select"
        value={currentLocale}
        onChange={onSelectChange}
        className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {supportedLocales.map((locale) => (
          <option key={locale} value={locale}>
            {/* You can display more user-friendly names here */}
            {locale === 'en' ? 'English' : locale === 'vi' ? 'Tiếng Việt' : locale}
          </option>
        ))}
      </select>
    </div>
  );
}