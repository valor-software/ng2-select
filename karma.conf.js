'use strict';

const path = require('path');
const cwd = process.cwd();

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      {pattern: 'test.bundle.js', watched: false}
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test.bundle.js': ['coverage', 'webpack', 'sourcemap']
    },

    webpack: {
      // Do not change, leave as is or it wont work.
      // See: https://github.com/webpack/karma-webpack#source-maps
      devtool: 'inline-source-map',
      resolve: {
        root: [root('components')],
        extensions: ['', '.ts', '.js', '.css']
      },
      module: {
        preLoaders: [
          {
            test: /\.ts$/,
            loader: 'tslint-loader',
            exclude: [
              root('node_modules')
            ]
          },
          {
            test: /\.js$/,
            loader: 'source-map-loader',
            exclude: [
              root('node_modules/rxjs')
            ]
          }
        ],
        loaders: [
          {
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
            query: {
              'compilerOptions': {
                'removeComments': true,
              }
            },
            exclude: [/\.e2e\.ts$/]
          }
        ],
        postLoaders: [
          // instrument only testing sources with Istanbul
          {
            test: /\.(js|ts)$/,
            include: root('components'),
            loader: 'istanbul-instrumenter-loader',
            exclude: [
              /\.e2e\.ts$/,
              /node_modules/
            ]
          }
        ]
      },
      tslint: {
        emitErrors: false,
        failOnHint: false,
        resourcePath: 'components'
      },
      stats: {
        colors: true,
        reasons: true
      },

      node: {
        global: 'window',
        process: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false
      },

      watch: true,
      debug: true
    },

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {type: 'text'},
        {type: 'json'},
        {type: 'html'}
      ]
    },
    webpackServer: {noInfo: true},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
