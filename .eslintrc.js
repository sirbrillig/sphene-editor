module.exports = {
	root: true,
	'extends': 'wpcalypso/react',
	parser: 'babel-eslint',
	env: {
		browser: true,
		mocha: true,
		node: true
	},
	rules: {
		'wpcalypso/jsx-classname-namespace': 0,
		'max-len': 0,
		'camelcase': 0,
	}
};
