import type { FastifyInstance } from 'fastify';

import { clientDistDir } from 'server/app/env';
import { createRenderFnGetter } from 'server/ssr/render';
import { createHydrationResourcesGetter } from 'server/ssr/resources';
import type { RenderFunctionGetter } from 'server/ssr/render/types';
import type { HydrationResourcesGetter } from 'server/ssr/resources/types';

const HYDRATION_ENTRY_ID = 'src/hydrate.tsx';

type SsrRuntime = {
	getHydrationResources: HydrationResourcesGetter;
	getRenderFunction: RenderFunctionGetter;
};

export const createSsrRuntime = async (app: FastifyInstance): Promise<SsrRuntime> => {
	const [getHydrationResources, getRenderFunction] = await Promise.all([
		createHydrationResourcesGetter(clientDistDir, HYDRATION_ENTRY_ID, app),
		createRenderFnGetter(app),
	]);

	return {
		getHydrationResources,
		getRenderFunction,
	};
};
