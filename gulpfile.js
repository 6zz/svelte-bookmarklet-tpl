const gulp = require('gulp');
const header = require('gulp-header');
const file = require('gulp-file');
const terser = require('gulp-terser');
const rollup = require('rollup').rollup;
const svelte = require('rollup-plugin-svelte');
const preprocess = require('svelte-preprocess');
const {default: resolve} = require('@rollup/plugin-node-resolve');
const {default: babel} = require('@rollup/plugin-babel');

function build() {
  return rollup({
    input: 'src/main.js',
    plugins: [
      svelte({
        // enable run-time checks when not in production
        dev: false,
        // we'll extract any component CSS out into
        // a separate file - better for performance
        // css: css => {
        // 	css.write('public/build/bundle.css');
        // },
        preprocess: preprocess({
          defaults: {
              style: 'scss'
            }
          })
      }),
      resolve({
        browser: true,
        dedupe: ['svelte']
      }),
      babel({ babelHelpers: 'bundled' }),
    ]
  })
  .then(bundle => {
    return bundle.generate({
      file: 'bundle.js',
      format: 'iife',
      strict: false,
      name: ''
    });
  })
  .then(({output: [{code}]}) => {
    return file('bundle.js', code)
      .pipe(terser({
        // compress: false,
        // mangle: false,
        // ecma: 5
      }))
      .pipe(header('javascript:'))
      .pipe(gulp.dest('./dist'));
  });
};

exports.default = build;