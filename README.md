# Innovation Generator

The ultimate Monte-Carlo driven innovation idea generator for start-ups, entrepreneurs and all who are looking for the brand-new novel idea to implement! Just press a button and get your idea for a worldwide innovation.

## Technical description

A random title generator which displays three words in a row (an adjective, an explaining middle noun and a final end noun), pre-filled with ideas in the field of STEAM (sciences, technology, engineering, arts, mathematics) communication.
It can be setup in Full Screen Mode, and also works on mobile phones.

This generator was implemented for the project STEAM Hub (www.steam-hub.com) and is used at the STEAM Hub conference in connection with a “red button buzzer” that triggers the idea generator. It is used to assist the idea finding brainstorming process in a motivating humorous way.

### Usage

#### Configuration
Configuration is done via URL parameters:
 
 - `mode`: Defined how keyboard buttons, mouse buttons and touch screen touch trigger the randomization process. Possible values are `press_release` (the default), `press_press`, `release_release`, `press_a_release_b`, `press_a_press_b` and `release_a_release_b`. In `*_a_*b` mode, consecutive keyboard events need to originate from different keys. This is sometimes useful to connect with external buttons that send key presses on both, button down *and* up.
 - `fullscreen`: Disables fullscreen if set to `false`.
 - `qrcode`: The URL the code should point to. Set to empty to hide the QR code. Note that that special characters in the  URL might need to be escaped.
 
#### Adding words
Additional words can be added to `words.js`. 

#### License

This project is licensed under the Apache v2.0 license. See the `LICENSE` file for the license text.