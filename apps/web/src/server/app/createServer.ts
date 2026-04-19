import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

import { helmetPlugin } from 'server/app/plugins/helmet';
import { staticPlugin } from 'server/app/plugins/static';
import { getSsrProcessor } from 'server/app/ssr';

export const createServer = async (): Promise<FastifyInstance> => {
	const app = Fastify({
		logger: true,
		exposeHeadRoutes: false,
	});

	await app.register(helmetPlugin);

	if (process.env.NODE_ENV === 'production') {
		await app.register(staticPlugin);
	} else {
		const { vitePlugin } = await import('server/app/plugins/vite');
		await app.register(vitePlugin);
	}

	const ssrProcessor = await getSsrProcessor(app);

	app.get('*', ssrProcessor);

	return app;
};
