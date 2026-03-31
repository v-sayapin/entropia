import type { Configuration } from 'lint-staged';

const config: Configuration = {
	'*.{ts,cts,mts,tsx}': () => 'yarn ts-check',
	'*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}': ['oxlint --fix'],
	'*.css': ['stylelint --fix'],
	'*': ['oxfmt --no-error-on-unmatched-pattern'],
};

export default config;
