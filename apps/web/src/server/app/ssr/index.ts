import { PassThrough } from 'node:stream';

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { createSsrRuntime } from 'server/app/ssr/runtime';

type SsrProcessor = (request: FastifyRequest, reply: FastifyReply) => Promise<void>;

export const getSsrProcessor = async (app: FastifyInstance): Promise<SsrProcessor> => {
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
			cspNonce: reply.cspNonce,
			url: request.url,
		});

		stream.pipe(body);

		return reply.send(body);
	};
};
