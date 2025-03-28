/** @import { Word, PartiallyAsyncOptions } from './typedefs.js' */
import { processParams, syncOptions } from "./params.js";
import { ready } from "./ready.js";
import { generateQRCodeSVGDataUri } from "./qr-code.js";
import { initFullscreenButton } from "./fullscreen.js";
import { selectRandomNGram } from "./select-random-n-gram.js";
import { t, indexOfLocale, fallbackLocales } from "./i18n.js";
import { Stepper } from "./stepper.js";
import { InputManager } from "./input-manager.js";

/**
 * Load the theme.
 * @param {URL} themeUrl
 */
function loadTheme(themeUrl) {
  const linkElem = document.createElement("link");
  linkElem.href = themeUrl;
  linkElem.rel = "stylesheet";
  linkElem.media = "all";
  linkElem.type = "text/css";

  document.head.appendChild(linkElem);
}

/**
 * Exchange the words in the given divs with the words in the given array respecting the given locale and fallback locale.
 * @param {HTMLElement[]} wordDivs
 * @param {Word[]} words
 * @param {Intl.Locale} locale
 * @param {Intl.Locale} fallbackLocale
 */
function exchangeWords(wordDivs, words, locale, fallbackLocale) {
  wordDivs.forEach((div, i) => {
    div.textContent = t(words[i], locale, fallbackLocale);
  });
}

/**
 * Main function.
 * @param {PartiallyAsyncOptions} asyncOptions
 * @returns {Promise<void>}
 */
async function main(asyncOptions) {
  const options = await syncOptions(asyncOptions);

  // add QR code (reflecting the current URL or user-provided data)
  const qrCodeElem = document.getElementById("qrcode");
  if (options.qrcode === false) {
    qrCodeElem.style.display = "none";
  } else {
    qrCodeElem.src = generateQRCodeSVGDataUri(options.qrcode);
  }

  const fullscreenButtonElem = document.getElementById("fullscreen-button");
  if (options.fullscreenButton) {
    initFullscreenButton(fullscreenButtonElem);
  } else {
    fullscreenButtonElem.style.display = "none";
  }

  const languageButtonElem = document.getElementById("language-button");
  if (!options.languageButton) languageButtonElem.style.display = "none";

  const wordDivContainer = document.getElementById("words");
  const wordDivs = [];
  for (let i = 0; i < options.wordList.length; ++i) {
    const div = document.createElement("div");
    wordDivContainer.appendChild(div);
    wordDivs.push(div);
  }

  const pointerInputElem = document.getElementById("words-container");

  let locales = options.locales;
  let localeIndex = indexOfLocale(locales, options.locale);
  let locale = localeIndex !== -1 ? locales[localeIndex] : options.locale;
  let nGram;
  const randomize = () => {
    nGram = selectRandomNGram(options.wordList);
    exchangeWords(wordDivs, nGram, locale, options.fallbackLocale);
  };
  randomize();

  const setLocale = (i) => {
    // Remove the previous locale's CSS classes
    fallbackLocales(locale).forEach((fallbackLocale) => {
      document.body.classList.remove(`locale-${fallbackLocale.baseName}`);
    });

    localeIndex = 0 <= i && i < locales.length ? i : -1;
    locale = localeIndex !== -1 ? locales[localeIndex] : options.locale;

    // Add the new locale's CSS classes
    fallbackLocales(locale).forEach((fallbackLocale) => {
      document.body.classList.add(`locale-${fallbackLocale.baseName}`);
    });

    console.log(`Switching to locale ${localeIndex}: '${locale.baseName}'`);
    exchangeWords(wordDivs, nGram, locale, options.fallbackLocale);
  };
  setLocale(localeIndex);

  const nextLocale = () => setLocale((localeIndex + 1) % locales.length);

  const stepper = new Stepper();
  stepper.onstart = () => document.body.classList.add("running");
  stepper.onstep = randomize;
  stepper.onstop = () => document.body.classList.remove("running");

  const inputManagerElements = {
    step: pointerInputElem,
    language: languageButtonElem,
  };
  const inputManager = new InputManager(
    options.mode,
    inputManagerElements,
    {},
    stepper.isRunning.bind(stepper),
  );

  inputManager.onfullscreenchange = screenfull.toggle.bind(screenfull);
  inputManager.onlanguagechange = nextLocale;
  inputManager.onstartstepping = stepper.start.bind(stepper);
  inputManager.onstopstepping = stepper.stop.bind(stepper);
}

const asyncOptions = processParams();
loadTheme(asyncOptions.themeUrl);

ready()
  .then(async () => main(asyncOptions))
  .catch((err) => console.error(err));
