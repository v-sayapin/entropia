import type { Component } from 'solid-js';

import type { CspNonce } from 'shared/app/types/security/contentSecurityPolicy';

/**
 * Until Vite supports separate script and style nonces, expose the style
 * nonce through `csp-nonce` for Vite-managed tags. Scripts are already
 * trusted via the nonce-bearing entry script and `strict-dynamic`, so
 * Vite only needs the style nonce here.
 */
export const MetaViteCspNonce: Component<{ cspNonce: CspNonce }> = (props) => {
	return <meta property='csp-nonce' nonce={props.cspNonce.style} />;
};
