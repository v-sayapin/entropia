import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { Manifest } from 'vite';

import type { EntryResources, Resources } from 'shared/app/types/hydrationResources';

import { getAssetPreloads } from 'server/ssr/resources/prod/assets';
import type { HydrationResourcesGetter } from 'server/ssr/resources/types';

type TransitiveResources = {
	styles: ReadonlySet<string>;
	modulePreloads: ReadonlySet<string>;
	preloads: ReadonlySet<string>;
};

type TransitiveResourcesCache = Map<string, TransitiveResources>;

type HydrationResourcesMap = {
	entryResources: EntryResources;
	routeResourcesMap: Map<string, Resources>;
};

const getEmptyTransitiveResources = (): TransitiveResources => ({
	styles: new Set(),
	modulePreloads: new Set(),
	preloads: new Set(),
});

const loadClientManifest = async (root: string): Promise<Manifest> =>
	JSON.parse(await readFile(join(root, '.vite', 'manifest.json'), 'utf-8'));

const toPublicPath = (path: string): string => `/${path}`;

const buildTransitiveCache = (
	manifest: Manifest,
	targets: Array<string>
): TransitiveResourcesCache => {
	const cache: TransitiveResourcesCache = new Map();

	const visit = (chunkId: string): TransitiveResources => {
		const hit = cache.get(chunkId);
		if (hit) {
			return hit;
		}

		const chunk = manifest[chunkId];
		if (!chunk) {
			cache.set(chunkId, getEmptyTransitiveResources());
			return getEmptyTransitiveResources();
		}

		const styles = new Set<string>();
		const modulePreloads = new Set<string>();
		const preloads = new Set<string>();
		const entry = { styles, modulePreloads, preloads };
		cache.set(chunkId, entry);

		for (const path of chunk.css ?? []) {
			styles.add(toPublicPath(path));
		}

		for (const importId of chunk.imports ?? []) {
			const importChunk = manifest[importId];
			if (importChunk?.file) {
				modulePreloads.add(toPublicPath(importChunk.file));
			}

			const sub = visit(importId);
			sub.styles.forEach((item) => styles.add(item));
			sub.modulePreloads.forEach((item) => modulePreloads.add(item));
			sub.preloads.forEach((item) => preloads.add(item));
		}

		for (const path of chunk.assets ?? []) {
			preloads.add(toPublicPath(path));
		}

		return entry;
	};

	for (const chunkId of targets) {
		if (manifest[chunkId]) {
			visit(chunkId);
		}
	}

	return cache;
};

const buildRouteResources = (
	manifest: Manifest,
	cache: TransitiveResourcesCache,
	entryResources: TransitiveResources,
	entryFile: string,
	routeId: string
): Resources => {
	const transitive = cache.get(routeId) ?? getEmptyTransitiveResources();

	const routeFile = manifest[routeId]?.file;

	const modulePreloads = new Set(transitive.modulePreloads);
	if (routeFile) {
		modulePreloads.add(toPublicPath(routeFile));
	}

	return {
		styles: Array.from(transitive.styles).filter((item) => !entryResources.styles.has(item)),
		modulePreloads: Array.from(modulePreloads).filter(
			(item) => !entryResources.modulePreloads.has(item) && item !== entryFile
		),
		preloads: getAssetPreloads(
			Array.from(transitive.preloads).filter((item) => !entryResources.preloads.has(item))
		),
	};
};

const buildHydrationResourcesMap = async (
	clientDistDir: string,
	entryId: string
): Promise<HydrationResourcesMap> => {
	const manifest = await loadClientManifest(clientDistDir);
	// TODO: get routeIds from routes manifest
	const routeIds = [] as const;

	const entryChunk = manifest[entryId];
	if (!entryChunk?.file) {
		throw new Error(`Missing entry chunk in client manifest: ${entryId}`);
	}

	const targetChunkIds = [entryId, ...routeIds];
	const transitiveCache = buildTransitiveCache(manifest, targetChunkIds);

	const entryResourcesRaw = transitiveCache.get(entryId);
	if (!entryResourcesRaw) {
		throw new Error(`Missing entry chunk resources in transitive cache: ${entryId}`);
	}
	const entryFile = toPublicPath(entryChunk.file);

	const routeResourcesMap = new Map(
		routeIds.map((routeId) => [
			routeId,
			buildRouteResources(manifest, transitiveCache, entryResourcesRaw, entryFile, routeId),
		])
	);

	const entryResources = {
		styles: Array.from(entryResourcesRaw.styles),
		modulePreloads: Array.from(entryResourcesRaw.modulePreloads),
		preloads: getAssetPreloads(Array.from(entryResourcesRaw.preloads)),
		module: entryFile,
	};

	return { entryResources, routeResourcesMap };
};

export const createProdHydrationResourcesGetter = async (
	clientDistDir: string,
	entryId: string
): Promise<HydrationResourcesGetter> => {
	const { entryResources, routeResourcesMap } = await buildHydrationResourcesMap(
		clientDistDir,
		entryId
	);

	return async (_url) => {
		// TODO: get routeId from routes manifest by url
		const routeId = undefined;
		return {
			entry: entryResources,
			route: (routeId && routeResourcesMap.get(routeId)) || null,
		};
	};
};
