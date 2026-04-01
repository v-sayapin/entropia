import type { HydrationResources } from 'src/shared/types/hydrationResources';

export type HydrationResourcesGetter = (url: string) => Promise<HydrationResources>;
