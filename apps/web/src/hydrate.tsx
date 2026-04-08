/* @refresh reload */

import { hydrate } from 'solid-js/web';
import type { ParentComponent } from 'solid-js';

import { App } from 'client/app/App';

import 'client/app/styles/reset.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Missing #root element for hydration');
}

const Dummy: ParentComponent = (props) =>
	// oxlint-disable-next-line solid/reactivity
	props.children;

// Passthrough component used only to align Solid hydration keys with the server-side tree.
// Do not remove unless the server wrapper structure changes.
hydrate(
	() => (
		<Dummy>
			<Dummy>
				<Dummy>
					<App
					// TODO: Add app props passthrough for SSR hydration.
					/>
				</Dummy>
			</Dummy>
		</Dummy>
	),
	rootElement
);
