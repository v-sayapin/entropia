import { resolve } from 'node:path';

import type { ViteDevServer } from 'vite';
import { isRunnableDevEnvironment } from 'vite';

import type { RenderModule } from 'src/server/app/ssr/renderer/types';
import { rootDir } from 'src/server/utils/env';

const devRenderEntry = resolve(rootDir, 'src/render.tsx');

export const createDevRendererGetter = async (vite: ViteDevServer) => {
	const ssrEnvironment = vite.environments.ssr;
	if (!isRunnableDevEnvironment(ssrEnvironment)) {
		throw new Error('Expected a runnable SSR environment in dev');
	}

	return async () => ((await ssrEnvironment.runner.import(devRenderEntry)) as RenderModule).render;
};
