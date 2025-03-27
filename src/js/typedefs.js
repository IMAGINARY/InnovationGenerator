/**
 * Word data type.
 * @typedef {string|Object.<string, string>} Word
 */

/**
 * Word list data type.
 * @typedef {Word[][]} WordLists
 */

/**
 * @typedef {("press_release"|"press_press"|"release_release"|"press_a_release_b"|"press_a_press_b"|"release_a_release_b")} StepperMode
 */

/**
 * Partially asynchronous options (some options are promises).
 * @typedef {Object} PartiallyAsyncOptions
 * @property {string} wordListsName
 * @property {URL} wordListsUrl
 * @property {Promise<WordLists>} wordListsPromise
 * @property {StepperMode} mode
 * @property {boolean} fullscreen
 * @property {string | false} qrcode
 * @property {Intl.Locale[]} localesPromise
 * @property {Intl.Locale} locale
 * @property {Intl.Locale} fallbackLocale
 */

/**
 * Options.
 * @typedef {Object} Options
 * @property {string} wordListsName
 * @property {URL} wordListsUrl
 * @property {WordLists} wordLists
 * @property {StepperMode} mode
 * @property {boolean} fullscreen
 * @property {string | false} qrcode
 * @property {Intl.Locale[]} locales
 * @property {Intl.Locale} locale
 * @property {Intl.Locale} fallbackLocale
 */

/**
 * Keys that are used for special actions and don't trigger stepping.
 * @typedef {Object} SpecialKeys
 * @property {string[]} fullscreen
 */

/**
 * Type for callback functions that can also be undefined or null.
 * @typedef {Function|undefined|null} CallbackOrNot
 */
