#!/usr/bin/env bun

import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, extname, relative, resolve } from "node:path";

const DATASET_NAME = "HSK2.0";
const INPUT_DIR = resolve("data", DATASET_NAME);
const OUTPUT_DIR = resolve(".");
const EXPORT_FILE_NAME = `${DATASET_NAME}_export.json`;

interface ExportFileSummary {
  name: string;
  size_bytes: number;
  sha256: string;
  content: {
    type: "text" | "json";
    line_count?: number;
    items?: string[];
    value?: unknown;
  };
}

function toJsonFilename(fileName: string): string {
  const sourceExt = extname(fileName).toLowerCase();
  if (sourceExt === ".json") return fileName;
  return `${basename(fileName, sourceExt)}.json`;
}

/**
 * The syllabus disambiguates a homograph by tagging its part of speech in fullwidth parentheses:
 * `对（介词）` and `对（形容词）` are the one word 对, listed twice for its preposition and
 * adjective senses. The parenthesised text is grammatical metadata, never part of the word.
 *
 * The published lists therefore carry the bare word, and the tags move to `HSK2.0_word_pos.json`
 * (word → its parts of speech). Senses of one word can sit in DIFFERENT levels — `过（助词）` is
 * level 2 and `过（动词）` is level 3 — so a word is deduplicated only WITHIN a list. Dropping
 * it globally would erase its later level placement.
 *
 * Every tag seen in `data/` must appear below or the build fails, so a revision that introduces
 * an unfamiliar annotation cannot be silently reinterpreted as part of a word.
 */
const PART_OF_SPEECH_TAGS = new Set([
  "介词",
  "动词",
  "助动词",
  "助词",
  "叹词",
  "副词",
  "名词",
  "形容词",
  "量词",
]);

const PARENTHESISED = /\uff08([^\uff09]*)\uff09/u;

/** word → parts of speech, in first-seen order, accumulated across every parsed list. */
const partsOfSpeechByWord = new Map<string, string[]>();

function recordPartOfSpeech(word: string, tag: string): void {
  let tags = partsOfSpeechByWord.get(word);
  if (tags === undefined) {
    tags = [];
    partsOfSpeechByWord.set(word, tags);
  }
  if (!tags.includes(tag)) {
    tags.push(tag);
  }
}

export function partOfSpeechIndex(): Record<string, string[]> {
  return Object.fromEntries([...partsOfSpeechByWord].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

function parseTxt(content: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const line of content.split(/\r?\n/).map((entry) => entry.trim())) {
    if (line.length === 0) {
      continue;
    }
    if (line.startsWith("#")) {
      out.push(line);
      continue;
    }

    const match = PARENTHESISED.exec(line);
    if (match === null) {
      out.push(line);
      continue;
    }

    const tag = match[1] ?? "";
    if (!PART_OF_SPEECH_TAGS.has(tag)) {
      throw new Error(
        `Entry "${line}" is annotated "（${tag}）", which is not a known part-of-speech tag. ` +
          "Add it to PART_OF_SPEECH_TAGS in scripts/build.ts, or handle the annotation explicitly " +
          "if it does not mark a part of speech.",
      );
    }

    const word = line.replace(PARENTHESISED, "");
    recordPartOfSpeech(word, tag);
    // Within one list a word appears once, even when several of its senses are listed.
    if (!seen.has(word)) {
      seen.add(word);
      out.push(word);
    }
  }

  return out;
}

function typeDefinitionForJson(fileName: string): string {
  if (fileName === EXPORT_FILE_NAME) {
    return `export interface Hsk20ExportFileSummary {
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

declare const data: Hsk20ExportManifest;
export default data;
`;
  }

  return `declare const data: string[];
export default data;
`;
}

async function buildFile(fileName: string): Promise<ExportFileSummary | undefined> {
  const sourcePath = resolve(INPUT_DIR, fileName);
  const sourceExt = extname(fileName).toLowerCase();

  if (sourceExt === ".pdf" || sourceExt === ".md") {
    return;
  }

  if (sourceExt !== ".txt" && sourceExt !== ".json") {
    console.warn(`Skipping unsupported file: ${fileName}`);
    return;
  }

  const outputPath = resolve(OUTPUT_DIR, toJsonFilename(fileName));
  const raw = await readFile(sourcePath, "utf8");

  let data: unknown;
  let content: ExportFileSummary["content"];
  if (sourceExt === ".txt") {
    const items = parseTxt(raw);
    data = items;
    content = {
      type: "text",
      line_count: items.length,
      items,
    };
  } else {
    data = JSON.parse(raw);
    content = {
      type: "json",
      value: data,
    };
  }

  const outputFileName = basename(outputPath);

  await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await writeFile(`${outputPath}.d.ts`, typeDefinitionForJson(outputFileName), "utf8");
  console.log(`Wrote ${basename(outputPath)} from ${fileName}`);

  return {
    name: fileName,
    size_bytes: Buffer.byteLength(raw, "utf8"),
    sha256: createHash("sha256").update(raw).digest("hex"),
    content,
  };
}

const POS_FILE_NAME = `${DATASET_NAME}_word_pos.json`;

/**
 * The part-of-speech tags stripped from the word lists, as word -> tags. Derived from `data/`,
 * never hand-edited. A word with one sense still gets a one-element array so the shape is stable.
 */
async function writePartOfSpeechIndex(): Promise<void> {
  const outputPath = resolve(OUTPUT_DIR, POS_FILE_NAME);
  const index = partOfSpeechIndex();

  await writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  await writeFile(
    `${outputPath}.d.ts`,
    `declare const data: Record<string, string[]>;
export default data;
`,
    "utf8",
  );
  console.log(`Wrote ${POS_FILE_NAME} (${Object.keys(index).length} words)`);
}

async function writeExportManifest(files: ExportFileSummary[]): Promise<void> {
  const outputPath = resolve(OUTPUT_DIR, EXPORT_FILE_NAME);
  const manifest = {
    source_directory: relative(OUTPUT_DIR, INPUT_DIR),
    total_files: files.length,
    files,
  };

  await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await writeFile(`${outputPath}.d.ts`, typeDefinitionForJson(EXPORT_FILE_NAME), "utf8");
  console.log(`Wrote ${EXPORT_FILE_NAME}`);
}

async function main(): Promise<void> {
  const entries = await readdir(INPUT_DIR, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort();
  const manifestFiles: ExportFileSummary[] = [];

  for (const fileName of files) {
    const summary = await buildFile(fileName);
    if (summary) {
      manifestFiles.push(summary);
    }
  }

  await writePartOfSpeechIndex();
  await writeExportManifest(manifestFiles);
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(String(error));
  }
  process.exit(1);
});
