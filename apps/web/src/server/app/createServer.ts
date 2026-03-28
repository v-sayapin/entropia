import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';

import { getSsrProcessor } from 'src/server/app/ssr';
import { clientDistDir, isProduction } from 'src/server/utils/env';

export const createServer = async () => {
	const app = Fastify({
		logger: true,
		exposeHeadRoutes: false,
	});

	if (isProduction) {
		await app.register(fastifyStatic, {
			root: clientDistDir,
			prefix: '/',
			wildcard: false,
			etag: true,
			maxAge: '30d',
			globIgnore: ['**/.vite/**'],
		});
	} else {
		const { vitePlugin } = await import('src/server/app/plugins/vite');
		await app.register(vitePlugin);
	}

	const ssrProcessor = await getSsrProcessor(app);

	app.get('*', ssrProcessor);

	return app;
};
