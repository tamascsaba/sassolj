const fs = require('fs');
const resolve = require('resolve');
const path = require('path');
const sass = require('node-sass');
const postcss = require('postcss');
const tools = require('browserify-transform-tools');
const requireSass = require('require-sass');
const assign = require('lodash.assign');
const omit = require('lodash.omit');

import {
  SassOptions,
  TransformConfig,
  TransformOptions
} from './interfaces';
import {createSassVariables} from './variables'

const defaults: TransformConfig = {
  sass: {
    sourceComments: false,
    sourceMap: false,
    sourceMapEmbed: false,
    sourceMapContents: false,
    outputStyle: 'compressed'
  },
  postcss: false,
  variables: ''
};

const MODULE_NAME: string = path.basename(path.dirname(__dirname));

const Transformer = tools.makeStringTransform(MODULE_NAME, {
  includeExtensions: ['.css', '.sass', '.scss'],
  evaluateArguments: true
}, (content: string, opts: TransformOptions, done: Function) => {
  const file = opts.file;

  const config: TransformConfig = assign({}, defaults, omit(opts.config, '_flags'));
  const sassOpts: SassOptions = config.sass;
  const variables = createSassVariables(config.variables);

  sassOpts.includePaths = sassOpts.includePaths || [];
  sassOpts.includePaths.unshift(path.dirname(file));
  sassOpts.indentedSyntax = /\.sass$/i.test(file);
  sassOpts.data = variables + content;

  if (config.postcss !== false && !(typeof config.postcss === 'object')) {
    return done(new Error('Postcss config must be false or an object of plugins'));
  }

  const postcssTransforms: Array<Function> = config.postcss ? Object.keys(config.postcss).map((pluginName: string) => {
    const pluginOpts = config.postcss[pluginName];
    const plugin = require(resolve.sync(pluginName, { basedir: process.cwd() }));
    return plugin(pluginOpts);
  }) : null;

  sass.render(sassOpts, function(err, result) {
    if (err) return done(new SyntaxError(err.file + ': ' + err.message + ' (' + err.line + ':' + err.column + ')'));

    let out = '';
    const css = config.postcss ? postcss(postcssTransforms).process(result.css, {
      map: {
        inline: sassOpts.sourceMapEmbed,
        prev: sassOpts.sourceMapEmbed ? result.map.toString() : null
      }
    }).css : result.css;

    const cssString: string = JSON.stringify(css.toString())

    out += ` module.exports = ${cssString};`;

    return done(null, out);
  })
});

//Browserify
export default Transformer;
