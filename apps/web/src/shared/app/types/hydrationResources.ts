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

export type Resources = {
	styles: Array<string>;
	modulePreloads: Array<string>;
	preloads: Array<AssetPreload>;
};

export type EntryResources = Resources & {
	module: string;
};

export type HydrationResources = {
	entry: EntryResources;
	route: Resources | null;
};
