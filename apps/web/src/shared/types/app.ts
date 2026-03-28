import type { AssetPreload } from 'src/shared/types/assets';

export type AppProps = {
    url?: string;
    entry?: string;
    styles?: Array<string>;
    modulePreloads?: Array<string>;
    preloads?: Array<AssetPreload>;
};
