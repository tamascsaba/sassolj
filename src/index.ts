const fs = require('fs');
const resolve = require('resolve');
const path = require('path');
const sass = require('node-sass');
const tools = require('browserify-transform-tools');
const assign = require('lodash.assign');
const omit = require('lodash.omit');
const register = require('./register');

import {SassOptions, TransformConfig, TransformOptions} from './interfaces';

import {createVariables, sassImport} from './create_variables';
import {getPostcssTransforms, createPostcss} from './postcss';

const defaults: TransformConfig = {
    sass: {
        sourceComments: false,
        sourceMap: false,
        sourceMapEmbed: false,
        sourceMapContents: false,
        outputStyle: 'compressed'
    },
    postcss: false,
    variables: {}
};

const Transformer = tools.makeStringTransform('sassolj', {
    includeExtensions: ['.css', '.sass', '.scss'],
    evaluateArguments: true
}, (content: string, opts: TransformOptions, done: Function) => {
    const file = opts.file;

    const config: TransformConfig = assign({}, defaults, omit(opts.config, '_flags'));
    const sassOpts: SassOptions = config.sass;
    const variables = createVariables(config.variables);

    sassOpts.includePaths = sassOpts.includePaths || [];
    sassOpts.includePaths.unshift(path.dirname(file));
    sassOpts.indentedSyntax = /\.sass$/i.test(file);
    sassOpts.data = variables + sassImport(file);

    if (config.postcss !== false && !(typeof config.postcss === 'object')) {
        return done(new Error('Postcss config must be false or an object of plugins'));
    }

    const postcssTransforms: Function[] = getPostcssTransforms(config.postcss);

    sass.render(sassOpts, function(err, result) {
        if (err) return done(new SyntaxError(err.file + ': ' + err.message + ' (' + err.line + ':' + err.column + ')'));

        let out = '';
        const css = config.postcss ? createPostcss(postcssTransforms, result.css) : result.css;

        const cssString: string = JSON.stringify(css.toString())

        out += ` module.exports = ${cssString};`;

        return done(null, out);
    })
});

Transformer.register = register;

//Module declaration
export module sassolj {
    export var configure: any;
    export var setConfig: any;
    export var register: any;
}

export default Transformer;
