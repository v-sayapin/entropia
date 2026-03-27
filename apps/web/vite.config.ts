import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
	resolve: {
		alias: {
			client: resolve(import.meta.dirname, 'src/client'),
		},
	},
	plugins: [solid()],
	build: {
		outDir: 'dist/client',
		emptyOutDir: false,
	},
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			cssModules: {
				pattern: '[local]_[hash]',
				pure: true,
			},
		},
	},
});
