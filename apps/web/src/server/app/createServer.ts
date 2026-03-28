import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';


import { clientDistDir, isProduction } from 'server/app/env';
import { getSsrProcessor } from 'server/app/ssr';

export const createServer = async (): Promise<FastifyInstance> => {
	const app = Fastify({
		logger: true,
		exposeHeadRoutes: false,
	});

	if (isProduction) {
		await app.register(fastifyStatic, {
			root: clientDistDir,
			prefix: '/',
			wildcard: false,
			preCompressed: true,
			etag: true,
			maxAge: '30d',
			globIgnore: ['**/.vite/**'],
		});
	} else {
		const { vitePlugin } = await import('server/app/plugins/vite');
		await app.register(vitePlugin);
	}

	const ssrProcessor = await getSsrProcessor(app);

	app.get('*', ssrProcessor);

	return app;
};
