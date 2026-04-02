import type { HydrationResources } from 'src/shared/types/hydrationResources';

export type DocumentProps = {
	url: string;
	nonce: string;
	hydrationResources: HydrationResources;
};

export type AppProps = {
	url: string;
};
