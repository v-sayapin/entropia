import { For } from 'solid-js';
import type { Component } from 'solid-js';

import type { AssetPreload } from 'src/shared/types/hydrationResources';

type LinkAssetsPreloadProps = {
	assets: Array<AssetPreload> | null | undefined;
};

export const LinkAssetsPreload: Component<LinkAssetsPreloadProps> = (props) => (
	<For each={props.assets}>
		{({ href, as, type }) => <link rel='preload' href={href} as={as} type={type} />}
	</For>
);
