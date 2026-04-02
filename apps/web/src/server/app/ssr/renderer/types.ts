import type { DocumentProps } from 'src/shared/types/app';
import type { RenderStream } from 'src/shared/types/renderer';

type RenderFunction = (props: DocumentProps) => RenderStream;

export type RenderModule = {
	render: RenderFunction;
};
