import { resolve } from 'node:path';

import middie from '@fastify/middie';
import plugin from 'fastify-plugin';
import { createServer } from 'vite';
import type { FastifyPluginAsync } from 'fastify';

import { rootDir, viteHost, vitePort } from 'server/app/env';

const cacheDir = resolve(rootDir, 'node_modules/.cache/vite');

const vitePluginDecorator: FastifyPluginAsync = async (app) => {
	const vite = await createServer({
		root: rootDir,
		cacheDir,
		configLoader: 'runner',
		appType: 'custom',
		server: {
			host: viteHost,
			port: vitePort,
			strictPort: true,
			hmr: {
				host: viteHost,
				port: vitePort,
				clientPort: vitePort,
			},
			middlewareMode: true,
		},
	});

	app.decorate('vite', vite);

	await app.register(middie);
	app.use(vite.middlewares);

	app.addHook('onClose', async () => await vite.close());
};

export const vitePlugin = plugin(vitePluginDecorator, { name: 'vite' });
