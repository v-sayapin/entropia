declare global {
	namespace NodeJS {
		// oxlint-disable-next-line typescript/consistent-type-definitions
		export interface ProcessEnv {
			NODE_ENV?: 'production';
			HOST?: string;
			PORT?: string;
			VITE_HOST?: string;
			VITE_PORT?: string;
			TRUST_PROXY?: string;
		}
	}
}

export {};
