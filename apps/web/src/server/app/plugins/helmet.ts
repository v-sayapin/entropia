import helmet from '@fastify/helmet';
import plugin from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

const HSTS_MAX_AGE_IN_SECONDS = 60 * 60 * 24 * 365 * 2; // two years

const helmetPluginDecorator: FastifyPluginAsync = async (app) => {
	await app.register(helmet, {
		crossOriginEmbedderPolicy: true,
		frameguard: { action: 'deny' },
		hsts: { maxAge: HSTS_MAX_AGE_IN_SECONDS, includeSubDomains: true, preload: true },
		// set by securityHeadersPlugin
		contentSecurityPolicy: false,
	});
};

export const helmetPlugin = plugin(helmetPluginDecorator, { name: 'helmet' });
