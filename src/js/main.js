import { processParams, syncOptions } from "./params.js";
import { ready } from "./ready.js";
import { generateQRCodeSVGDataUri } from "./qr-code.js";
import { initFullscreenButton } from "./fullscreen.js";
import { selectRandomNGram } from "./select-random-n-gram.js";
import { Stepper } from "./stepper.js";
import { InputManager } from "./input-manager.js";

function exchangeWords(wordDivs, words) {
  wordDivs.childNodes.forEach((div, i) => {
    div.textContent = words[i];
  });
}

async function main(asyncOptions) {
  const options = await syncOptions(asyncOptions);

  // add QR code (reflecting the current URL or user-provided data)
  const qrCodeElem = document.getElementById("qrcode");
  if (options.qrcode === false) {
    qrCodeElem.style.display = "none";
  } else {
    qrCodeElem.src = generateQRCodeSVGDataUri(options.qrcode);
  }

  const fullscreenButton = document.getElementById("fullscreen_toggle");
  if (options.fullscreen) {
    initFullscreenButton(fullscreenButton);
  } else {
    fullscreenButton.style.display = "none";
  }

  const wordDivs = document.getElementById("words");
  for (let i = 0; i < options.wordList.length; ++i) {
    const div = document.createElement("div");
    wordDivs.appendChild(div);
  }

  const pointerInputElem = document.getElementById("words-container");

  const randomize = () =>
    exchangeWords(wordDivs, selectRandomNGram(options.wordList));
  randomize();

  const stepper = new Stepper();
  stepper.onstart = () => document.body.classList.add("running");
  stepper.onstep = randomize;
  stepper.onstop = () => document.body.classList.remove("running");

  const inputManagerElements = {
    step: pointerInputElem,
  };
  const inputManager = new InputManager(
    options.mode,
    inputManagerElements,
    {},
    stepper.isRunning.bind(stepper),
  );

  inputManager.onfullscreenchange = screenfull.toggle.bind(screenfull);
  inputManager.onstartstepping = stepper.start.bind(stepper);
  inputManager.onstopstepping = stepper.stop.bind(stepper);
}

const asyncOptions = processParams();
ready().then(async () => main(asyncOptions));
