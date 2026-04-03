import Fastify from 'fastify';

import { helmetPlugin } from 'src/server/app/plugins/helmet';
import { rateLimitPlugin, ssrRateLimitConfig } from 'src/server/app/plugins/rateLimit';
import { staticPlugin } from 'src/server/app/plugins/static';
import { getSsrProcessor } from 'src/server/app/ssr';
import {
	connectionTimeoutMs,
	keepAliveTimeoutMs,
	requestTimeoutMs,
	trustProxy,
} from 'src/server/utils/env';

export const createServer = async () => {
	const app = Fastify({
		logger: true,
		exposeHeadRoutes: false,
		trustProxy,
		connectionTimeout: connectionTimeoutMs,
		requestTimeout: requestTimeoutMs,
		keepAliveTimeout: keepAliveTimeoutMs,
	});

	await app.register(helmetPlugin);

	if (process.env.NODE_ENV === 'production') {
		await app.register(rateLimitPlugin);
		await app.register(staticPlugin);
	} else {
		const { vitePlugin } = await import('src/server/app/plugins/vite');
		await app.register(vitePlugin);
	}

	const ssrProcessor = await getSsrProcessor(app);

	app.get(
		'*',
		{
			config: {
				rateLimit: ssrRateLimitConfig,
			},
		},
		ssrProcessor
	);

	return app;
};
