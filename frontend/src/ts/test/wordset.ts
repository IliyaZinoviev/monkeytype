import { zipfyRandomArrayIndex } from "../utils/misc";
import { randomElementFromArray, shuffle } from "../utils/arrays";

export type FunboxWordsFrequency = "normal" | "zipf";

let currentWordset: Wordset | null = null;

export type IWordset = {
  readonly length: number;
  resetIndexes(): void;
  randomWord(mode: FunboxWordsFrequency): string;
  shuffledWord(): string;
  nextWord(): string;
  get(): string[];
  reverse(): string[];
  some(
    predicate: (value: string, index: number, array: string[]) => boolean,
  ): boolean;
};

export abstract class AbstractWordset<T> implements IWordset {
  abstract readonly words: T;
  abstract readonly length: number;

  abstract resetIndexes(): void;
  abstract randomWord(mode: FunboxWordsFrequency): string;
  abstract shuffledWord(): string;
  abstract nextWord(): string;
  abstract get(): string[];
  abstract reverse(): string[];
  abstract some(
    predicate: (value: string, index: number, array: string[]) => boolean,
  ): boolean;
}

export class Wordset extends AbstractWordset<string[]> {
  readonly words: string[];
  private orderedIndex: number = 0;
  private shuffledIndexes: number[] = [];

  constructor(words: string[]) {
    super();
    this.words = words;
  }

  get length(): number {
    return this.words.length;
  }

  resetIndexes(): void {
    this.orderedIndex = 0;
    this.shuffledIndexes = [];
  }

  randomWord(mode: FunboxWordsFrequency): string {
    if (mode === "zipf") {
      return this.words[zipfyRandomArrayIndex(this.words.length)] as string;
    } else {
      return randomElementFromArray(this.words);
    }
  }

  shuffledWord(): string {
    if (this.shuffledIndexes.length === 0) {
      this.generateShuffledIndexes();
    }
    return this.words[this.shuffledIndexes.pop() as number] as string;
  }

  private generateShuffledIndexes(): void {
    this.shuffledIndexes = [];
    for (let i = 0; i < this.length; i++) {
      this.shuffledIndexes.push(i);
    }
    shuffle(this.shuffledIndexes);
  }

  nextWord(): string {
    if (this.orderedIndex >= this.length) {
      this.orderedIndex = 0;
    }
    return this.words[this.orderedIndex++] as string;
  }

  get(): string[] {
    return this.words;
  }

  reverse(): string[] {
    return this.words.reverse();
  }

  some(
    predicate: (value: string, index: number, array: string[]) => boolean,
  ): boolean {
    return this.words.some(predicate);
  }
}

export async function withWords(words: string[]): Promise<Wordset> {
  if (currentWordset === null || words !== currentWordset.words) {
    currentWordset = new Wordset(words);
  }
  currentWordset.resetIndexes();
  return currentWordset;
}
