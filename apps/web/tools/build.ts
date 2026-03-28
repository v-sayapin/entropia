import { spawn } from 'node:child_process';

const yarnCmd = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';

const STAGES = ['build:server', 'build:ssr', 'build:client'] as const;
type Stage = (typeof STAGES)[number];

const run = (stage: Stage): Promise<void> =>
	new Promise((resolve, reject) => {
		const child = spawn(yarnCmd, [stage], {
			stdio: 'inherit',
			env: process.env,
		});

		child.once('error', (error) => {
			return reject(new Error(`${stage} failed to start`, { cause: error }));
		});

		child.once('exit', (code, signal) => {
			if (signal) {
				reject(new Error(`${stage} terminated by ${signal}`));
				return;
			}

			if (code !== 0) {
				reject(new Error(`${stage} exited with code ${code}`));
				return;
			}

			resolve();
		});
	});

const logError = (error: unknown): void => {
	console.error(''); // new line
	console.error(error);
};

const build = async (): Promise<void> => {
	try {
		const results = await Promise.allSettled(STAGES.map(run));
		const failures = results.filter((result) => result.status === 'rejected');

		if (failures.length === 0) {
			return;
		}

		for (const failure of failures) {
			logError(failure.reason);
		}

		process.exitCode = 1;
	} catch (error) {
		logError(error);
		process.exitCode = 1;
	}
};

void build();
