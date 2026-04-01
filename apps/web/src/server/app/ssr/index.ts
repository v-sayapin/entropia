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

		const body = new PassThrough();

		reply.header('Cache-Control', 'no-store');
		reply.type('text/html; charset=utf-8');

		body.write('<!DOCTYPE html>');

		const stream = render({
			hydrationResources,
			url: request.url,
		});

		stream.pipe(body);

		return reply.send(body);
	};
};
