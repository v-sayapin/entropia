import type { ViteDevServer } from 'vite';

import type { HydrationResourcesGetter } from 'src/server/app/ssr/hydrationResources/types';

const isCssUrl = (url: string) => {
	const queryIndex = url.indexOf('?');
	const pathname = queryIndex === -1 ? url : url.slice(0, queryIndex);
	return pathname.endsWith('.css');
};

const collectStyles = async (vite: ViteDevServer, entry: string): Promise<Array<string>> => {
	const clientEnvironment = vite.environments.client;

	await clientEnvironment.transformRequest(entry);
	await clientEnvironment.waitForRequestsIdle(entry);

	const entryModule = await clientEnvironment.moduleGraph.getModuleByUrl(entry);
	if (!entryModule) {
		return [];
	}

	const visited = new Set<string>();
	const styles = new Set<string>();
	const stack = [entryModule];

	while (stack.length > 0) {
		const module = stack.pop();
		if (!module) {
			continue;
		}

		const key = module.id ?? module.url;
		if (visited.has(key)) {
			continue;
		}
		visited.add(key);

		if (isCssUrl(module.url)) {
			styles.add(module.url);
		}

		module.importedModules.forEach((dependency) => stack.push(dependency));
	}

	return Array.from(styles).sort();
};

export const createDevHydrationResourcesGetter = async (
	entryId: string,
	vite: ViteDevServer
): Promise<HydrationResourcesGetter> => {
	const entry = `/${entryId}`;

	return async () => ({
		entry,
		styles: await collectStyles(vite, entry),
		modulePreloads: [],
		preloads: [],
	});
};
