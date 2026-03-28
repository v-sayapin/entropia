import type { FastifyInstance } from 'fastify';

import { createHydrationResourcesGetter } from 'src/server/app/ssr/hydrationResources';
import { createRendererGetter } from 'src/server/app/ssr/renderer';
import { clientDistDir } from 'src/server/utils/env';

const hydrationEntryId = 'src/hydrate.tsx';

export const createSsrRuntime = async (app: FastifyInstance) => {
	const [getRenderFunction, getHydrationResources] = await Promise.all([
		createRendererGetter(app),
		createHydrationResourcesGetter(clientDistDir, hydrationEntryId, app),
	]);

	return {
		getRenderFunction,
		getHydrationResources,
	};
};
