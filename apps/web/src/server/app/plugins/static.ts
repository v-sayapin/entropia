import { relative, sep } from 'node:path';
import type { Stats } from 'node:fs';

import fastifyStatic from '@fastify/static';
import plugin from 'fastify-plugin';
import type { SetHeadersResponse } from '@fastify/static';
import type { FastifyPluginAsync, FastifyReply } from 'fastify';

import { clientDistDir } from 'server/app/env';

const ONE_DAY = 60 * 60 * 24;
const ONE_YEAR = 60 * 60 * 24 * 365;

const toPublicPath = (path: string): string => relative(clientDistDir, path).split(sep).join('/');

const appendHeaderToken = (
	currentValue: ReturnType<FastifyReply['getHeader']>,
	token: string
): string => {
	const tokens = new Set(
		(currentValue ?? '')
			.toString()
			.split(',')
			.map((part) => part.trim())
			.filter(Boolean)
	);
	tokens.add(token);
	return [...tokens].join(', ');
};

const isImmutableAsset = (publicPath: string): boolean => publicPath.startsWith('assets/');

const setHeaders = (res: SetHeadersResponse, path: string, _stat: Stats): void => {
	const publicPath = toPublicPath(path);

	res.setHeader('Vary', appendHeaderToken(res.getHeader('Vary'), 'Accept-Encoding'));

	if (isImmutableAsset(publicPath)) {
		res.setHeader('Cache-Control', `public, max-age=${ONE_YEAR}, immutable`);
	} else {
		res.setHeader('Cache-Control', `public, max-age=${ONE_DAY}, must-revalidate`);
	}
};

const staticPluginDecorator: FastifyPluginAsync = async (app) => {
	await app.register(fastifyStatic, {
		root: clientDistDir,
		prefix: '/',
		wildcard: false,
		preCompressed: true,
		etag: true,
		cacheControl: false,
		globIgnore: ['**/.vite/**'],
		setHeaders,
	});
};

export const staticPlugin = plugin(staticPluginDecorator, { name: 'static' });
