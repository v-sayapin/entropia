import { defineConfig } from 'oxfmt';

export default defineConfig({
	ignorePatterns: ['.yarn', '.pnp.*', 'yarn.lock', 'node_modules', 'dist'],

	printWidth: 100,
	useTabs: true,
	tabWidth: 4,

	endOfLine: 'lf',
	insertFinalNewline: true,
	proseWrap: 'preserve',

	singleQuote: true,
	jsxSingleQuote: true,

	bracketSpacing: true,
	bracketSameLine: true,
	objectWrap: 'preserve',
	arrowParens: 'always',
	trailingComma: 'es5',
	semi: true,

	sortPackageJson: false,
	sortImports: {
		internalPattern: ['src/'],
		customGroups: [
			{
				groupName: 'assets',
				elementNamePattern: ['src/**/*.{avif,jpeg,jpg,png,svg,webp}'],
				selector: 'internal',
			},
		],
		groups: [
			['builtin', 'type-builtin'],
			['external', 'type-external'],
			['internal', 'type-internal'],
			'assets',
			['side_effect_style', 'style'],
			'unknown',
		],
	},

	overrides: [
		{
			files: ['*.html', '*.json', '*.yaml', '*.yml'],
			options: {
				useTabs: true,
				tabWidth: 2,
			},
		},
		{
			files: ['*.md'],
			options: {
				proseWrap: 'always',
			},
		},
		{
			files: ['package.json'],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
});
