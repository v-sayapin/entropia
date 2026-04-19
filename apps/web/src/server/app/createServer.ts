import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

import { cspNoncePlugin } from 'server/app/plugins/cspNonce';
import { helmetPlugin } from 'server/app/plugins/helmet';
import { securityHeadersPlugin } from 'server/app/plugins/securityHeaders';
import { staticPlugin } from 'server/app/plugins/static';
import { getSsrProcessor } from 'server/app/ssr';

export const createServer = async (): Promise<FastifyInstance> => {
	const app = Fastify({
		logger: true,
		exposeHeadRoutes: false,
	});

	await app.register(cspNoncePlugin);
	await app.register(helmetPlugin);
	await app.register(securityHeadersPlugin);

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
