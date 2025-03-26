/** @import { CallbackOrNot } from './typedefs.js' */

export class Stepper {
  /**
   * @type {CallbackOrNot}
   */
  onstart;

  /**
   * @type {CallbackOrNot}
   */
  onstep;

  /**
   * @type {CallbackOrNot}
   */
  onstop;

  /**
   * @type {number}
   * @protected
   */
  maxDelay;

  /**
   * @type {number}
   * @protected
   */
  timeoutId;

  /**
   * @type {number}
   * @protected
   */
  currentDelay;

  /**
   * @param {number} maxDelay
   */
  constructor(maxDelay = 200) {
    this.maxDelay = maxDelay;
    this.reset();
  }

  /**
   * Reset the stepper so it can restart.
   * @protected
   */
  reset() {
    this.timeoutId = 0;
    this.currentDelay = this.maxDelay;
  }

  /**
   * Start the stepper.
   */
  start() {
    if (this.isRunning()) this.stop();
    if (typeof this.onstart === "function") this.onstart();
    this.step();
  }

  /**
   * Step the stepper.
   * @protected
   */
  step() {
    if (typeof this.onstep === "function") this.onstep();
    this.currentDelay = Math.max(0.0, this.currentDelay - 0.1 * this.maxDelay);
    this.timeoutId = setTimeout(this.step.bind(this), this.currentDelay);
  }

  /**
   * Stop the stepper.
   */
  stop() {
    clearTimeout(this.timeoutId);
    this.reset();

    if (typeof this.onstop === "function") this.onstop();
  }

  /**
   * Check if the stepper is running.
   * @returns {boolean} Whether the stepper is running.
   */
  isRunning() {
    return this.timeoutId !== 0;
  }
}
