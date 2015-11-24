# sassolj #

Require [Sass](http://sass-lang.com) files in browserify and Node.js

# Example

MyComponent.scss:
``` css
.MyComponent {
  color: red;
  background: blue;
}
```

MyComponent.js:
``` js
const CSS = require('./MyComponent.scss');

console.log(CSS)
```

Indented Sass syntax may be used with the `.sass` extension:
``` js
require('./MyComponent.sass');
```

Install sassolj:

```
$ npm i sassolj
```

## Settings
The default settings are listed below. They may be overridden though the CLI, package.json (`sassolj` property)
or though the API options.

In order for PostCSS plugins to be used, they must be installed in your projects `package.json`

``` js
  var browserify = require('browserify');
  var sassolj = require('sassolj');
  browserify('entry.js')
    .transform(sassolj, {
      'sass': { //Full sass options
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

# Install

[![sassolj](https://nodei.co/npm/sassolj.png?small=true)](https://nodei.co/npm/sassolj)

#Development

  1. Clone the repo
  2. `npm install`
  3. `npm run dev`

This project uses TypeScript to transpile to ES5.

# License

[MIT](/LICENSE)
