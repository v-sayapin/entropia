import { createServer } from 'src/server/app/createServer';
import { host, port } from 'src/server/utils/env';

const start = async () => {
	const app = await createServer();

	const shutdown = async () => {
		try {
			await app.close();
		} finally {
			process.exit(0);
		}
	};

	process.on('SIGTERM', shutdown);
	process.on('SIGINT', shutdown);

	try {
		await app.listen({ host, port });
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
};

void start();
