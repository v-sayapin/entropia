import type { AssetPreload } from 'shared/app/types/assets';

export type Resources = {
	styles: Array<string>;
	modulePreloads: Array<string>;
	preloads: Array<string>;
};

type EnrichedResources = Omit<Resources, 'preloads'> & {
	preloads: Array<AssetPreload>;
};

export type EntryResources = EnrichedResources & {
	entry: string;
};

export type HydrationResourcesGetter = () => Promise<EntryResources>;
