# hsk2.0

Publishes the HSK 2.0 vocabulary, character, and phrase lists from
`data/HSK2.0` as JSON files.

The source data follows the official HSK 2.0 standard. See
`data/HSK2.0/readme.md` for source notes, level counts, and data caveats.

## What This Package Contains

- `HSK2.0_words.json`: all vocabulary items
- `HSK2.0_words_level*.json`: vocabulary split by level
- `HSK2.0_chars.json`: all characters
- `HSK2.0_chars_level*.json`: characters split by level
- `HSK2.0_4char_phrases.json`: four-character phrases
- `HSK2.0_chengyu.json`: chengyu
- `HSK2.0_not_chengyu.json`: four-character phrases that are not chengyu
- `HSK2.0_export.json`: manifest with source file metadata and hashes

## Part-Of-Speech Annotations

The syllabus disambiguates a homograph by tagging its part of speech in fullwidth parentheses:
`对（介词）` and `对（形容词）` are the single word 对, listed twice for its preposition and
adjective senses. That tag is grammatical metadata, never part of the word.

The published word lists therefore carry the bare word, and the tags are available separately as
`HSK2.0_word_pos.json` (also exported as `hsk20WordPos`):

```js
import { hsk20WordPos, hsk20WordsLevel2 } from "@leonsilicon/hsk2.0";

hsk20WordsLevel2.includes("对"); // true — listed once, not twice
hsk20WordPos["对"];              // ["介词", "形容词"]
```

Eleven words carry tags: 只、喂、地、对、得、种、等、花、过、还 and 长.

A word is deduplicated only **within** a list. Senses of one word can sit in different levels —
`过（助词）` is level 2 and `过（动词）` is level 3 — so 过 appears in both, once each.

An annotation that is not a known part-of-speech tag fails the build rather than being silently
treated as part of a word.

## Install

```bash
npm install @leonsilicon/hsk2.0
```

## Usage

```js
import hsk20, { hsk20WordsLevel1, hsk20Chars } from "@leonsilicon/hsk2.0";

console.log(hsk20.words.length);
console.log(hsk20WordsLevel1[0]);
console.log(hsk20Chars.includes("学"));
```

Each JSON file is also available as a subpath export:

```js
import wordsLevel1 from "@leonsilicon/hsk2.0/HSK2.0_words_level1.json" with { type: "json" };
import charsLevel6 from "@leonsilicon/hsk2.0/HSK2.0_chars_level6.json" with { type: "json" };
```

## Exports

The package root default export groups all lists under friendly property names:

- `words`, `wordsLevel1`, `wordsLevel2`, `wordsLevel3`, `wordsLevel4`, `wordsLevel5`, `wordsLevel6`
- `chars`, `charsLevel1`, `charsLevel2`, `charsLevel3`, `charsLevel4`, `charsLevel5`, `charsLevel6`
- `fourCharPhrases`, `chengyu`, `notChengyu`, `export`

Named exports are also available for the same JSON payloads, using names such as
`hsk20Words`, `hsk20WordsLevel1`, `hsk20Chars`, and `hsk20Export`.

## Regenerating The JSON

The source files live in `data/HSK2.0`. To regenerate the published root JSON
files:

```bash
bun run build
```

## Repository

- Source: [github.com/leonsilicon/hsk2.0](https://github.com/leonsilicon/hsk2.0)
