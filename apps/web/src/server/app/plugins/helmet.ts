import { randomBytes } from 'node:crypto';

import helmet from '@fastify/helmet';
import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import plugin from 'fastify-plugin';

const TWO_YEARS_IN_SECONDS = 60 * 60 * 24 * 365 * 2;

const createCspNonce = (): string => randomBytes(32).toString('base64');

const buildCspHeader = (request: FastifyRequest, scriptNonce: string): string =>
	[
		`default-src 'none'`,

		process.env.NODE_ENV === 'production'
			? `connect-src 'self'`
			: `connect-src 'self' ${request.protocol === 'https' ? 'wss' : 'ws'}://${request.hostname}:*`,
		`font-src 'self'`,
		`img-src 'self' data:`,
		`script-src 'strict-dynamic' 'nonce-${scriptNonce}'`,
		process.env.NODE_ENV === 'production'
			? `style-src 'self'`
			: `style-src 'self' 'unsafe-inline'`,

		`base-uri 'none'`,
		`form-action 'none'`,
		`frame-ancestors 'none'`,
		`manifest-src 'none'`,
		`object-src 'none'`,
		`script-src-attr 'none'`,
		`style-src-attr 'none'`,
		`require-trusted-types-for 'script'`,
		`worker-src 'none'`,

		...(process.env.NODE_ENV === 'production' ? ['upgrade-insecure-requests'] : []),

		// TODO: add csp endpoint for logging
		// `report-to csp-endpoint-name`
	].join('; ');

const permissionsPolicy = [
	'bluetooth=()',
	'camera=()',
	'captured-surface-control=()',
	'ch-ua-high-entropy-values=()',
	'display-capture=()',
	'fullscreen=()',
	'geolocation=()',
	'hid=()',
	'identity-credentials-get=()',
	'idle-detection=()',
	'local-fonts=()',
	'local-network-access=()',
	'local-network=()',
	'loopback-network=()',
	'microphone=()',
	'midi=()',
	'otp-credentials=()',
	'payment=()',
	'private-state-token-issuance=()',
	'private-state-token-redemption=()',
	'publickey-credentials-create=()',
	'publickey-credentials-get=()',
	'screen-wake-lock=()',
	'serial=()',
	'storage-access=()',
	'usb=()',
	'window-management=()',
	'xr-spatial-tracking=()',
].join(', ');

const helmetPluginDecorator: FastifyPluginAsync = async (app) => {
	app.addHook('onRequest', async (_request, reply) => {
		reply.cspNonce = { script: createCspNonce(), style: '' };
	});

	app.addHook('onSend', async (request, reply, payload) => {
		const contentType = reply.getHeader('content-type');
		if (typeof contentType !== 'string' || !contentType.startsWith('text/html')) {
			return payload;
		}

		reply.header('Content-Security-Policy', buildCspHeader(request, reply.cspNonce.script));
		reply.header('Permissions-Policy', permissionsPolicy);

		if (process.env.NODE_ENV === 'production') {
			reply.header('Cross-Origin-Embedder-Policy', 'require-corp');
		}
		return payload;
	});

	await app.register(helmet, {
		contentSecurityPolicy: false,
		crossOriginEmbedderPolicy: false,
		frameguard: { action: 'deny' },
		hsts:
			process.env.NODE_ENV === 'production'
				? { maxAge: TWO_YEARS_IN_SECONDS, includeSubDomains: true, preload: true }
				: false,
	});
};

export const helmetPlugin = plugin(helmetPluginDecorator, { name: 'helmet' });
