import hsk20Export from "./HSK2.0_export.json" with { type: "json" };
import hsk20Chars from "./HSK2.0_chars.json" with { type: "json" };
import hsk20CharsLevel1 from "./HSK2.0_chars_level1.json" with { type: "json" };
import hsk20CharsLevel2 from "./HSK2.0_chars_level2.json" with { type: "json" };
import hsk20CharsLevel3 from "./HSK2.0_chars_level3.json" with { type: "json" };
import hsk20CharsLevel4 from "./HSK2.0_chars_level4.json" with { type: "json" };
import hsk20CharsLevel5 from "./HSK2.0_chars_level5.json" with { type: "json" };
import hsk20CharsLevel6 from "./HSK2.0_chars_level6.json" with { type: "json" };
import hsk204CharPhrases from "./HSK2.0_4char_phrases.json" with { type: "json" };
import hsk20Chengyu from "./HSK2.0_chengyu.json" with { type: "json" };
import hsk20NotChengyu from "./HSK2.0_not_chengyu.json" with { type: "json" };
import hsk20Words from "./HSK2.0_words.json" with { type: "json" };
import hsk20WordsLevel1 from "./HSK2.0_words_level1.json" with { type: "json" };
import hsk20WordsLevel2 from "./HSK2.0_words_level2.json" with { type: "json" };
import hsk20WordsLevel3 from "./HSK2.0_words_level3.json" with { type: "json" };
import hsk20WordsLevel4 from "./HSK2.0_words_level4.json" with { type: "json" };
import hsk20WordsLevel5 from "./HSK2.0_words_level5.json" with { type: "json" };
import hsk20WordsLevel6 from "./HSK2.0_words_level6.json" with { type: "json" };

export {
  hsk20Export,
  hsk20Chars,
  hsk20CharsLevel1,
  hsk20CharsLevel2,
  hsk20CharsLevel3,
  hsk20CharsLevel4,
  hsk20CharsLevel5,
  hsk20CharsLevel6,
  hsk204CharPhrases,
  hsk20Chengyu,
  hsk20NotChengyu,
  hsk20Words,
  hsk20WordsLevel1,
  hsk20WordsLevel2,
  hsk20WordsLevel3,
  hsk20WordsLevel4,
  hsk20WordsLevel5,
  hsk20WordsLevel6,
};

const hsk20 = {
  export: hsk20Export,
  chars: hsk20Chars,
  charsLevel1: hsk20CharsLevel1,
  charsLevel2: hsk20CharsLevel2,
  charsLevel3: hsk20CharsLevel3,
  charsLevel4: hsk20CharsLevel4,
  charsLevel5: hsk20CharsLevel5,
  charsLevel6: hsk20CharsLevel6,
  fourCharPhrases: hsk204CharPhrases,
  chengyu: hsk20Chengyu,
  notChengyu: hsk20NotChengyu,
  words: hsk20Words,
  wordsLevel1: hsk20WordsLevel1,
  wordsLevel2: hsk20WordsLevel2,
  wordsLevel3: hsk20WordsLevel3,
  wordsLevel4: hsk20WordsLevel4,
  wordsLevel5: hsk20WordsLevel5,
  wordsLevel6: hsk20WordsLevel6,
};

export default hsk20;
