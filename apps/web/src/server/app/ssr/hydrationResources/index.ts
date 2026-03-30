import type { FastifyInstance } from 'fastify';
import type { ViteDevServer } from 'vite';

import { createProdHydrationResourcesGetter } from 'src/server/app/ssr/hydrationResources/prod';

export const createHydrationResourcesGetter = async (
	clientDistDir: string,
	entryId: string,
	app: FastifyInstance
) => {
	if (process.env.NODE_ENV === 'production') {
		return createProdHydrationResourcesGetter(clientDistDir, entryId);
	}
	const vite = app.getDecorator<ViteDevServer>('vite');
	const { createDevHydrationResourcesGetter } =
		await import('src/server/app/ssr/hydrationResources/dev');
	return createDevHydrationResourcesGetter(entryId, vite);
};
