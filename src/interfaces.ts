export interface TransformConfig {
    sass?: SassOptions;
    postcss?: boolean | Object;
    variables?: any;
}

export interface TransformOptions {
    file: string;
    config: TransformConfig;
}

export interface SassOptions {
    file?: string;
    data?: string;
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
