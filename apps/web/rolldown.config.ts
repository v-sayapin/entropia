import { resolve } from 'node:path';

import { defineConfig } from 'rolldown';

export default defineConfig({
	resolve: {
		alias: {
			server: resolve(import.meta.dirname, 'src/server'),
			shared: resolve(import.meta.dirname, 'src/shared'),
		},
	},
	input: 'src/server/app/index.ts',
	platform: 'node',
	tsconfig: 'tsconfig.server.json',
	transform: {
		define: {
			'process.env.NODE_ENV': "'production'",
		},
	},
	output: {
		dir: 'dist/server',
		entryFileNames: '[name].js',
		minify: false,
		sourcemap: true,
	},
});
