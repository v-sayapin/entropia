import { createServer } from 'src/server/app/createServer';
import { host, port } from 'src/server/utils/env';

const start = async () => {
	const app = await createServer();

	try {
		await app.listen({ host, port });
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
};

void start();
