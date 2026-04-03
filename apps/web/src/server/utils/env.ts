import { resolve } from 'node:path';

const parseBooleanEnv = (name: string, fallback: boolean): boolean => {
	const value = process.env[name];
	if (!value) {
		return fallback;
	}
	return value === 'true';
};

export const host = process.env.HOST ?? '127.0.0.1';
export const port = Number(process.env.PORT ?? 3000);

export const trustProxy = parseBooleanEnv('TRUST_PROXY', false);

export const rootDir = resolve(process.cwd());
export const clientDistDir = resolve(rootDir, 'dist/client');
export const serverDistDir = resolve(rootDir, 'dist/server');
