import { resolve } from 'node:path';

import type { RenderModule } from 'src/server/app/ssr/renderer/types';
import { serverDistDir } from 'src/server/utils/env';

const prodRenderEntry = resolve(serverDistDir, 'render.js');

export const createProdRendererGetter = async () => {
	const { render } = (await import(prodRenderEntry)) as RenderModule;

	return async () => render;
};
