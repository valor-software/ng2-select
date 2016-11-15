'use strict';
var pkg = require('./package.json');

module.exports = {
  // metadata
  title: pkg.description,
  baseUrl: '/',
  // root folder name
  src: 'demo',
  dist: 'demo-build',
  htmlIndexes: ['index.html'],
  // karma bundle src
  spec: './spec-bundle.js',
  // webpack entry
  entry: {
    main: ['./demo/polyfills.ts', './demo/vendor.ts', './demo/index.ts']
  },
  commonChunks: {
    name: ['main']
  },
  // webpack alias
  alias: {},
  copy: [
    {from: 'demo/favicon.ico', to: 'favicon.ico'},
    {from: 'demo/assets', to: 'assets'}
  ]
};
