/* @refresh reload */

import { hydrate } from 'solid-js/web';

import { App } from 'src/client/app/App';

hydrate(() => <App />, document);
