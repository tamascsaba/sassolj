export interface TransformConfig {
  sass: SassOptions;
  postcss: boolean | Object;
  rootDir: string;
}

export interface TransformOptions {
  file: string;
  config: TransformConfig;
}

interface Importer {
  (url: string, prev: string, done: (data: { file: string; contents: string; }) => void): void;
}

export interface SassOptions {
  file?: string;
  data?: string;
  importer?: Importer | Importer[];
  functions?: { [key: string]: Function };
  includePaths?: string[];
  indentedSyntax?: boolean;
  indentType?: string;
  indentWidth?: number;
  linefeed?: string;
  omitSourceMapUrl?: boolean;
  outFile?: string;
  outputStyle?: string;
  precision?: number;
  sourceComments?: boolean;
  sourceMap?: boolean | string;
  sourceMapContents?: boolean;
  sourceMapEmbed?: boolean;
  sourceMapRoot?: boolean;
}
