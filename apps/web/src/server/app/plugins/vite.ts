import { resolve } from 'node:path';

import middie from '@fastify/middie';
import type { FastifyPluginAsync } from 'fastify';
import plugin from 'fastify-plugin';
import type { ViteDevServer } from 'vite';
import { createServer } from 'vite';

declare module 'fastify' {
	interface FastifyInstance {
		vite?: ViteDevServer;
	}
}

const vitePluginDecorator: FastifyPluginAsync = async (app) => {
	const rootDir = resolve(process.cwd());

	const vite = await createServer({
		root: rootDir,
		cacheDir: resolve(rootDir, 'node_modules/.vite-temp'),
		configLoader: 'runner',
		appType: 'custom',
		server: {
			middlewareMode: true,
		},
	});

	app.decorate('vite', vite);

	await app.register(middie);
	app.use(vite.middlewares);

	app.addHook('onClose', async () => await vite.close());
};

export const vitePlugin = plugin(vitePluginDecorator, { name: 'vite' });
