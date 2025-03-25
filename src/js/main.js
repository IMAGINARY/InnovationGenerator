import {initRandomTitleGenerator} from "./rtg.js";

window.onload = () => {
    const searchParams = new URL(window.location.href).searchParams;

    // add QR code reflecting the URL of the this exhibit
    let qrcode_url = searchParams.get("qrcode");
    if (qrcode_url == null)
        qrcode_url = window.location.href;
    if (qrcode_url === "") {
        document.getElementById("qrcode").style.display = 'none';
    } else {
        const qrcode = new QRCode({
            content: qrcode_url,
            padding: 1,
            color: "#000000",
            background: "#ffffff",
            ecl: "M"
        });
        const svg = qrcode.svg();
        document.getElementById("qrcode").src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    // implement fullscreen toggle
    const fullscreen_toggle = document.getElementById('fullscreen_toggle');
    if (screenfull.enabled && (searchParams.get("fullscreen") !== "false")) {
        screenfull.on("change", () => {
            fullscreen_toggle.style.display = screenfull.isFullscreen ? "none" : "";
        });
        const event_names = ["mousedown", "mouseup", "touchstart", "touchend"];
        event_names.forEach(event_name => fullscreen_toggle.addEventListener(event_name, event => event.stopPropagation()));
        fullscreen_toggle.addEventListener('click', event => {
            event.stopPropagation();
            screenfull.request();
        });
    } else {
        fullscreen_toggle.style.display = 'none';
    }

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

    let words_file = searchParams.get("words");
    if (words_file === null) {
        words_file = 'steamhub';
    }
    if (words_file.match(/([^\w-])/) !== null) {
        throw new Error("words parameter must only include alphanumeric characters, hyphens (-) or underscores (_).");
    }
    const words_file_url = "wordlists/" + words_file + '.json';

    fetch(words_file_url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Unable to fetch the word list '" + words_file + "' (" + words_file_url + ").");
            } else {
                return response.json()
                    .then((json) => {
                        console.log("Using word list '" + words_file + "'':", json);
                        window.words = json;

                        const words_div = document.getElementById("words");
                        for (let i = 0; i < json.length; ++i) {
                            const div = document.createElement("div");
                            words_div.appendChild(div);
                        }

                        const capture_elem = document.getElementById("filler");
                        initRandomTitleGenerator(capture_elem, retrieveMode());
                    })
                    .catch((err) => console.log("Unable to parse word list '" + words_file + "' (" + words_file_url + ").", err));
            }
        })

}
