/* @refresh reload */

import { For } from 'solid-js';
import { HydrationScript } from 'solid-js/web';

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

			<For each={props.styles}>
				{(href) => <link rel='preload' href={href} as='style' type='text/css' fetchpriority='high' />}
			</For>
			{props.entry && <link rel='modulepreload' href={props.entry} fetchpriority='high' />}

			<For each={props.modulePreloads}>{(href) => <link rel='modulepreload' href={href} />}</For>
			<For each={props.preloads}>
				{({ href, as, type }) => <link rel='preload' href={href} as={as} type={type} />}
			</For>

			<For each={props.styles}>{(href) => <link rel='stylesheet' href={href} />}</For>
			{props.entry && <script type='module' src={props.entry} defer />}
		</head>
		<body>
		<div id='root'>
			<Content />
		</div>
		</body>
		</html>
	);
};
