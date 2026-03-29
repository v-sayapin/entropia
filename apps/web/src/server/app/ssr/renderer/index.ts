import type { FastifyInstance } from 'fastify';
import type { ViteDevServer } from 'vite';

import { createProdRendererGetter } from 'src/server/app/ssr/renderer/prod';

export const createRendererGetter = async (app: FastifyInstance) => {
	if (process.env.NODE_ENV === 'production') {
		return createProdRendererGetter();
	}
	const vite = app.getDecorator<ViteDevServer>('vite');
	const { createDevRendererGetter } = await import('src/server/app/ssr/renderer/dev');
	return createDevRendererGetter(vite);
};
