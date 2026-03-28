import type { JSX } from 'solid-js';

export type AssetContentType = {
	as: JSX.HTMLLinkAs;
	type?: string;
};

export type AssetPreload = AssetContentType & {
	href: string;
};
