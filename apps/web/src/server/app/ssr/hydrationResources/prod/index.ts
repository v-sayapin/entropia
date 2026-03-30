import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { Manifest } from 'vite';

import { getAssetPreloads } from 'src/server/app/ssr/hydrationResources/prod/assets';
import type {
	EntryResources,
	HydrationResourcesGetter,
	Resources,
} from 'src/server/app/ssr/hydrationResources/types';

const loadClientManifest = async (root: string): Promise<Manifest> =>
	JSON.parse(await readFile(join(root, '.vite', 'manifest.json'), 'utf-8'));

const toPublicPath = (path: string): string => `/${path}`;

const collectResources = (manifest: Manifest, entry: string): Resources => {
	const visited = new Set<string>();
	const styles = new Set<string>();
	const modulePreloads = new Set<string>();
	const preloads = new Set<string>();
	const stack = [entry];

	while (stack.length > 0) {
		const chunkId = stack.pop();
		if (!chunkId || visited.has(chunkId)) {
			continue;
		}
		visited.add(chunkId);

		const chunk = manifest[chunkId];
		if (!chunk) {
			continue;
		}

		chunk.css?.forEach((path) => styles.add(toPublicPath(path)));

		chunk.imports?.forEach((path) => {
			const importedChunk = manifest[path];
			if (importedChunk?.file) {
				modulePreloads.add(toPublicPath(importedChunk.file));
			}
			if (!visited.has(path)) {
				stack.push(path);
			}
		});

		chunk.assets?.forEach((path) => preloads.add(toPublicPath(path)));
	}

	return {
		styles: Array.from(styles).sort(),
		modulePreloads: Array.from(modulePreloads).sort(),
		preloads: Array.from(preloads).sort(),
	};
};

export const createProdHydrationResourcesGetter = async (
	clientDistDir: string,
	entryId: string
): Promise<HydrationResourcesGetter> => {
	const manifest = await loadClientManifest(clientDistDir);

	const entryChunk = manifest[entryId];
	if (!entryChunk?.file) {
		throw new Error(`Missing client manifest entry: ${entryId}`);
	}

	const { styles, modulePreloads, preloads } = collectResources(manifest, entryId);

	const resources: EntryResources = {
		styles,
		modulePreloads,
		preloads: getAssetPreloads(preloads),
		entry: toPublicPath(entryChunk.file),
	};

	return async () => resources;
};
