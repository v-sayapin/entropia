import solid from 'eslint-plugin-solid/configs/typescript';
import { defineConfig } from 'oxlint';

export default defineConfig({
	ignorePatterns: ['.yarn', '.pnp.*', 'yarn.lock', 'node_modules', 'dist'],

	plugins: ['import', 'promise', 'typescript'],

	rules: {
		'eslint/no-await-in-loop': 'error',
		'eslint/no-restricted-imports': [
			'error',
			{
				patterns: [
					{
						group: ['./*', '!./*.css', '!./*.module.css'],
						message: 'Only local style files may use relative paths.',
					},
					{
						group: ['src/**/*.css'],
						message: 'Style files must use relative paths from the current directory.',
					},
				],
			},
		],
		'eslint/no-useless-call': 'error',

		'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
		'import/export': 'error',
		'import/no-commonjs': 'error',
		'import/no-cycle': 'error',
		'import/no-duplicates': 'error',
		'import/no-named-default': 'error',
		'import/no-namespace': 'error',
		'import/no-relative-parent-imports': 'error',
		'import/no-self-import': 'error',

		'oxc/no-accumulating-spread': 'error',
		'oxc/no-map-spread': 'error',

		'promise/prefer-await-to-then': 'error',

		'typescript/adjacent-overload-signatures': 'error',
		'typescript/array-type': ['error', { default: 'generic', readonly: 'generic' }],
		'typescript/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
		'typescript/consistent-type-definitions': ['error', 'type'],
		'typescript/consistent-type-exports': 'error',
		'typescript/consistent-type-imports': [
			'error',
			{ prefer: 'type-imports', fixStyle: 'separate-type-imports' },
		],
		'typescript/consistent-return': 'error',
		'typescript/no-base-to-string': 'error',
		'typescript/no-explicit-any': 'error',
		'typescript/explicit-function-return-type': 'error',
		'typescript/explicit-module-boundary-types': ['error', { allowOverloadFunctions: true }],
		'typescript/no-namespace': [
			'error',
			{ allowDeclarations: true, allowDefinitionFiles: true },
		],
		'typescript/prefer-function-type': 'error',

		'unicorn/prefer-array-find': 'error',
		'unicorn/prefer-array-flat-map': 'error',
		'unicorn/prefer-set-has': 'error',
	},

	overrides: [
		{
			files: ['src/client/**/*.{ts,tsx}', 'src/hydrate.tsx', 'src/render.tsx'],
			env: { browser: true, es2022: true },
			jsPlugins: [{ name: 'solid', specifier: import.meta.resolve('eslint-plugin-solid') }],
			rules: solid.rules,
		},
		{
			files: ['src/server/**/*.ts', 'tools/**/*.ts', '*.config.ts'],
			env: { node: true, es2024: true },
		},
	],
});
