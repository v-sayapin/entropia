import type { RenderFunction } from 'shared/app/types/render';

export type RenderFunctionGetter = () => Promise<RenderFunction>;
