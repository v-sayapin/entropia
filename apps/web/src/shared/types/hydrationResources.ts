import type { JSX } from 'solid-js';

export type AssetContentType = {
	as: JSX.HTMLLinkAs;
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
