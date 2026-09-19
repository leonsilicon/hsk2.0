export type Hsk20List = string[];

/**
 * Part-of-speech tags the syllabus attaches to a homograph, as word -> its tags. The word lists
 * carry the bare word; `对（介词）` / `对（形容词）` become `对` here with `["介词", "形容词"]`.
 */
export type Hsk20WordPos = Record<string, string[]>;

export interface Hsk20ExportFileSummary {
  name: string;
  size_bytes: number;
  sha256: string;
  content: unknown;
}

export interface Hsk20ExportManifest {
  source_directory: string;
  total_files: number;
  files: Hsk20ExportFileSummary[];
}

export interface Hsk20Dataset {
  export: Hsk20ExportManifest;
  chars: Hsk20List;
  charsLevel1: Hsk20List;
  charsLevel2: Hsk20List;
  charsLevel3: Hsk20List;
  charsLevel4: Hsk20List;
  charsLevel5: Hsk20List;
  charsLevel6: Hsk20List;
  fourCharPhrases: Hsk20List;
  chengyu: Hsk20List;
  notChengyu: Hsk20List;
  wordPos: Hsk20WordPos;
  words: Hsk20List;
  wordsLevel1: Hsk20List;
  wordsLevel2: Hsk20List;
  wordsLevel3: Hsk20List;
  wordsLevel4: Hsk20List;
  wordsLevel5: Hsk20List;
  wordsLevel6: Hsk20List;
}

export declare const hsk20Export: Hsk20ExportManifest;
export declare const hsk20Chars: Hsk20List;
export declare const hsk20CharsLevel1: Hsk20List;
export declare const hsk20CharsLevel2: Hsk20List;
export declare const hsk20CharsLevel3: Hsk20List;
export declare const hsk20CharsLevel4: Hsk20List;
export declare const hsk20CharsLevel5: Hsk20List;
export declare const hsk20CharsLevel6: Hsk20List;
export declare const hsk204CharPhrases: Hsk20List;
export declare const hsk20Chengyu: Hsk20List;
export declare const hsk20NotChengyu: Hsk20List;
export declare const hsk20WordPos: Hsk20WordPos;
export declare const hsk20Words: Hsk20List;
export declare const hsk20WordsLevel1: Hsk20List;
export declare const hsk20WordsLevel2: Hsk20List;
export declare const hsk20WordsLevel3: Hsk20List;
export declare const hsk20WordsLevel4: Hsk20List;
export declare const hsk20WordsLevel5: Hsk20List;
export declare const hsk20WordsLevel6: Hsk20List;

declare const hsk20: Hsk20Dataset;
export default hsk20;
