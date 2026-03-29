import type { FastifyInstance } from 'fastify';
import type { ViteDevServer } from 'vite';

import { createProdRenderFnGetter } from 'server/app/ssr/render/prod';
import type { RenderFunctionGetter } from 'server/app/ssr/render/types';

export const createRenderFnGetter = async (app: FastifyInstance): Promise<RenderFunctionGetter> => {
	if (process.env.NODE_ENV === 'production') {
		return createProdRenderFnGetter();
	}

	const vite = app.getDecorator<ViteDevServer>('vite');
	const { createDevRenderFnGetter } = await import('server/app/ssr/render/dev');
	return createDevRenderFnGetter(vite);
};
