import { resolve } from 'node:path';

import type { RenderModule } from 'shared/app/types/render';

import { serverDistDir } from 'server/app/env';
import type { RenderFunctionGetter } from 'server/ssr/render/types';

const prodModule = resolve(serverDistDir, 'render.js');

export const createProdRenderFnGetter = async (): Promise<RenderFunctionGetter> => {
	const { render } = (await import(prodModule)) as RenderModule;

	return async () => render;
};
