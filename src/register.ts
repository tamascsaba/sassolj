const fs = require('fs');
const sass = require('node-sass');
const assign = require('lodash.assign');

import {SassOptions} from './interfaces';
import {createSassVariables} from './variables';

// Defaults
let options: SassOptions = {
  sourceMap: false,
  sourceMapEmbed: false,
  sourceMapContents: false,
  outputStyle: "compressed"
};

let variables:string = '';

// Main export
export default (opts?: SassOptions, vars?: Object | string, exts?: string[]) => {
  options = assign(options, opts);

  if (vars) {
    variables = createSassVariables(vars);
  }

  const extensions: string[] = exts || ['.scss', '.sass'];
  for (var i = 0; i < extensions.length; i++) {
    require.extensions[extensions[i]] = requireSass;
  }

  return {
    options: options,
    variables: variables,
    exts: extensions
  }
}

function requireSass(module: NodeModule, file: string) {
  const data = variables + fs.readFileSync(file);
  const sassOptions = assign(options, { data: data });
  const result = sass.renderSync(sassOptions);

  module.exports = result.css.toString();
};