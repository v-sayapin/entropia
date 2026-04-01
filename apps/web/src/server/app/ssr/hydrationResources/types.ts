import type { HydrationResources } from 'shared/app/types/hydrationResources';

export type HydrationResourcesGetter = (url: string) => Promise<HydrationResources>;
