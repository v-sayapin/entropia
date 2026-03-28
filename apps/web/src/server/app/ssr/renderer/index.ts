import type { FastifyInstance } from 'fastify';
import type { ViteDevServer } from 'vite';

import { createProdRendererGetter } from 'src/server/app/ssr/renderer/prod';
import { isProduction } from 'src/server/utils/env';

export const createRendererGetter = async (app: FastifyInstance) => {
	if (isProduction) {
		return createProdRendererGetter();
	}
	const vite = app.getDecorator<ViteDevServer>('vite');
	const { createDevRendererGetter } = await import('src/server/app/ssr/renderer/dev');
	return createDevRendererGetter(vite);
};
