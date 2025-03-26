/** @import { SpecialKeys, StepperMode, CallbackOrNot } from './typedefs.js' */

/**
 * Default special keys.
 * @type {SpecialKeys}
 */
const specialKeysDefault = {
  fullscreen: ["f"],
};

/**
 * Class for managing all input related events depending on the different modes of operation that are possible.
 */
export class InputManager {
  /**
   * @type {CallbackOrNot}
   */
  onlanguagechange;

  /**
   * @type {CallbackOrNot}
   */
  onfullscreenchange;

  /**
   * @type {CallbackOrNot}
   */
  onstartstepping;

  /**
   * @type {CallbackOrNot}
   */
  onstopstepping;

  /**
   * @param {StepperMode} mode
   * @param {{step: HTMLElement}} elements
   * @param {SpecialKeys} specialKeys
   * @param {() => boolean} isSteppingCallback - Callback to check if the stepper is running.
   */
  constructor(mode, elements, specialKeys = {}, isSteppingCallback) {
    specialKeys = {
      ...specialKeysDefault,
      ...Object.fromEntries(
        Object.entries(specialKeys).map((key, value) => [
          key,
          typeof value === "string" ? [...value] : value,
        ]),
      ),
    };

    const createEmitter = (callbackGetter) => {
      return () => {
        const callback = callbackGetter();
        if (typeof callback === "function") callback();
      };
    };
    const emitStartStepping = createEmitter(() => this.onstartstepping);
    const emitStopStepping = createEmitter(() => this.onstopstepping);
    const emitLanguageChange = createEmitter(() => this.onlanguagechange);
    const emitFullscreenChange = createEmitter(() => this.onfullscreenchange);

    // Capture special key events and stop propagation immediately such that
    // they don't trigger the stepping
    document.addEventListener("keydown", (keyEvent) => {
      if (keyEvent.repeat) return;

      if (specialKeys.fullscreen.includes(keyEvent.key)) {
        emitFullscreenChange();
        keyEvent.stopImmediatePropagation();
      }
    });

    const capture = false;

    const startOrStop = () =>
      isSteppingCallback() ? emitStopStepping() : emitStartStepping();
    let lastKey = "";
    const startOrStopWithDifferentKey = (key) => {
      if (key !== lastKey) {
        startOrStop();
        lastKey = key;
      }
    };

    switch (mode) {
      case "press_release":
        document.addEventListener("keydown", (keyEvent) => {
          if (!keyEvent.repeat) {
            emitStartStepping();
          }
        });
        document.addEventListener("keyup", emitStopStepping, capture);

        elements.step.addEventListener(
          "pointerdown",
          emitStartStepping,
          capture,
        );
        elements.step.addEventListener("pointerup", emitStopStepping, capture);
        break;
      case "press_press":
        document.addEventListener(
          "keydown",
          (keyEvent) => {
            if (!keyEvent.repeat) {
              startOrStop();
            }
          },
          capture,
        );

        elements.step.addEventListener("pointerdown", startStop, capture);
        break;
      case "release_release":
        document.addEventListener(
          "keyup",
          (keyEvent) => {
            if (!keyEvent.repeat) startOrStop();
          },
          capture,
        );

        elements.step.addEventListener("pointerup", startOrStop, capture);
        break;
      case "press_a_release_b":
        document.addEventListener(
          "keydown",
          (keyEvent) => {
            if (!keyEvent.repeat) {
              startOrStopWithDifferentKey(keyEvent.key);
            }
          },
          capture,
        );
        document.addEventListener(
          "keyup",
          (keyEvent) => {
            if (!keyEvent.repeat) {
              startOrStopWithDifferentKey(keyEvent.key);
            }
          },
          capture,
        );

        elements.step.addEventListener(
          "pointerdown",
          emitStartStepping,
          capture,
        );
        elements.step.addEventListener("pointerup", emitStopStepping, capture);
        break;
      case "press_a_press_b":
        document.addEventListener(
          "keydown",
          (keyEvent) => {
            if (!keyEvent.repeat) {
              startOrStopWithDifferentKey(keyEvent.key);
            }
          },
          capture,
        );

        elements.step.addEventListener("pointerdown", startOrStop, capture);
        break;
      case "release_a_release_b":
        document.addEventListener(
          "keyup",
          (keyEvent) => {
            if (!keyEvent.repeat) {
              startOrStopWithDifferentKey(keyEvent.key);
            }
          },
          capture,
        );

        elements.step.addEventListener("pointerup", startOrStop, capture);
        break;
      default:
        throw new Error(`Invalid operation mode: ${mode}`);
    }
  }
}
