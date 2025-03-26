/** @import { WordLists } from './typedefs.js' */

/**
 * Select a random word from each word list.
 * @param {WordLists} wordlists
 * @returns {string[]} The random n-gram.
 */
export function selectRandomNGram(wordlists) {
  const randomIndex = (length) => Math.floor(Math.random() * length);
  return wordlists.map((wordlist) => wordlist[randomIndex(wordlist.length)]);
}
