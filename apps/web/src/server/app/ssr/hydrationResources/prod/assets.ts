import type { AssetContentType, AssetPreload } from 'src/shared/types/assets';

const CONTENT_TYPES: Record<string, AssetContentType> = {
	avif: { as: 'image', type: 'image/avif' },
	jpeg: { as: 'image', type: 'image/jpeg' },
	jpg: { as: 'image', type: 'image/jpeg' },
	png: { as: 'image', type: 'image/png' },
	svg: { as: 'image', type: 'image/svg+xml' },
	webp: { as: 'image', type: 'image/webp' },

	ttf: { as: 'font', type: 'font/ttf' },
	woff: { as: 'font', type: 'font/woff' },
	woff2: { as: 'font', type: 'font/woff2' },

	css: { as: 'style', type: 'text/css' },

	js: { as: 'script', type: 'application/javascript' },
	cjs: { as: 'script', type: 'application/javascript' },
	mjs: { as: 'script', type: 'application/javascript' },
};

const getContentType = (ext: string): AssetContentType => {
	const mimeType = CONTENT_TYPES[ext];
	if (!mimeType) {
		return { as: 'fetch' };
	}
	return mimeType;
};

export const getAssetPreloads = (preloads: Array<string>): Array<AssetPreload> =>
	preloads.reduce<Array<AssetPreload>>((acc, preload) => {
		const ext = preload.split('.').pop();
		if (!ext) {
			return acc;
		}
		acc.push({ ...getContentType(ext), href: preload });
		return acc;
	}, []);
