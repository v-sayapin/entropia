import { renderToStream } from 'solid-js/web';

import { App } from 'src/client/app/App';
import type { AppProps } from 'src/shared/types/app';
import type { RenderOptions } from 'src/shared/types/render';

export const render = (props: Required<AppProps>, options: RenderOptions = {}) =>
	// oxlint-disable-next-line solid/reactivity
	renderToStream(() => <App {...props} />, { nonce: props.nonce, ...options });
