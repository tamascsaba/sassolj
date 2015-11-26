const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const assign = require('lodash.assign');

import {SassOptions} from './interfaces';
import {createSassVariables, sassImport} from './variables';

// Defaults
let options: SassOptions = {
  sourceMap: false,
  sourceMapEmbed: false,
  sourceMapContents: false,
  outputStyle: "compressed"
};

let variables:string = '';


export function register(vars?: Object | string, opts?: SassOptions, exts?: string[]) {
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

function requireSass(nodeModule: NodeModule, file: string) {
  const data = variables + sassImport(file);
  const result = sass.renderSync(
    assign(
      {
        data: data,
        includePaths: [path.dirname(file)]
      },
      options
    )
  ).css.toString();

  nodeModule.exports = result;
};

//Register with default options
register();

exports.register = register;