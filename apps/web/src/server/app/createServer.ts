import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

import { cspNoncePlugin } from 'server/app/plugins/cspNonce';
import { helmetPlugin } from 'server/app/plugins/helmet';
import { securityHeadersPlugin } from 'server/app/plugins/securityHeaders';
import { securityReportingPlugin } from 'server/app/plugins/securityReporting';
import { ssrPlugin } from 'server/app/plugins/ssr';
import { staticPlugin } from 'server/app/plugins/static';
import { SECURITY_REPORTS_PREFIX } from 'server/app/security/reporting/endpoints';

export const createServer = async (): Promise<FastifyInstance> => {
	const app = Fastify({
		logger: true,
		exposeHeadRoutes: false,
		ajv: {
			customOptions: {
				coerceTypes: false,
				removeAdditional: false,
			},
		},
	});

	await app.register(cspNoncePlugin);
	await app.register(helmetPlugin);
	await app.register(securityHeadersPlugin);
	await app.register(securityReportingPlugin, { prefix: SECURITY_REPORTS_PREFIX });

	if (process.env.NODE_ENV === 'production') {
		await app.register(staticPlugin);
	} else {
		const { vitePlugin } = await import('server/app/plugins/vite');
		await app.register(vitePlugin);
	}

	await app.register(ssrPlugin);

	return app;
};
