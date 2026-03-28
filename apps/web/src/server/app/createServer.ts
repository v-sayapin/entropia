import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

import { isProduction } from 'server/app/env';
import { staticPlugin } from 'server/app/plugins/static';
import { getSsrProcessor } from 'server/app/ssr';

export const createServer = async (): Promise<FastifyInstance> => {
	const app = Fastify({
		logger: true,
		exposeHeadRoutes: false,
	});

	if (isProduction) {
		await app.register(staticPlugin);
	} else {
		const { vitePlugin } = await import('server/app/plugins/vite');
		await app.register(vitePlugin);
	}

	const ssrProcessor = await getSsrProcessor(app);

	app.get('*', ssrProcessor);

	return app;
};
