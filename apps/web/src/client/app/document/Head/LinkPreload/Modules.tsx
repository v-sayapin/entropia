import { For } from 'solid-js';
import type { Component } from 'solid-js';

type LinkModulesPreloadProps = {
	modules: Array<string> | null | undefined;
	nonce: string;
	highPriority?: boolean;
};

export const LinkModulesPreload: Component<LinkModulesPreloadProps> = (props) => (
	<For each={props.modules}>
		{(href) => (
			<link
				rel='modulepreload'
				href={href}
				nonce={props.nonce}
				fetchpriority={props.highPriority ? 'high' : 'auto'}
			/>
		)}
	</For>
);
