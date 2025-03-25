'use strict';

// some global settings
const maxDelay = 200;

// global state
let animationFrameRequestId;
let cancelTimeout;
let currentDelay;
let lastDelayedAssignmentTimestamp;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function assignRandomWords() {
    const word_divs = document.querySelectorAll("#words > div");
    for(let i = 0; i < word_divs.length; ++i) {
        word_divs[i].innerText = words[i][getRandomInt(words[i].length)];
    }
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

function startRandomization() {
    stopRandomization();
    console.log("start");
    document.getElementById("words").classList.add("randomizing");
    assignRandomWords();
    animationFrameRequestId = window.requestAnimationFrame(assignRandomWordsWithDelay);
    lastDelayedAssignmentTimestamp = performance.now();
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
    let lastKeyCode = -1;
    const fun = keyCode => {
        if (!isRandomizing()) {
            startRandomization();
            this.lastKeyCode = keyCode;
        } else {
            if (this.lastKeyCode !== keyCode) {
                stopRandomization();
                lastKeyCode = -1;
            }
        }
    };
    return fun;
})();

export function initRandomTitleGenerator(capture_elem, mode) {
    reset();
    assignRandomWords();

    const capture = false;

    if (mode === "press_release") {
        document.addEventListener('keydown', keyEvent => {
            if (!keyEvent.repeat) {
                startRandomization();
            }
        });
        document.addEventListener('keyup', stopRandomization, capture);

        capture_elem.addEventListener('pointerdown', startRandomization, capture);
        capture_elem.addEventListener('pointerup', stopRandomization, capture);
    } else if (mode === "press_press") {
        document.addEventListener('keydown', keyEvent => {
            if (!keyEvent.repeat) {
                startStop();
            }
        }, capture);

        capture_elem.addEventListener('pointerdown', startStop, capture);
    } else if (mode === "release_release") {
        document.addEventListener('keyup', keyEvent => {
            if (!keyEvent.repeat) {
                startStop();
            }
        }, capture);

        capture_elem.addEventListener('pointerup', startStop, capture);
    } else if (mode === "press_a_release_b") {
        document.addEventListener('keydown', keyEvent => {
            if (!keyEvent.repeat) {
                startStopWithKeyCode(keyEvent.which);
            }
        }, capture);

        capture_elem.addEventListener('pointerdown', startRandomization, capture);
        capture_elem.addEventListener('pointerup', stopRandomization, capture);
    } else if (mode === "press_a_press_b") {
        document.addEventListener('keydown', keyEvent => {
            if (!keyEvent.repeat) {
                startStopWithKeyCode(keyEvent.which);
            }
        }, capture);

        capture_elem.addEventListener('pointerdown', startStop, capture);
    } else if (mode === "release_a_release_b") {
        document.addEventListener('keyup', keyEvent => {
            if (!keyEvent.repeat) {
                startStopWithKeyCode(keyEvent.which);
            }
        }, capture);

        capture_elem.addEventListener('pointerup', startStop, capture);
    } else {
        console.log(`invalid mode: ${mode}`);
    }
}
