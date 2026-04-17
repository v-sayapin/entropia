import plugin from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

import { buildCspHeader } from 'server/app/security/contentSecurityPolicy';
import { CROSS_ORIGIN_EMBEDDER_POLICY_HEADER } from 'server/app/security/crossOriginEmbedderPolicy';
import { PERMISSIONS_POLICY_HEADER } from 'server/app/security/permissionsPolicy';
import { buildReportingEndpointsHeader } from 'server/app/security/reporting/endpoints';

const securityHeadersPluginDecorator: FastifyPluginAsync = async (app) => {
	app.addHook('onSend', async (request, reply, payload) => {
		const contentType = reply.getHeader('content-type');

		if (typeof contentType !== 'string' || !contentType.startsWith('text/html')) {
			return payload;
		}

		reply.header('Content-Security-Policy', buildCspHeader(request, reply.cspNonce));
		reply.header('Cross-Origin-Embedder-Policy', CROSS_ORIGIN_EMBEDDER_POLICY_HEADER);
		reply.header('Permissions-Policy', PERMISSIONS_POLICY_HEADER);
		reply.header('Reporting-Endpoints', buildReportingEndpointsHeader(request));

		return payload;
	});
};

export const securityHeadersPlugin = plugin(securityHeadersPluginDecorator, {
	name: 'security-headers',
	dependencies: ['csp-nonce'],
});
