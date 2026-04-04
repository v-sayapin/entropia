import { PassThrough } from 'node:stream';

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { createSsrRuntime } from 'src/server/app/ssr/runtime';

export const getSsrProcessor = async (app: FastifyInstance) => {
	const runtime = await createSsrRuntime(app);

	return async (request: FastifyRequest, reply: FastifyReply) => {
		const [render, hydrationResources] = await Promise.all([
			runtime.getRenderFunction(),
			runtime.getHydrationResources(request.url),
		]);

		reply.header('Cache-Control', 'no-store');
		reply.type('text/html; charset=utf-8');

		const body = new PassThrough();
		body.on('error', (error) => {
			request.log.error(error, 'Server response stream error');
			if (!reply.raw.destroyed) {
				reply.raw.destroy();
			}
		});

		body.write('<!DOCTYPE html>');

		const stream = render(
			{
				hydrationResources,
				url: request.url,
				nonce: reply.cspNonce.script,
			},
			{
				onError: (error) => request.log.error(error, 'SSR render error'),
			}
		);

		stream.pipe(body);

		return reply.send(body);
	};
};
