import plugin from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

import { createCspNonce } from 'server/app/security/contentSecurityPolicy';

const cspNoncePluginDecorator: FastifyPluginAsync = async (app) => {
	app.addHook('onRequest', async (_request, reply) => {
		reply.cspNonce = createCspNonce();
	});
};

export const cspNoncePlugin = plugin(cspNoncePluginDecorator, { name: 'csp-nonce' });
