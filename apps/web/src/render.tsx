import { renderToStream } from 'solid-js/web';

import { App } from 'src/client/app/App';
import type { AppProps } from 'src/shared/types/app';

export const render = (props: AppProps) => renderToStream(() => <App {...props} />);
