import type { JSX } from 'solid-js';

declare module 'solid-js/web' {
	export function HydrationScript(props: { nonce?: string }): JSX.Element;
}
