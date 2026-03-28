import Fastify from 'fastify';

import { staticPlugin } from 'src/server/app/plugins/static';
import { getSsrProcessor } from 'src/server/app/ssr';
import { isProduction } from 'src/server/utils/env';

export const createServer = async () => {
	const app = Fastify({
		logger: true,
		exposeHeadRoutes: false,
	});

	if (isProduction) {
		await app.register(staticPlugin);
	} else {
		const { vitePlugin } = await import('src/server/app/plugins/vite');
		await app.register(vitePlugin);
	}

	const ssrProcessor = await getSsrProcessor(app);

	app.get('*', ssrProcessor);

	return app;
};
