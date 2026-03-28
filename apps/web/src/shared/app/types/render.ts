import type { DocumentProps } from 'shared/app/types';

type Writable = {
	write: (chunk: string) => void;
};

type Stream = {
	pipe: (writable: Writable) => void;
};

export type RenderFunction = (props: DocumentProps) => Stream;

export type RenderModule = {
	render: RenderFunction;
};
