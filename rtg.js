'use strict';

// some global settings
const mode = retrieveMode();
const maxDelay = 100;

function retrieveMode() {
    let mode = new URL(window.location.href).searchParams.get("mode");
    let valid_mode = false;
    ["press_release",
        "press_press",
        "release_release",
        "press_a_release_b",
        "press_a_press_b",
        "release_a_release_b"].forEach(e => valid_mode = valid_mode || e === mode);
    if (!valid_mode)
        mode = "press_release";
    return mode;
}

// global state
let animationFrameRequestId;
let cancelTimeout;
let currentDelay;
let lastDelayedAssignmentTimestamp;

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

function isRandomizing() {
    return animationFrameRequestId !== 0;
}

const startStop = () => {
    if (!isRandomizing())
        startRandomization();
    else
        stopRandomization();
};

const startStopWithKeyCode = (() => {
    this.lastKeyCode = -1;
    this.fun = keyCode => {
        if (!isRandomizing()) {
            startRandomization();
            this.lastKeyCode = keyCode;
        } else {
            if (this.lastKeyCode !== keyCode) {
                stopRandomization();
                this.lastKeyCode = -1;
            }
        }
    };
    return this.fun;
})();

if (mode === "press_release") {
    document.addEventListener('keydown', keyEvent => {
        if (!keyEvent.repeat) {
            startRandomization();
        }
    });
    document.addEventListener('keyup', stopRandomization);

    document.addEventListener('mousedown', startRandomization);
    document.addEventListener('mouseup', stopRandomization);

    document.addEventListener('touchstart', startRandomization);
    document.addEventListener('touchend', stopRandomization);
} else if (mode === "press_press") {
    document.addEventListener('keydown', keyEvent => {
        if (!keyEvent.repeat) {
            startStop();
        }
    });

    document.addEventListener('mousedown', startStop);
    document.addEventListener('touchstart', startStop);
} else if (mode === "release_release") {
    document.addEventListener('keyup', keyEvent => {
        if (!keyEvent.repeat) {
            startStop();
        }
    });

    document.addEventListener('mouseup', startStop);

    document.addEventListener('touchend', startStop);
} else if (mode === "press_a_release_b") {
    document.addEventListener('keydown', keyEvent => {
        if (!keyEvent.repeat) {
            startStopWithKeyCode(keyEvent.which);
        }
    });

    document.addEventListener('mousedown', startRandomization);
    document.addEventListener('mouseup', stopRandomization);

    document.addEventListener('touchstart', startRandomization);
    document.addEventListener('touchend', stopRandomization);
} else if (mode === "press_a_press_b") {
    document.addEventListener('keydown', keyEvent => {
        if (!keyEvent.repeat) {
            startStopWithKeyCode(keyEvent.which);
        }
    });

    document.addEventListener('mousedown', startStop);

    document.addEventListener('touchstart', startStop);
} else if (mode === "release_a_release_b") {
    document.addEventListener('keyup', keyEvent => {
        if (!keyEvent.repeat) {
            startStopWithKeyCode(keyEvent.which);
        }
    });

    document.addEventListener('mouseup', startStop);

    document.addEventListener('touchend', startStop);
} else {
    console.log(`invalid mode: ${mode}`);
}
