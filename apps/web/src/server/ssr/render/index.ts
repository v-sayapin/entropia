import type { FastifyInstance } from 'fastify';
import type { ViteDevServer } from 'vite';

import { createProdRenderFnGetter } from 'server/ssr/render/prod';
import type { RenderFunctionGetter } from 'server/ssr/render/types';

export const createRenderFnGetter = async (app: FastifyInstance): Promise<RenderFunctionGetter> => {
	if (process.env.NODE_ENV === 'production') {
		return createProdRenderFnGetter();
	}

	const vite = app.getDecorator<ViteDevServer>('vite');
	const { createDevRenderFnGetter } = await import('server/ssr/render/dev');
	return createDevRenderFnGetter(vite);
};
