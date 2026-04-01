/* @refresh reload */

import { HydrationScript } from 'solid-js/web';

import { LinkAssetsPreload } from 'src/client/app/LinkPreload/Assets';
import { LinkModulesPreload } from 'src/client/app/LinkPreload/Modules';
import { LinkStylesPreload } from 'src/client/app/LinkPreload/Styles';
import { LinkStyles } from 'src/client/app/LinkStyles';
import { Content } from 'src/client/components/Content';
import type { AppProps } from 'src/shared/types/app';

import 'src/client/app/App.css';

export const App = (props: AppProps) => {
	return (
		<html lang='en'>
			<head>
				<meta charset='UTF-8' />
				<link rel='icon' type='image/svg+xml' href='/favicon.svg' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>entropia</title>

				<HydrationScript />

				<LinkStylesPreload styles={props.hydrationResources?.entry.styles} highPriority />
				<LinkModulesPreload
					modules={
						props.hydrationResources?.entry.module
							? [props.hydrationResources.entry.module]
							: undefined
					}
					highPriority
				/>
				<LinkModulesPreload modules={props.hydrationResources?.entry.modulePreloads} />
				<LinkAssetsPreload assets={props.hydrationResources?.entry.preloads} />

				<LinkStylesPreload styles={props.hydrationResources?.route?.styles} />
				<LinkModulesPreload modules={props.hydrationResources?.route?.modulePreloads} />
				<LinkAssetsPreload assets={props.hydrationResources?.route?.preloads} />

				<LinkStyles styles={props.hydrationResources?.entry.styles} />
				<LinkStyles styles={props.hydrationResources?.route?.styles} />
				<script type='module' src={props.hydrationResources?.entry.module} defer />
			</head>
			<body>
				<div id='root'>
					<Content />
				</div>
			</body>
		</html>
	);
};
