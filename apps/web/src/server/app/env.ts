import { resolve } from 'node:path';

const parseIntegerEnv = (name: string, fallback: number): number => {
	const value = process.env[name];
	if (!value) {
		return fallback;
	}

	const parsed = Number(value);
	if (!Number.isInteger(parsed) || parsed < 0) {
		throw new Error(`Invalid ${name}: ${value}`);
	}

	return parsed;
};

export const host = process.env.HOST ?? 'localhost';
export const port = Number(process.env.PORT ?? 3000);

export const viteHost = process.env.VITE_HOST ?? 'localhost';
export const vitePort = Number(process.env.VITE_PORT ?? 5173);

export const connectionTimeoutMs = parseIntegerEnv('CONNECTION_TIMEOUT_MS', 5_000);
export const requestTimeoutMs = parseIntegerEnv('REQUEST_TIMEOUT_MS', 10_000);
export const keepAliveTimeoutMs = parseIntegerEnv('KEEP_ALIVE_TIMEOUT_MS', 15_000);

export const rootDir = resolve(process.cwd());
export const clientDistDir = resolve(rootDir, 'dist/client');
export const serverDistDir = resolve(rootDir, 'dist/server');
