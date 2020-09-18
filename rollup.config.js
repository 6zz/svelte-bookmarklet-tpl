import svelte from 'rollup-plugin-svelte';
import babel,  { getBabelOutputPlugin } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import preprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;
const floatyCfg = {
	input: 'src/main.js',
	output: [{
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	}, {
		format: 'cjs',
		name: 'app',
		file: 'public/build/bundle.cjs.js',
		plugins: [
			getBabelOutputPlugin({
				presets: ['@babel/preset-env']
			})
		]
	}],
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
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

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			// browser: true,
			// dedupe: ['svelte']
		}),
		commonjs(),
		babel({ babelHelpers: 'bundled' }),


		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

export default [floatyCfg];

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
