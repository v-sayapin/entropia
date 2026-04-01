import { For } from 'solid-js';
import type { Component } from 'solid-js';

type StylesProps = {
	styles: Array<string> | null | undefined;
};

export const LinkStyles: Component<StylesProps> = (props) => (
	<For each={props.styles}>{(href) => <link rel='stylesheet' href={href} />}</For>
);
