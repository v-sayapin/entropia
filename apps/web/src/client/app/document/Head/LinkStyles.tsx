import { For } from 'solid-js';
import type { Component } from 'solid-js';

type StylesProps = {
	styles: Array<string> | null | undefined;
	nonce: string;
};

export const LinkStyles: Component<StylesProps> = (props) => (
	<For each={props.styles}>
		{(href) => <link rel='stylesheet' href={href} nonce={props.nonce} />}
	</For>
);
