import { HydrationScript as HydrationServerScript } from 'solid-js/web';
import type { Component } from 'solid-js';

import type { HydrationResources } from 'shared/app/types/hydrationResources';
import type { CspNonce } from 'shared/app/types/security/contentSecurityPolicy';

import { LinkAssetsPreload } from 'client/app/document/Head/LinkPreload/Assets';
import { LinkModulesPreload } from 'client/app/document/Head/LinkPreload/Modules';
import { LinkStylesPreload } from 'client/app/document/Head/LinkPreload/Styles';
import { LinkStyles } from 'client/app/document/Head/LinkStyles';
import { MetaViteCspNonce } from 'client/app/document/Head/MetaViteCspNonce';

const HydrationScript = HydrationServerScript as Component<{ nonce: string }>;

type HeadProps = {
	title: string;
	hydrationResources: HydrationResources;
	cspNonce: CspNonce;
};

export const Head: Component<HeadProps> = (props) => {
	return (
		<head>
			<meta charset='UTF-8' />
			<link rel='icon' type='image/svg+xml' href='/favicon.svg' />
			<meta name='viewport' content='width=device-width, initial-scale=1.0' />
			<title>{props.title}</title>

			<MetaViteCspNonce cspNonce={props.cspNonce} />

			<HydrationScript nonce={props.cspNonce.script} />

			<LinkStylesPreload
				styles={props.hydrationResources.entry.styles}
				nonce={props.cspNonce.style}
				highPriority
			/>
			<LinkModulesPreload
				modules={[props.hydrationResources.entry.module]}
				nonce={props.cspNonce.script}
				highPriority
			/>
			<LinkModulesPreload
				modules={props.hydrationResources.entry.modulePreloads}
				nonce={props.cspNonce.script}
			/>
			<LinkAssetsPreload assets={props.hydrationResources.entry.preloads} />

			<LinkStylesPreload
				styles={props.hydrationResources.route?.styles}
				nonce={props.cspNonce.style}
			/>
			<LinkModulesPreload
				modules={props.hydrationResources.route?.modulePreloads}
				nonce={props.cspNonce.script}
			/>
			<LinkAssetsPreload assets={props.hydrationResources.route?.preloads} />

			<LinkStyles
				styles={props.hydrationResources.entry.styles}
				nonce={props.cspNonce.style}
			/>
			<LinkStyles
				styles={props.hydrationResources.route?.styles}
				nonce={props.cspNonce.style}
			/>
			<script
				type='module'
				src={props.hydrationResources.entry.module}
				nonce={props.cspNonce.script}
				defer
			/>
		</head>
	);
};
