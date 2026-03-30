import type { FastifyInstance } from 'fastify';
import type { ViteDevServer } from 'vite';

import { createProdHydrationResourcesGetter } from 'server/app/ssr/hydrationResources/prod';
import type { HydrationResourcesGetter } from 'server/app/ssr/hydrationResources/types';

export const createHydrationResourcesGetter = async (
	clientDistDir: string,
	entryId: string,
	app: FastifyInstance
): Promise<HydrationResourcesGetter> => {
	if (process.env.NODE_ENV === 'production') {
		return createProdHydrationResourcesGetter(clientDistDir, entryId);
	}

	const vite = app.getDecorator<ViteDevServer>('vite');
	const { createDevHydrationResourcesGetter } =
		await import('server/app/ssr/hydrationResources/dev');
	return createDevHydrationResourcesGetter(entryId, vite);
};
