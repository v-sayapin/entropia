import plugin from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

import { getSsrProcessor } from 'server/app/ssr';

const SSR_RATE_LIMIT_CONFIG = {
	max: 100,
	timeWindow: '1 minute',
} as const;

const ssrPluginDecorator: FastifyPluginAsync = async (app) => {
	const ssrProcessor = await getSsrProcessor(app);

	app.get(
		'*',
		{
			config: {
				rateLimit: SSR_RATE_LIMIT_CONFIG,
			},
		},
		ssrProcessor
	);
};

export const ssrPlugin = plugin(ssrPluginDecorator, {
	name: 'ssr',
	dependencies: ['rate-limit', 'csp-nonce', 'security-headers'],
	encapsulate: true,
});
