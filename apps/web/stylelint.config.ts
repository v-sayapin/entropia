import type { Config } from 'stylelint';

const kebab = '[a-z]+(?:-[a-z]+)*';
const bem = `${kebab}(__${kebab})?(_${kebab}){0,2}`;

const config: Config = {
	extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
	ignoreFiles: ['**/*', '!**/*.css', '**/.yarn/**', '**/node_modules/**', '**/dist/**'],
	rules: {
		'selector-class-pattern': [
			`^(${bem})$`,
			{
				resolveNestedSelectors: true,
				message: 'Expected class selector in kebab or BEM format',
			},
		],
		'selector-max-id': [0, { message: 'Id selector are not allowed' }],
	},
};

export default config;
