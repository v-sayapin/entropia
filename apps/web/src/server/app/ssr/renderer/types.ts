import type { renderToStream } from 'solid-js/web';

import type { AppProps } from 'src/shared/types/app';
import type { RenderOptions } from 'src/shared/types/render';

type RenderStream = ReturnType<typeof renderToStream>;

export type RenderFunction = (props: AppProps, options?: RenderOptions) => RenderStream;

export type RenderModule = {
	render: RenderFunction;
};
