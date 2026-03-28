import type { AssetPreload } from 'shared/app/types/assets';

export type DocumentProps = {
	url: string;
	entry: string;
	styles: Array<string>;
	modulePreloads: Array<string>;
	preloads: Array<AssetPreload>;
};

export type AppProps = {
	url?: string;
};
