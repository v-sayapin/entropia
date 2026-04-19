import helmet from '@fastify/helmet';
import plugin from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

import { viteHost, vitePort } from 'server/app/env';

const HSTS_MAX_AGE_IN_SECONDS = 60 * 60 * 24 * 365 * 2; // two years

const helmetPluginDecorator: FastifyPluginAsync = async (app) => {
	await app.register(helmet, {
		crossOriginEmbedderPolicy: true,
		enableCSPNonces: true,
		contentSecurityPolicy: {
			directives: {
				connectSrc:
					process.env.NODE_ENV === 'production'
						? [`'self'`]
						: [`'self'`, `ws://${viteHost}:${vitePort}`],
				frameAncestors: [`'none'`],
				scriptSrc: [`'strict-dynamic'`],
			},
		},
		frameguard: { action: 'deny' },
		hsts: { maxAge: HSTS_MAX_AGE_IN_SECONDS, includeSubDomains: true, preload: true },
	});
};

export const helmetPlugin = plugin(helmetPluginDecorator, { name: 'helmet' });
