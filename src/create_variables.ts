const fs = require('fs');
const path = require('path');

export function createVariables(vars: string | Object): string {
    let variables: string = '';
    if (typeof vars == 'object') {
        variables = sassVariables(<Object>vars);
    }

    if (typeof vars == 'string') {
        if (!path.isAbsolute(vars)) {
            vars = path.join(process.cwd(), vars);
        }
        variables = fs.readFileSync(<string>vars);
    }

    return variables;
}

export function sassVariables(variablesObj: Object): string {
    return Object.keys(variablesObj).map(function(name) {
        return sassVariable(name, variablesObj[name]);
    }).join('\n');
}

export function sassVariable(name: string, value: string | number): string {
    return "$" + name + ": " + value + ";";
}

export function sassImport(path: string): string {
    return "@import '" + path + "';";
}
