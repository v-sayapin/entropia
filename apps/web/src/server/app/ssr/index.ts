import { randomBytes } from 'node:crypto';
import { PassThrough } from 'node:stream';

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { createSsrRuntime } from 'src/server/app/ssr/runtime';

const buildCsp = (nonce: string) =>
	[
		`default-src 'none'`,

		`script-src 'nonce-${nonce}' 'strict-dynamic'`,
		`style-src 'self'`,
		`img-src 'self' data:`,
		`font-src 'self'`,
		`connect-src 'self'`,

		`object-src 'none'`,
		`base-uri 'none'`,
		`frame-src 'none'`,
		`frame-ancestors 'none'`,
		`form-action 'self'`,
		`worker-src 'none'`,

		`upgrade-insecure-requests`,
	].join('; ');

export const getSsrProcessor = async (app: FastifyInstance) => {
	const runtime = await createSsrRuntime(app);

	return async (request: FastifyRequest, reply: FastifyReply) => {
		const [render, hydrationResources] = await Promise.all([
			runtime.getRenderFunction(),
			runtime.getHydrationResources(request.url),
		]);

		const nonce = randomBytes(32).toString('base64url');

		const body = new PassThrough();

		reply.header('Cache-Control', 'no-store');
		reply.header('Content-Security-Policy', buildCsp(nonce));
		reply.type('text/html; charset=utf-8');

		body.write('<!DOCTYPE html>');

		try {
			const stream = render({ hydrationResources, url: request.url, nonce });
			stream.pipe(body);
		} catch (error) {
			app.log.error(error);
			body.destroy(error instanceof Error ? error : new Error(String(error)));
		}

		return reply.send(body);
	};
};
