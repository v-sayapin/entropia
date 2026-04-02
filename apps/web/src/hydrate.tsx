/* @refresh reload */

import { hydrate } from 'solid-js/web';

import { App } from 'src/client/app/App';
import type { AppProps } from 'src/shared/types/app';

declare global {
	// oxlint-disable-next-line typescript/consistent-type-definitions
	interface Window {
		__INITIAL_DATA__: AppProps;
	}
}

const root = document.getElementById('app');

if (!root) {
	throw new Error('App root element not found');
}

hydrate(() => App(window.__INITIAL_DATA__), root);
