import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const srcDir = resolve(import.meta.dirname, 'src');

export default defineConfig({
	resolve: {
		alias: {
			src: srcDir,
		},
	},
	plugins: [solid()],
	publicDir: 'src/client/public',
	build: {
		outDir: 'dist/client',
		emptyOutDir: false,
	},
	css: {
		lightningcss: {
			cssModules: true,
		},
	},
});
