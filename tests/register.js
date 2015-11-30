var assign = require('lodash.assign');
var assert = require('assert');

var defaultOptions = {
  sass: {
    sourceMap: false,
    sourceMapEmbed: false,
    sourceMapContents: false,
    outputStyle: 'compressed',
  },
  variables: {background: 'blue'}
};
var newOptions = {bar: 'foo'};

var requireSass = require('../lib/register')(assign({}, newOptions, defaultOptions));

// Set new options
var options = defaultOptions;
options.bar = 'foo';

assert.deepEqual(requireSass.sass, options.sass, 'Set options');
assert.equal(requireSass.variables, '$background: blue;', 'Set variables');

var sample = require('./sample.scss');

// Test sample scss
assert.equal(sample, 'body{background:blue;color:#fff}\n', 'Require sass file');