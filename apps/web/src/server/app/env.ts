import { resolve } from 'node:path';

export const host = process.env.HOST ?? 'localhost';
export const port = Number(process.env.PORT ?? 3000);

export const viteHost = process.env.VITE_HOST ?? 'localhost';
export const vitePort = Number(process.env.VITE_PORT ?? 5173);

export const rootDir = resolve(process.cwd());
export const clientDistDir = resolve(rootDir, 'dist/client');
export const serverDistDir = resolve(rootDir, 'dist/server');
