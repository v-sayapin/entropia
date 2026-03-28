import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const srcDir = resolve(import.meta.dirname, 'src');

export default defineConfig(({ isSsrBuild }) => ({
	resolve: {
		alias: {
			'src/client': resolve(srcDir, 'client'),
			'src/shared': resolve(srcDir, 'shared'),
		},
	},
	plugins: [solid({ ssr: true })],
	publicDir: resolve(srcDir, 'client/public'),
	build: {
		manifest: !isSsrBuild,
		copyPublicDir: !isSsrBuild,
		minify: !isSsrBuild,
		sourcemap: isSsrBuild || process.env.NODE_ENV !== 'production' ? 'hidden' : false,
		rolldownOptions: {
			input: resolve(srcDir, isSsrBuild ? 'render.tsx' : 'hydrate.tsx'),
		},
		outDir: isSsrBuild ? 'dist/server' : 'dist/client',
		emptyOutDir: false,
	},
	css: {
		lightningcss: {
			cssModules: true,
		},
	},
}));
