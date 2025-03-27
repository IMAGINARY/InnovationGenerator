/** @import { WordLists, PartiallyAsyncOptions, Option, StepperMode } from './typedefs.js' */

const defaultParams = {
  words: "steamhub",
  mode: "press_release",
  fullscreen: true,
  qrcode: window.location.href,
};

/**
 * Extract and process the word list name from the URL search parameters.
 * @param {URLSearchParams} params - The URL search parameters.
 */
function processWordsParam(params) {
  const wordsFile = params.get("words") ?? defaultParams.words;
  if (wordsFile.match(/([^\w-])/) !== null) {
    throw new Error(
      "words parameter must only include alphanumeric characters, hyphens (-) or underscores (_).",
    );
  }
  return wordsFile;
}

/**
 * Turn the word list name into a URL.
 * @param {string} wordListName - The word list name.
 */
function wordListNameToUrl(wordListName) {
  const wordsFileUrl = new URL(
    `wordlists/${wordListName}.json`,
    window.location.href,
  );
  return wordsFileUrl;
}

/**
 * Fetch the JSON word lists.
 * @param {string} wordListUrl - The word lists URL.
 */
async function fetchWords(wordsFileUrl) {
  const response = await fetch(wordsFileUrl);

  if (!response.ok)
    throw new Error(
      `Unable to fetch the word lists '${wordsFileUrl}' (HTTP ${response.status}: ${response.statusText}).`,
    );

  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Error parsing word lists '${wordsFileUrl}'`, {
      cause: error,
    });
  }
}

/**
 * Fetch the JSON Schema of the word lists.
 */
async function fetchWordListSchema() {
  const schemaUrl = new URL(
    "src/json-schema/wordlists.schema.json",
    window.location.href,
  );
  const response = await fetch(schemaUrl);

  if (!response.ok)
    throw new Error(
      `Unable to fetch the word list schema '${schemaUrl}' (HTTP ${response.status}: ${response.statusText}).`,
    );

  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Error parsing word list schema '${schemaUrl}'`, {
      cause: error,
    });
  }
}

/**
 * Validate the word list JSON.
 * @param {unknown} json - The word list object.
 * @returns {WordLists} - The validated word list.
 */
async function validateWordLists(json) {
  const wordListSchema = await fetchWordListSchema();

  const Ajv = window.ajv7;
  const ajv = new Ajv();

  const validate = ajv.compile(wordListSchema);
  if (!validate(json)) {
    console.error("Validation errors:", validate.errors);
    throw new Error("Invalid wordlists format.");
  }

  for (let i = 0; i < json.length; i++) {
    const wordList = json[i];
    for (let j = 0; j < wordList.length; j++) {
      const word = wordList[j];
      if (typeof word !== "string") {
        // The word is an object, so it must be a dictionary of translations
        Object.keys(word).forEach((localeName, i) => {
          try {
            new Intl.Locale(localeName);
          } catch (error) {
            throw new Error(
              `Invalid locale name '${localeName}' in word ${j} of word list ${i}.`,
            );
          }
        });
      }
    }
  }

  return json;
}

/**
 * Extract and process the operation mode from the URL search parameters.
 * @param {URLSearchParams} params - The URL search parameters.
 * @returns {StepperMode} - The operation mode.
 */
function processModeParam(params) {
  const modes = [
    "press_release",
    "press_press",
    "release_release",
    "press_a_release_b",
    "press_a_press_b",
    "release_a_release_b",
  ];
  const providedMode = params.get("mode");
  const mode = modes.includes(providedMode) ? providedMode : defaultParams.mode;
  return mode;
}

/**
 * Extract and process the fullscreen option from the URL search parameters.
 * @param {URLSearchParams} params - The URL search parameters.
 */
function processFullscreenParam(params) {
  const providedParam = params.get("fullscreen");
  return providedParam === null
    ? defaultParams.fullscreen
    : providedParam !== "false";
}

