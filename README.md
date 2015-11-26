# sassolj #

Require [Sass](http://sass-lang.com) files in browserify and Node.js

Install sassolj:

```
$ npm i sassolj
```

## Browserify
The default settings are listed below. They may be overridden though the CLI, package.json (`sassolj` property)
or though the API options.

In order for PostCSS plugins to be used, they must be installed in your projects `package.json`

``` js
  var browserify = require('browserify');
  var sassolj = require('sassolj');
  browserify('entry.js')
    .transform(sassolj, {
      'sass': {
        'sourceComments': false,
        'sourceMap': false,
        'sourceMapEmbed': false,
        'sourceMapContents': false,
        'outputStyle': 'compressed'
      },
      'postcss': false,
      //you may specify what postcss plugins to use here
      'postcss': {
        'autoprefixer': {
          'browsers': ['last 2 versions'] //optional config, use an empty object for defualts
        }
      }
      ,
      'rootDir': process.cwd()
    })
    .bundle()
````

## Node.js

During the boot up process of your application, require `sassolj/register` once;
```
require('sassolj/register')(variables, options, extensions);
```
You can add variables, options and extensions all is optional.
After this point, all sass files is requireable.

### variables
Extra variables which overwrite !default vars.

Type: `Object` | `string`
Default: ``
You can use absolute and relative string path to sass/scss config file

### options
node-sass options

Type: `Object`
Default: `{
  sourceMap: false,
  sourceMapEmbed: false,
  sourceMapContents: false,
  outputStyle: "compressed"
}`

### extensions
Which extensions register to ```require.extensions```

Type: `Array`
Default: `['.sass', '.scss']`

#Development

  1. Clone the repo
  2. `npm install`
  3. `npm run dev`

This project uses TypeScript to transpile to ES5.

# License

[MIT](/LICENSE)
