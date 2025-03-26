/**
 * Wait for the DOM to be(come) ready.
 * @returns {Promise<void>}
 */
export async function ready() {
  return new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", () => resolve());
    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    )
      resolve();
  });
}
