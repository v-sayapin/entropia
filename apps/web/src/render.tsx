import { renderToStream } from 'solid-js/web';

import type { RenderFunction } from 'shared/app/types/render';

import { Document } from 'client/app/document';

export const render: RenderFunction = (props) => renderToStream(() => <Document {...props} />);
