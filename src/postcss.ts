const resolve = require('resolve');
const postcss = require('postcss');

export function getPostcssTransforms(config): Function[] {
    const postcssTransforms: Function[] = config ? Object.keys(config).map((pluginName: string) => {
        const pluginOpts = config[pluginName];
        const plugin = require(resolve.sync(pluginName, { basedir: process.cwd() }));
        return plugin(pluginOpts);
    }) : null;

    return postcssTransforms;
}

export function createPostcss(transforms: Function[], css: string): string {
    return postcss(transforms).process(css).css;
}

