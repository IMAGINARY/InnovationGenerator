'use strict';

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function assignRandomWords() {
    document.getElementById("adjective").innerText = words.adjectives[getRandomInt(words.adjectives.length)];
    document.getElementById("method").innerText = words.methods[getRandomInt(words.methods.length)];
    document.getElementById("format").innerText = words.formats[getRandomInt(words.formats.length)];
}

function assignRandomWordsWithDelay()
{
    if(delayCounter==delayMax) {
        assignRandomWords();
        delayCounter = 0;
        if( delayMax != 0)
            delayMax--;
    } else {
        delayCounter++;
    }
}

let intervalTimer;
let cancelTimeout;
let delayMax;
let delayCounter;

function reset() {
    intervalTimer = 0;
    cancelTimeout = 0;
    delayMax = 10;
    delayCounter = 0;
}
reset();

function startRandomization() {
    stopRandomization();
    console.log("start");
    document.getElementById("words").classList.add("randomizing");
    assignRandomWords();
    intervalTimer = window.setInterval(assignRandomWordsWithDelay, 10);
    cancelTimeout = window.setTimeout(stopRandomization, 10 * 1000);
}

function stopRandomization() {
    console.log("stop");
    window.clearTimeout(cancelTimeout)
    window.clearInterval(intervalTimer);
    reset();
    document.getElementById("words").classList.remove("randomizing");
}

document.addEventListener('keydown', keyEvent => {
    if (!keyEvent.repeat) {startRandomization()}
});
document.addEventListener('keyup', stopRandomization);

document.addEventListener('mousedown', startRandomization);
document.addEventListener('mouseup', stopRandomization);
