import { randomBytes } from 'node:crypto';

import type { FastifyRequest } from 'fastify';

import type { CspNonce } from 'shared/app/types/security/contentSecurityPolicy';

import { viteHost, vitePort } from 'server/app/env';

const randomB64String = (): string => randomBytes(32).toString('base64');

export const createCspNonce = (): CspNonce => ({
	script: randomB64String(),
	style: randomB64String(),
});

const getDevHmrWebSocketSource = (request: FastifyRequest): string => {
	const wsProtocol = request.protocol === 'https' ? 'wss' : 'ws';

	return `${wsProtocol}://${viteHost}:${vitePort}`;
};

export const buildCspHeader = (request: FastifyRequest, cspNonce: CspNonce): string =>
	[
		`default-src 'none'`,

		process.env.NODE_ENV === 'production'
			? `connect-src 'self'`
			: `connect-src 'self' ${getDevHmrWebSocketSource(request)}`,

		`font-src 'self'`,
		`img-src 'self' data:`,
		`script-src 'strict-dynamic' 'nonce-${cspNonce.script}'`,
		`style-src 'nonce-${cspNonce.style}'`,

		`base-uri 'none'`,
		`form-action 'none'`,
		`frame-ancestors 'none'`,
		`manifest-src 'none'`,
		`object-src 'none'`,
		`script-src-attr 'none'`,
		`style-src-attr 'none'`,
		`worker-src 'none'`,

		...(process.env.NODE_ENV === 'production' ? ['upgrade-insecure-requests'] : []),

		// TODO: add csp endpoint for logging
		// `report-to csp`
	].join('; ');
