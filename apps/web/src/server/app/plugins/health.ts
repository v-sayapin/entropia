import type { FastifyPluginAsync } from 'fastify';

export const healthPlugin: FastifyPluginAsync = async (app) => {
	app.get('/health', async (_request, reply) => {
		reply.header('Cache-Control', 'no-store');
		return { status: 'ok' };
	});
};
