import type { renderToStream } from 'solid-js/web';

import type { AppProps } from 'src/shared/types/app';

type RenderStream = ReturnType<typeof renderToStream>;

type RenderFunction = (props: AppProps) => RenderStream;

export type RenderModule = {
	render: RenderFunction;
};
