import rateLimit from '@fastify/rate-limit';
import plugin from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

const rateLimitPluginDecorator: FastifyPluginAsync = async (app) => {
	await app.register(rateLimit, {
		global: false,
		skipOnError: false,
		enableDraftSpec: true,
		keyGenerator: (request) => request.ip,
		errorResponseBuilder: (_request, context) => ({
			statusCode: 429,
			error: 'Too Many Requests',
			message: `Rate limit exceeded, retry in ${context.after}`,
		}),
	});
};

export const rateLimitPlugin = plugin(rateLimitPluginDecorator, { name: 'rate-limit' });
