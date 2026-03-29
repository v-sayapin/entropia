import { resolve } from 'node:path';
import zlib from 'zlib';

import { defineConfig } from 'vite';
import { compression, defineAlgorithm } from 'vite-plugin-compression2';
import solid from 'vite-plugin-solid';

export default defineConfig(({ isSsrBuild }) => ({
	resolve: {
		alias: {
			client: resolve(import.meta.dirname, 'src/client'),
			shared: resolve(import.meta.dirname, 'src/shared'),
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
	build: {
		manifest: !isSsrBuild,
		copyPublicDir: !isSsrBuild,
		minify: !isSsrBuild,
		sourcemap: isSsrBuild || process.env.NODE_ENV !== 'production' ? 'hidden' : false,
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
