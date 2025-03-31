# Innovation Generator

The ultimate Monte-Carlo driven innovation idea generator for start-ups, entrepreneurs and all who are looking for the brand-new novel idea to implement! Just press a button and get your idea for a worldwide innovation.

Give it a try at [https://imaginary.github.io/InnovationGenerator/](https://imaginary.github.io/InnovationGenerator/?qrcode=)

## Technical description

A random title generator which displays three words in a row (an adjective, an explaining middle noun and a final end noun), pre-filled with ideas in the field of STEAM (sciences, technology, engineering, arts, mathematics) communication.
It can be setup in Full Screen Mode, and also works on mobile phones.

This generator was implemented for the project STEAM Hub (www.steam-hub.com) and is used at the STEAM Hub conference in connection with a “red button buzzer” that triggers the idea generator. It is used to assist the idea finding brainstorming process in a motivating humorous way.

### Usage

#### Configuration

Configuration is done via URL parameters:

- `words`: Set the name of the words list. Default is `default` (a copy of `steamhub` for legacy reasons). Word lists will be retrieved from the `wordlist` directory. The extension `.json` is appended. E.g. the word list `steamhub` is requested from `./wordlist/steamhub.json`.
- `mode`: Defined how keyboard buttons, mouse buttons and touch screen touch trigger the randomization process. Possible values are `press_release` (the default), `press_press`, `release_release`, `press_a_release_b`, `press_a_press_b` and `release_a_release_b`. In `*_a_*b` mode, consecutive keyboard events need to originate from different keys. This is sometimes useful to connect with external buttons that send key presses on both, button down _and_ up.
- `fullscreenButton`: Hides the fullscreen button if set to `false`. (For backwards-compatibility, the previous `fullscreen` option name is still supported.)
- `qrcode`: The URL the code should point to. Set to empty to hide the QR code. Note that that special characters in the URL might need to be escaped.
- `language`: The language to start the generator in.
- `languages`: A comma separated list of languages to cycle through.
- `fallbackLanguage`: The language to fall back to if the selected word is not available in the current language.
- `languageButton`: If not set to `false` and there are multiple languages, display a button to cycle through the languages.
- `theme`: Name of the theme to use. Themes are loaded from the `themes` directory. The extension `.css` is appended. E.g. the theme `default` is requested from `./themes/default.css`.

#### Adding words

Additional words can be added as JSON files to the `wordlists` folder. Localization is supported. See [`wordlists/test-i18n.json`](wordlists/test-i18n.json) for an example.

#### License

This project is licensed under the Apache v2.0 license. See the `LICENSE` file for the license text.
