import plugin from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

import { getSsrProcessor } from 'server/app/ssr';

const ssrPluginDecorator: FastifyPluginAsync = async (app) => {
	const ssrProcessor = await getSsrProcessor(app);

	app.get('*', ssrProcessor);
};

export const ssrPlugin = plugin(ssrPluginDecorator, {
	name: 'ssr',
	dependencies: ['csp-nonce', 'security-headers'],
	encapsulate: true,
});
