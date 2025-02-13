type FilterOptions = {
  emptyList?: boolean;
  list?: string[];
  placeHolder?: string;
  regex?: RegExp | string;
  replaceRegex?: RegExp | string;
  splitRegex?: RegExp | string;
};

declare class Filter {
  constructor(options?: FilterOptions);
  isProfane(word: string): boolean;
  replaceWord(word: string): string;
  filter(word: string): { filteredText: string; containsProfanity: boolean };
  clean(word: string): string;
  addWords(...words: string[]): void;
  removeWords(...words: string[]): void;
}

export default Filter;
