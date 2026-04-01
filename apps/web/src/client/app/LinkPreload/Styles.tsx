import { For } from 'solid-js';
import type { Component } from 'solid-js';

type LinkStylesPreloadProps = {
	styles: Array<string> | null | undefined;
	highPriority?: boolean;
};

export const LinkStylesPreload: Component<LinkStylesPreloadProps> = (props) => (
	<For each={props.styles}>
		{(href) => (
			<link
				rel='preload'
				href={href}
				as='style'
				type='text/css'
				fetchpriority={props.highPriority ? 'high' : 'auto'}
			/>
		)}
	</For>
);
