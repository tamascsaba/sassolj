const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const assign = require('lodash.assign');

import {SassOptions, TransformConfig} from './interfaces';
import {createVariables, sassImport} from './create_variables';

export interface RequireConfig extends TransformConfig {
    extensions?: string[];
}

// Defaults
let sassOptions: SassOptions = {
    sourceMap: false,
    sourceMapEmbed: false,
    sourceMapContents: false,
    outputStyle: "compressed"
};

let variables: string = '';

export default function register(config: RequireConfig = {}) {
    variables = createVariables(config.variables);
    assign(sassOptions, config.sass);

    const extensions: string[] = config.extensions || ['.css', '.sass', '.scss'];
    for (var i = 0; i < extensions.length; i++) {
        require.extensions[extensions[i]] = requireSass;
    }

    return {
        sass: sassOptions,
        variables: variables,
        extensions: extensions
    }
}

function requireSass(nodeModule: NodeModule, file: string) {
    const data: string = variables + sassImport(file);
    const result = sass.renderSync(
        assign(
            {
                data: data,
                includePaths: [path.dirname(file)]
            },
            sassOptions
        )
    ).css.toString();

    nodeModule.exports = result;
};

//Register with default options
register();
