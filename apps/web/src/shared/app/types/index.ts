import type { HydrationResources } from 'shared/app/types/hydrationResources';

export type DocumentProps = {
	hydrationResources: HydrationResources;
	url: string;
};

export type AppProps = {
	url?: string;
};
