import { createServer } from 'src/server/app/createServer';
import { host, port } from 'src/server/utils/env';

const start = async () => {
	const app = await createServer();

	const shutdown = async (reason: string) => {
		app.log.info({ reason }, 'Server is shutting down');
		try {
			await app.close();
		} finally {
			process.exit(0);
		}
	};

	process.on('SIGTERM', () => void shutdown('SIGTERM'));
	process.on('SIGINT', () => void shutdown('SIGINT'));

	try {
		await app.listen({ host, port });
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
};

void start();
