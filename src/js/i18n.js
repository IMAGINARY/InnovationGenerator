/**
 * Compute the list of fallback locales for the given locale.
 * @param {Intl.Locale} locale
 * @returns {Intl.Locale[]}
 */
export function fallbackLocales(locale) {
  const fallbackLocales = [];
  let localeTag = locale.baseName;
  while (localeTag.length !== 0) {
    fallbackLocales.push(new Intl.Locale(localeTag));
    localeTag = localeTag.substring(0, localeTag.lastIndexOf("-"));
  }
  return fallbackLocales;
}

/**
 * Select the best locale name from the list of available locales names.
 *
 * @param {Intl.Locale[]} locales Locales to select from.
 * @param {Intl.Locale} locale Local to search for.
 * @returns {number} The index of the best matching locale name or -1 if none found.
 */
export function indexOfLocale(locales, locale) {
  let localTag = locale.baseName;
  let localeBaseNames = locales.map((locale) => locale.baseName);
  while (localTag.length !== 0) {
    const index = localeBaseNames.indexOf(localTag);
    if (index !== -1) return index;

    // fallback to the local with the last subtag removed
    localTag = localTag.substring(0, localTag.lastIndexOf("-"));
  }
  return -1;
}

/**
 * Select the best locale from the list of available locales or null if none found.
 * @param {Intl.Locale[]} locales
 * @param {Intl.Locale} locale
 * @returns {Intl.Locale|null}
 */
export function selectLocale(locales, locale) {
  let localeIndex = indexOfLocale(locales, locale);
  return localeIndex !== -1 ? locales[localeIndex] : null;
}

/**
 * Retrieve translation of a word in the given locale.
 * @param {Word} translations
 * @param {Intl.Locale} locale
 * @param {Intl.Locale} [fallbackLocale]
 */
export function t(translations, locale, fallbackLocale) {
  if (typeof translations === "string") return translations;

  const localeKeys = Object.keys(translations);

  const locales = localeKeys.map((k) => new Intl.Locale(k));
  const localIndex = indexOfLocale(locales, locale);
  if (localIndex !== -1) return translations[localeKeys[localIndex]];

  if (typeof fallbackLocale === "undefined") {
    console.error(
      `No translation found for locale '${locale.baseName}' in `,
      translations,
    );
    return "�";
  }

  console.warn(
    `No translation found for locale '${locale.baseName}', falling back to '${fallbackLocale.baseName}':`,
    translations,
  );
  const fallbackLocaleIndex = indexOfLocale(locales, fallbackLocale);
  if (fallbackLocaleIndex !== -1)
    return translations[localeKeys[fallbackLocaleIndex]];

  console.error(
    `No translation found for locale '${locale.baseName}' (or the fallback '${fallbackLocale.baseName}') in `,
    translations,
  );
  return "�";
}
