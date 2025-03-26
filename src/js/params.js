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
 * Fetch the JSON word list.
 * @param {string} wordListUrl - The word list URL.
 */
async function fetchWords(wordsFileUrl) {
  const response = await fetch(wordsFileUrl);

  if (!response.ok)
    throw new Error(
      `Unable to fetch the word list '${wordsFileUrl}' (HTTP ${response.status}: ${response.statusText}).`,
    );

  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Error parsing word list '${wordsFileUrl}'`, {
      cause: error,
    });
  }
}

/**
 * Validate the word list JSON.
 * @param {unknown} json - The word list object.
 * @returns {WordLists} - The validated word list.
 */
function validateWordLists(json) {
  // Validating the word list via JSON schema would be better,
  // I don't want to pull in JSON validator dependency.

  const error = new Error("Invalid word list format.");

  if (!Array.isArray(json)) throw error;

  for (const wordList of json) {
    if (!Array.isArray(wordList)) throw error;

    for (const word of wordList) {
      if (typeof word !== "string") throw error;
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

  return {
    wordListName,
    wordListUrl,
    wordListPromise,
    mode,
    fullscreen,
    qrcode,
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
  } = partiallyAsyncOptions;
  return {
    wordListName,
    wordListUrl,
    wordList: await wordListPromise,
    mode,
    fullscreen,
    qrcode,
  };
}
