type HTMLLinkAs =
	| 'audio'
	| 'document'
	| 'embed'
	| 'fetch'
	| 'font'
	| 'image'
	| 'object'
	| 'script'
	| 'style'
	| 'track'
	| 'video'
	| 'worker';

export type AssetContentType = {
	as: HTMLLinkAs;
	type?: string;
};

export type AssetPreload = AssetContentType & {
	href: string;
};
