import { resolve } from 'node:path';

import { isRunnableDevEnvironment } from 'vite';
import type { ViteDevServer } from 'vite';

import type { RenderModule } from 'shared/app/types/render';

import { rootDir } from 'server/app/env';
import type { RenderFunctionGetter } from 'server/app/ssr/render/types';

const devModule = resolve(rootDir, 'src/render.tsx');

export const createDevRenderFnGetter = async (
	vite: ViteDevServer
): Promise<RenderFunctionGetter> => {
	const ssrEnvironment = vite.environments.ssr;
	if (!isRunnableDevEnvironment(ssrEnvironment)) {
		throw new Error('Expected a runnable SSR environment in dev');
	}

	return async () => ((await ssrEnvironment.runner.import(devModule)) as RenderModule).render;
};
