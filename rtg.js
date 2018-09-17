'use strict';

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function assignRandomWords() {
    document.getElementById("adjective").innerText = words.adjectives[getRandomInt(words.adjectives.length)];
    document.getElementById("method").innerText = words.methods[getRandomInt(words.methods.length)];
    document.getElementById("format").innerText = words.formats[getRandomInt(words.formats.length)];
}

function assignRandomWordsWithDelay(currentTimestamp) {
    if (currentTimestamp - lastDelayedAssignmentTimestamp >= currentDelay) {
        assignRandomWords();
        currentDelay = Math.max(0.0, currentDelay - 0.1 * maxDelay);
        lastDelayedAssignmentTimestamp = currentTimestamp;
    }
    animationFrameRequestId = window.requestAnimationFrame(assignRandomWordsWithDelay);
}

const maxDelay = 100;

let animationFrameRequestId;
let cancelTimeout;
let currentDelay;
let lastDelayedAssignmentTimestamp;

function reset() {
    animationFrameRequestId = 0;
    cancelTimeout = 0;
    currentDelay = maxDelay;
    lastDelayedAssignmentTimestamp = 0;
}

reset();


function startRandomization() {
    stopRandomization();
    console.log("start");
    document.getElementById("words").classList.add("randomizing");
    assignRandomWords();
    animationFrameRequestId = window.requestAnimationFrame(assignRandomWordsWithDelay);
    lastDelayedAssignmentTimestamp = performance.now();
    cancelTimeout = window.setTimeout(stopRandomization, 10 * 1000);
}

function stopRandomization() {
    console.log("stop");
    window.clearTimeout(cancelTimeout);
    window.cancelAnimationFrame(animationFrameRequestId);
    reset();
    document.getElementById("words").classList.remove("randomizing");
}

document.addEventListener('keydown', keyEvent => {
    if (!keyEvent.repeat) {
        startRandomization()
    }
});
document.addEventListener('keyup', stopRandomization);

document.addEventListener('mousedown', startRandomization);
document.addEventListener('mouseup', stopRandomization);
