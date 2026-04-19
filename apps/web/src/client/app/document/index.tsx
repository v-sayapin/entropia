import { Hydration, NoHydration } from 'solid-js/web';
import type { Component } from 'solid-js';

import type { DocumentProps } from 'shared/app/types';

import { App } from 'client/app/App';
import { Head } from 'client/app/document/Head';

export const Document: Component<DocumentProps> = (props) => {
	return (
		<NoHydration>
			<html lang='en'>
				<Head
					title='entropia'
					hydrationResources={props.hydrationResources}
					cspNonce={props.cspNonce}
				/>
				<body>
					<div id='root'>
						<Hydration>
							<App {...props} />
						</Hydration>
					</div>
				</body>
			</html>
		</NoHydration>
	);
};
