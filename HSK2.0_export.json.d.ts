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

declare const data: Hsk20ExportManifest;
export default data;
