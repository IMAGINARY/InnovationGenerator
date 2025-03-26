/**
 * Init the fullscreen button and handlers.
 * @param buttonElem The button enable fullscreen mode.
 */
export function initFullscreenButton(buttonElem) {
  screenfull.on("change", () => {
    buttonElem.style.display = screenfull.isFullscreen ? "none" : "";
  });
  const event_names = [
    "mousedown",
    "mouseup",
    "touchstart",
    "touchend",
    "pointerdown",
    "pointerup",
  ];
  event_names.forEach((event_name) =>
    buttonElem.addEventListener(event_name, (event) => event.stopPropagation()),
  );
  buttonElem.addEventListener("click", (event) => {
    event.stopPropagation();
    screenfull.request();
  });
}
