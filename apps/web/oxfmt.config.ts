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
		internalPattern: ['client/', 'server/', 'shared/'],
		customGroups: [
			{
				groupName: 'assets',
				elementNamePattern: ['**/*.{avif,jpeg,jpg,png,svg,webp}'],
				selector: 'import',
			},
			{
				groupName: 'shared',
				elementNamePattern: ['shared/**/*'],
				selector: 'internal',
				modifiers: ['value'],
			},
			{
				groupName: 'type-shared',
				elementNamePattern: ['shared/**/*'],
				selector: 'internal',
				modifiers: ['type'],
			},
			{
				groupName: 'server',
				elementNamePattern: ['server/**/*'],
				selector: 'internal',
				modifiers: ['value'],
			},
			{
				groupName: 'type-server',
				elementNamePattern: ['server/**/*'],
				selector: 'internal',
				modifiers: ['type'],
			},
			{
				groupName: 'client',
				elementNamePattern: ['client/**/*'],
				selector: 'internal',
				modifiers: ['value'],
			},
			{
				groupName: 'type-client',
				elementNamePattern: ['client/**/*'],
				selector: 'internal',
				modifiers: ['type'],
			},
		],
		groups: [
			'builtin',
			{ newlinesBetween: false },
			'type-builtin',

			'external',
			{ newlinesBetween: false },
			'type-external',

			'shared',
			{ newlinesBetween: false },
			'type-shared',

			['server', 'client'],
			{ newlinesBetween: false },
			['type-server', 'type-client'],

			'assets',
			'side_effect_style',
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
