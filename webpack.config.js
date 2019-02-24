const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './app/renderer.js',
	target: 'web',
	mode: process.env.NODE_ENV || 'development',
	output: {
		filename: 'renderer.js',
		path: path.resolve(__dirname, 'out')
	},
	plugins: [
		new CopyPlugin([
			{ from: '*.html', to: path.join(__dirname, 'out'), context: path.join(__dirname, 'app') },
			{ from: 'css/**/*', to: path.join(__dirname, 'out'), context: path.join(__dirname, 'app') },
			{ from: 'assets/**/*', to: path.join(__dirname, 'out'), context: path.join(__dirname, 'app') }
		])
	]
};
