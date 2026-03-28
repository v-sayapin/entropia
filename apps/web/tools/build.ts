import { spawn } from 'node:child_process';

const yarnCmd = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';

const stages = ['build:server', 'build:ssr', 'build:client'] as const;
type Stage = (typeof stages)[number];

const run = (stage: Stage): Promise<void> =>
	new Promise((resolve, reject) => {
		const child = spawn(yarnCmd, [stage], {
			stdio: 'inherit',
			env: process.env,
		});

		child.once('error', reject);
		child.once('exit', (code) => (code === 0 ? resolve() : reject()));
	});

const build = async () => {
	const results = await Promise.allSettled(stages.map(run));

	const failed = results.find((result) => result.status === 'rejected');
	if (failed) {
		return 1;
	}
};

void build();
