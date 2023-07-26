type FilterOptions = {
  emptyList?: boolean;
  list?: string[];
  placeHolder?: string;
  regex?: string;
  replaceRegex?: string;
  splitRegex?: string;
  keepFirstCharacter?: boolean;
};

class Filter {
  constructor(options?: FilterOptions);
  isProfane(word: string): boolean;
  replaceWord(word: string): string;
  filter(word: string): { filteredText: string; containsProfanity: boolean };
  clean(word: string): string;
  addWords(...words: string[]): void;
  removeWords(...words: string[]): void;
}

export default Filter;
