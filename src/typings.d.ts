// Some type definitions for green compile

declare module "resolve" {
  function sync(pluginName: string, options: {
    basedir: string
  }): string;
}

declare var postcss: Function;

declare module "postcss" {
  export = postcss;
}

declare module "browserify-transform-tools" {
  function makeStringTransform(name: string, options: {
    includeExtensions: string[],
    evaluateArguments: boolean
  }, done: Function): Function;
}

declare module "require-sass" {}


