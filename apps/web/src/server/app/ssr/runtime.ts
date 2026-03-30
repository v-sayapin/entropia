import type { FastifyInstance } from 'fastify';

import { clientDistDir } from 'server/app/env';
import { createHydrationResourcesGetter } from 'server/app/ssr/hydrationResources';
import { createRenderFnGetter } from 'server/app/ssr/render';
import type { HydrationResourcesGetter } from 'server/app/ssr/hydrationResources/types';
import type { RenderFunctionGetter } from 'server/app/ssr/render/types';

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
