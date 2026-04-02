import {
	generateHydrationScript as generateClientHydrationScript,
	renderToStream,
} from 'solid-js/web';

import { App } from 'src/client/app/App';
import type { AppProps, DocumentProps } from 'src/shared/types/app';
import type { AssetPreload } from 'src/shared/types/hydrationResources';
import type { RenderStream } from 'src/shared/types/renderer';

const generateServerHydrationScript = generateClientHydrationScript as (opts: {
	nonce?: string;
}) => string;

const stylesLinkPreload = (styles: Array<string>): string =>
	styles.map((href) => `<link rel="preload" href="${href}" as="style" type="text/css">`).join('');
const priorityStylesLinkPreload = (styles: Array<string>): string =>
	styles
		.map(
			(href) =>
				`<link rel="preload" href="${href}" as="style" type="text/css" fetchpriority="high">`
		)
		.join('');
const linkStyles = (styles: Array<string>): string =>
	styles.map((href) => `<link rel="stylesheet" href="${href}">`).join('');

const modulesLinkPreload = (modules: Array<string>): string =>
	modules.map((href) => `<link rel="modulepreload" href="${href}">`).join('');
const priorityModulesLinkPreload = (modules: Array<string>): string =>
	modules
		.map((href) => `<link rel="modulepreload" href="${href}" fetchpriority="high">`)
		.join('');

const assetPreloads = (assets: Array<AssetPreload>): string =>
	assets
		.map(
			({ href, as, type }) => `<link rel="preload" href="${href}" as="${as}" type="${type}">`
		)
		.join('');

const toScriptJson = (value: AppProps): string =>
	JSON.stringify(value).replace(/</g, '\\u003C').replace(/>/g, '\\u003E');

const buildHead = (props: DocumentProps): string => {
	const { hydrationResources, nonce } = props;
	const { entry, route } = hydrationResources;

	return [
		`<html lang="en">`,
		`<head>`,
		`<meta charset="UTF-8">`,
		`<link rel="icon" type="image/svg+xml" href="/favicon.svg">`,
		`<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
		`<title>entropia</title>`,

		generateServerHydrationScript({ nonce }),

		priorityStylesLinkPreload(entry.styles),
		priorityModulesLinkPreload([entry.module]),
		modulesLinkPreload(entry.modulePreloads),
		assetPreloads(entry.preloads),

		stylesLinkPreload(route?.styles ?? []),
		modulesLinkPreload(route?.modulePreloads ?? []),
		assetPreloads(route?.preloads ?? []),

		linkStyles(entry.styles),
		linkStyles(route?.styles ?? []),

		`<script type="module" src="${entry.module}" nonce="${nonce}" defer></script>`,

		`</head>`,
		`<body>`,
		`<div id="app">`,
	]
		.filter(Boolean)
		.join('');
};

const buildBodyEnd = (props: DocumentProps): string =>
	[
		`</div>`,
		`<script nonce="${props.nonce}">window.__INITIAL_DATA__=${toScriptJson({ url: props.url })}</script>`,
		`</body>`,
		`</html>`,
	].join('');

export const render = (props: DocumentProps): RenderStream => {
	const head = buildHead(props);
	const bodyEnd = buildBodyEnd(props);

	const stream = renderToStream(() => App({ url: props.url }), {
		nonce: props.nonce,
		onCompleteAll: ({ write }) => write(bodyEnd),
	});

	return {
		pipe: (writable) => {
			writable.write(head);
			stream.pipe(writable);
		},
		pipeTo: stream.pipeTo.bind(stream),
	};
};
