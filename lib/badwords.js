const localList = require('./lang.json').words;

class Filter {
  /**
   * Filter constructor.
   * @constructor
   * @param {object} options - Filter instance options
   * @param {boolean} options.emptyList - Instantiate filter with no blacklist
   * @param {array} options.list - Instantiate filter with custom list
   * @param {string} options.placeHolder - Character used to replace profane words.
   * @param {string} options.regex - Regular expression used to sanitize words before comparing them to blacklist.
   * @param {string} options.replaceRegex - Regular expression used to replace profane words with placeHolder.
   * @param {string} options.splitRegex - Regular expression used to split a string into words.
   * @param {boolean} options.keepFirstCharacter - Keep the first character of the bad word.
   */
  constructor(options = {}) {
    this.list = options.emptyList
      ? []
      : [...localList, ...(options.list || [])];
    this.exclude = options.exclude || [];
    this.splitRegex = options.splitRegex || /\b/;
    this.placeHolder = options.placeHolder || '*';
    this.regex = options.regex || /[^a-zA-Z0-9$@^]/g;
    this.replaceRegex = options.replaceRegex || /\w/g;
    this.keepFirstCharacter = options.keepFirstCharacter || false;
  }

  /**
   * Determine if a string contains profane language.
   * @param {string} string - String to evaluate for profanity.
   */
  isProfane(string) {
    return this.list.some((word) => {
      // Detects exact bad word matches (i.e. bad) and concatenations of bad words (i.e. badbad)
      const wordExp = new RegExp(
        `\\b(${word.replace(/(\W)/g, '\\$1')})+\\b`,
        'gi'
      );
      return !this.exclude.includes(word.toLowerCase()) && wordExp.test(string);
    });
  }

  /**
   * Replace a word with placeHolder characters;
   * @param {string} string - String to replace.
   */
  replaceWord(string) {
    const replacement = string.replace(this.regex, '');
    const firstCharacter = replacement[0];

    if (this.keepFirstCharacter)
      return firstCharacter + this.placeHolder.repeat(replacement.length - 1);
    return this.placeHolder.repeat(replacement.length);
  }

  /**
   * Evaluate a string for profanity and return an edited version.
   * @param {string} string - Sentence to filter.
   */
  clean(string) {
    return string
      .split(this.splitRegex)
      .map((word) => {
        return this.isProfane(word) ? this.replaceWord(word) : word;
      })
      .join(this.splitRegex.exec(string)[0]);
  }

  /**
   * Add word(s) to blacklist filter / remove words from whitelist filter
   * @param {...string} word - Word(s) to add to blacklist
   */
  addWords(...words) {
    this.list.push(...words);

    words
      .map((word) => word.toLowerCase())
      .forEach((word) => {
        if (this.exclude.includes(word)) {
          this.exclude.splice(this.exclude.indexOf(word), 1);
        }
      });
  }

  /**
   * Add words to whitelist filter
   * @param {...string} word - Word(s) to add to whitelist.
   */
  removeWords(...words) {
    this.exclude.push(...words.map((word) => word.toLowerCase()));
  }
}

module.exports = Filter;
