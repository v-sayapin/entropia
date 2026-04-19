import plugin from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

import { buildCspHeader } from 'server/app/security/contentSecurityPolicy';
import { PERMISSIONS_POLICY_HEADER } from 'server/app/security/permissionsPolicy';

const securityHeadersPluginDecorator: FastifyPluginAsync = async (app) => {
	app.addHook('onSend', async (request, reply, payload) => {
		const contentType = reply.getHeader('content-type');

		if (typeof contentType !== 'string' || !contentType.startsWith('text/html')) {
			return payload;
		}

		reply.header('Content-Security-Policy', buildCspHeader(request, reply.cspNonce));
		reply.header('Permissions-Policy', PERMISSIONS_POLICY_HEADER);

		return payload;
	});
};

export const securityHeadersPlugin = plugin(securityHeadersPluginDecorator, {
	name: 'security-headers',
	dependencies: ['csp-nonce'],
});
