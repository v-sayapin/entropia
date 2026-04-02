import type { FastifyInstance } from 'fastify';

import { createServer } from 'server/app/createServer';
import { host, port } from 'server/app/env';

const shutdown = async (app: FastifyInstance, reason: string): Promise<void> => {
	app.log.info({ reason }, 'Server is shutting down');
	try {
		await app.close();
	} finally {
		process.exit(0);
	}
};

const start = async (): Promise<void> => {
	const app = await createServer();

	process.on('SIGTERM', () => shutdown(app, 'SIGTERM'));
	process.on('SIGINT', () => shutdown(app, 'SIGINT'));

	try {
		await app.listen({ host, port });
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
};

void start();
