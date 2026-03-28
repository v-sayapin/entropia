import { resolve } from 'node:path';

import { defineConfig } from 'rolldown';

const devOnlyPackages = new Set(['@fastify/middie', 'vite']);

export default defineConfig({
	resolve: {
		alias: {
			server: resolve(import.meta.dirname, 'src/server'),
			shared: resolve(import.meta.dirname, 'src/shared'),
		},
	},
	input: 'src/server/app/index.ts',
	external: (id) => devOnlyPackages.has(id),
	platform: 'node',
	tsconfig: 'tsconfig.server.json',
	output: {
		dir: 'dist/server',
		entryFileNames: '[name].js',
		minify: false,
		sourcemap: true,
	},
});
