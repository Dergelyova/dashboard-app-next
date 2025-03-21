import { cache } from 'react';
import { createInstance } from 'i18next';
import { cookies as getCookies } from 'next/headers';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';

import { defaultNS, cookieName, i18nOptions, fallbackLng } from './locales-config';

// ----------------------------------------------------------------------

/**
 * Internationalization configuration for Next.js server-side.
 *
 * Supports two approaches for language handling:
 *
 * 1. URL-based routing (Next.js default)
 *    - Languages are part of the URL path
 *    - Example: /en/about, /fr/about
 *    - @see {@link https://nextjs.org/docs/pages/building-your-application/routing/internationalization}
 *
 * 2. Cookie-based routing
 *    - Language preference stored in cookies
 *    - No URL modification required
 *    - @see {@link https://github.com/i18next/next-app-dir-i18next-example/issues/12#issuecomment-1500917570}
 *
 * Current implementation uses approach #2 (Cookie-based)
 */

export async function detectLanguage() {
  const cookies = getCookies();

  const language = cookies.get(cookieName)?.value ?? fallbackLng;

  return language;
}

// ----------------------------------------------------------------------

export const getServerTranslations = cache(async (ns = defaultNS, options = {}) => {
  try {
    // Detect the user's language
    const language = await detectLanguage();
    if (!language) {
      console.error('No language detected');
      throw new Error('Failed to detect language');
    }

    // Initialize the i18next instance
    const i18nextInstance = await initServerI18next(language, ns);
    if (!i18nextInstance) {
      console.error('Failed to initialize i18next instance');
      throw new Error('i18next instance initialization failed');
    }

    // Return the translation function and i18next instance
    return {
      t: i18nextInstance.getFixedT(language, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
      i18n: i18nextInstance,
    };
  } catch (error) {
    // Log the error and rethrow it
    console.error('Error in getServerTranslations:', error);
    throw error;
  }
});

// ----------------------------------------------------------------------

const initServerI18next = async (language, namespace) => {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((lang, ns) => import(`./langs/${lang}/${ns}.json`)))
    .init(i18nOptions(language, namespace));

  return i18nInstance;
};
