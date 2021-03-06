import path from 'path';
import fs from 'fs';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

let babelrc = JSON.parse(fs.readFileSync('./.babelrc'));
let pkg = JSON.parse(fs.readFileSync('./package.json'));
let external = Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {}));

export default {
	entry: pkg['jsnext:main'],
	dest: pkg.main,
	sourceMap: path.resolve(pkg.main),
	moduleName: pkg.amdName,
	format: 'umd',
	external,
	plugins: [
		babel({
			babelrc: false,
			comments: false,
			exclude: 'node_modules/**',
			presets: [
				'es2015-minimal-rollup'
			].concat(babelrc.presets.slice(1)),
			plugins: require('babel-preset-es2015-minimal-rollup').plugins.concat([
				['transform-react-jsx', { pragma:'h' }]
			])
		}),
		nodeResolve({
			jsnext: true,
			main: true,
			skip: external
		}),
		commonjs({
			include: 'node_modules/**',
			exclude: '**/*.css'
		})
	]
};
