import Fastify from 'fastify';

import { helmetPlugin } from 'src/server/app/plugins/helmet';
import { staticPlugin } from 'src/server/app/plugins/static';
import { getSsrProcessor } from 'src/server/app/ssr';

export const createServer = async () => {
	const app = Fastify({
		logger: true,
		exposeHeadRoutes: false,
	});

	await app.register(helmetPlugin);

	if (process.env.NODE_ENV === 'production') {
		await app.register(staticPlugin);
	} else {
		const { vitePlugin } = await import('src/server/app/plugins/vite');
		await app.register(vitePlugin);
	}

	const ssrProcessor = await getSsrProcessor(app);

	app.get('*', ssrProcessor);

	return app;
};
