import * as sass from 'node-sass';
import * as postcss from 'postcss';
import * as tools from 'browserify-transform-tools';
import * as path from 'path';
import * as resolve from 'resolve';
import * as requireSass from 'require-sass';

import {assign, omit} from 'lodash';
import {SassOptions, TransformConfig, TransformOptions} from './interfaces';

const defaults: TransformConfig = {
  sass: {
    sourceComments: false,
    sourceMap: false,
    sourceMapEmbed: false,
    sourceMapContents: false,
    outputStyle: 'compressed'
  },
  postcss: false,
  rootDir: process.cwd()
};

const MODULE_NAME: string = path.basename(path.dirname(__dirname));

const Transformer = tools.makeStringTransform(MODULE_NAME, {
  includeExtensions: ['.css', '.sass', '.scss'],
  evaluateArguments: true
}, (content: string, opts: TransformOptions, done: Function) => {
  const file = opts.file;

  const config = assign({}, defaults, opts.config) as TransformConfig;
  const userSassOpts = config.sass as SassOptions;
  const sassOpts = assign({}, userSassOpts) as SassOptions;

  sassOpts.includePaths = sassOpts.includePaths || [];
  sassOpts.includePaths.unshift(path.dirname(file));
  sassOpts.indentedSyntax = /\.sass$/i.test(file);
  sassOpts.file = file;
  sassOpts.data = content;
  sassOpts.outFile = file;

  if (config.postcss !== false && !(typeof config.postcss === 'object')) {
    return done(new Error('Postcss config must be false or an object of plugins'));
  }

  const relativePath = path.relative(config.rootDir, path.dirname(file));
  const href = path.join(relativePath, path.basename(file));

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

//Node.js
export const register = requireSass;

//Browserify
export default Transformer;
