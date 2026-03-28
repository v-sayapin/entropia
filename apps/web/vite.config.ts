import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import { compression, defineAlgorithm } from 'vite-plugin-compression2';
import solid from 'vite-plugin-solid';
import zlib from 'zlib';

const srcDir = resolve(import.meta.dirname, 'src');

export default defineConfig(({ isSsrBuild }) => ({
	resolve: {
		alias: {
			'src/client': resolve(srcDir, 'client'),
			'src/shared': resolve(srcDir, 'shared'),
		},
	},
	plugins: [
		solid({ ssr: true }),
		!isSsrBuild &&
			compression({
				include: [/\.(js|mjs|css|html|json|xml|svg|ttf)$/],
				exclude: [/manifest\.json$/],
				threshold: 1024,
				algorithms: [
					defineAlgorithm('brotliCompress', {
						params: {
							[zlib.constants.BROTLI_PARAM_QUALITY]: 11,
						},
					}),
					defineAlgorithm('gzip', { level: 9 }),
				],
			}),
	],
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