/**
 * Extract and process the QR code option from the URL search parameters.
 * @param {URLSearchParams} params - The URL search parameters.
 */
function processQrCodeParam(params) {
  const providedParam = params.get("qrcode");
  return providedParam === null
    ? defaultParams.qrcode
    : providedParam === ""
      ? false
      : providedParam;
}

/**
 * Extract and process the languages option from the URL search parameters
 * using the languages found in the word lists as a fallback.
 * @param {URLSearchParams} params
 * @param {WordLists} wordLists
 * @returns {Intl.Locale[]}
 */
function processLanguagesParams(params, wordLists) {
  const wordLocaleNameSet = new Set();
  wordLists.forEach((wordList) =>
    wordList.forEach((word) => {
      if (typeof word === "string") {
        return;
      }
      Object.keys(word).forEach((k) => {
        const localeName = new Intl.Locale(k).baseName;
        wordLocaleNameSet.add(localeName);
      });
    }),
  );
  const wordLocaleNames = Array.from(wordLocaleNameSet);

  const providedParam = params.get("languages");
  if (providedParam === null || providedParam === "") {
    // if no language list is provided, return all the languages found in the word lists
    console.info(`Using locales found in word lists:`, wordLocaleNames);
    return wordLocaleNames.map((n) => new Intl.Locale(n));
  }

  // parse provided language list
  const parsedLocales = providedParam
    .split(",")
    .map((localeName) => new Intl.Locale(localeName));
  console.info(
    `Using locales provided in 'languages' parameter:`,
    parsedLocales.map((l) => l.baseName),
  );
  return parsedLocales;
}

/**
 * Extract and process the language option from the URL search parameters.
 * @param {URLSearchParams} params
 * @returns {Intl.Locale}
 */
function processLanguageParam(params) {
  const providedParam = params.get("language");
  const locale = new Intl.Locale(providedParam ?? navigator.language);
  return locale;
}

/**
 * Extract and process the fallback language option from the URL search parameters.
 * @param {URLSearchParams} params
 * @returns {Intl.Locale}
 */
function processFallbackLanguageParam(params) {
  const providedParam = params.get("fallbackLanguage");
  const fallbackLocale = new Intl.Locale(providedParam ?? navigator.language);
  return fallbackLocale;
}

/**
 * Parse the URL parameters and return an object with the options.
 * Some of the options are async, so they are returned as promises.
 *
 * @param {URLSearchParams} params - The URL search parameters.
 * @returns {PartiallyAsyncOptions} - The (partially asynchronous) options object.
 */
export function processParams(
  params = new URLSearchParams(window.location.search),
) {
  const wordListName = processWordsParam(params);
  const wordListUrl = wordListNameToUrl(wordListName);
  const wordListPromise = fetchWords(wordListUrl).then(validateWordLists);
  const mode = processModeParam(params);
  const fullscreen = processFullscreenParam(params);
  const qrcode = processQrCodeParam(params);
  const localesPromise = wordListPromise.then((wordList) =>
    processLanguagesParams(params, wordList),
  );
  const locale = processLanguageParam(params);
  const fallbackLocale = processFallbackLanguageParam(params);

  return {
    wordListName,
    wordListUrl,
    wordListPromise,
    mode,
    fullscreen,
    qrcode,
    localesPromise,
    locale,
    fallbackLocale,
  };
}

/**
 * Asynchronously resolve the properties that are promises and return a promise with the final options object.
 * @param partiallyAsyncOptions
 * @returns {Promise<Options>}
 */
export async function syncOptions(partiallyAsyncOptions) {
  const {
    wordListName,
    wordListUrl,
    wordListPromise,
    mode,
    fullscreen,
    qrcode,
    localesPromise,
    locale,
    fallbackLocale,
  } = partiallyAsyncOptions;
  return {
    wordListName,
    wordListUrl,
    wordList: await wordListPromise,
    mode,
    fullscreen,
    qrcode,
    locales: await localesPromise,
    locale,
    fallbackLocale,
  };
}
