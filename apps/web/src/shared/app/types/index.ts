import type { HydrationResources } from 'shared/app/types/hydrationResources';
import type { CspNonce } from 'shared/app/types/security/contentSecurityPolicy';

export type DocumentProps = {
	hydrationResources: HydrationResources;
	cspNonce: CspNonce;
	url: string;
};

export type AppProps = {
	url?: string;
};
