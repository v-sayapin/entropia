import type { FastifyInstance } from 'fastify';
import type { ViteDevServer } from 'vite';

import { createProdHydrationResourcesGetter } from 'server/ssr/resources/prod';
import type { HydrationResourcesGetter } from 'server/ssr/resources/types';

export const createHydrationResourcesGetter = async (
	clientDistDir: string,
	entryId: string,
	app: FastifyInstance
): Promise<HydrationResourcesGetter> => {
	if (process.env.NODE_ENV === 'production') {
		return createProdHydrationResourcesGetter(clientDistDir, entryId);
	}

	const vite = app.getDecorator<ViteDevServer>('vite');
	const { createDevHydrationResourcesGetter } = await import('server/ssr/resources/dev');
	return createDevHydrationResourcesGetter(entryId, vite);
};
