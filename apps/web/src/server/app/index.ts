import { createServer } from 'server/app/createServer';
import { host, port } from 'server/app/env';

const start = async (): Promise<void> => {
	const app = await createServer();

	try {
		await app.listen({ host, port });
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
};

void start();
