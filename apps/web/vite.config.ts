import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig(({ isSsrBuild }) => ({
	resolve: {
		alias: {
			client: resolve(import.meta.dirname, 'src/client'),
			shared: resolve(import.meta.dirname, 'src/shared'),
		},
	},
	plugins: [solid({ ssr: true })],
	build: {
		manifest: !isSsrBuild,
		copyPublicDir: !isSsrBuild,
		minify: !isSsrBuild,
		sourcemap: isSsrBuild || process.env['NODE_ENV'] !== 'production' ? 'hidden' : false,
		rolldownOptions: {
			input: resolve(import.meta.dirname, 'src', isSsrBuild ? 'render.tsx' : 'hydrate.tsx'),
		},
		outDir: isSsrBuild ? 'dist/server' : 'dist/client',
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
}));
