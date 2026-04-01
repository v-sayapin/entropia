import { HydrationScript } from 'solid-js/web';
import type { Component } from 'solid-js';

import type { HydrationResources } from 'shared/app/types/hydrationResources';

import { LinkAssetsPreload } from 'client/app/document/Head/LinkPreload/Assets';
import { LinkModulesPreload } from 'client/app/document/Head/LinkPreload/Modules';
import { LinkStylesPreload } from 'client/app/document/Head/LinkPreload/Styles';
import { LinkStyles } from 'client/app/document/Head/LinkStyles';

type HeadProps = {
	title: string;
	hydrationResources: HydrationResources;
};

export const Head: Component<HeadProps> = (props) => {
	return (
		<head>
			<meta charset='UTF-8' />
			<link rel='icon' type='image/svg+xml' href='/favicon.svg' />
			<meta name='viewport' content='width=device-width, initial-scale=1.0' />
			<title>{props.title}</title>

			<HydrationScript />

			<LinkStylesPreload styles={props.hydrationResources.entry.styles} highPriority />
			<LinkModulesPreload modules={[props.hydrationResources.entry.module]} highPriority />
			<LinkModulesPreload modules={props.hydrationResources.entry.modulePreloads} />
			<LinkAssetsPreload assets={props.hydrationResources.entry.preloads} />

			<LinkStylesPreload styles={props.hydrationResources.route?.styles} />
			<LinkModulesPreload modules={props.hydrationResources.route?.modulePreloads} />
			<LinkAssetsPreload assets={props.hydrationResources.route?.preloads} />

			<LinkStyles styles={props.hydrationResources.entry.styles} />
			<LinkStyles styles={props.hydrationResources.route?.styles} />
			<script type='module' src={props.hydrationResources.entry.module} defer />
		</head>
	);
};
