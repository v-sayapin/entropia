/* @refresh reload */

import { Content } from 'src/client/components/Content';
import type { AppProps } from 'src/shared/types/app';

import 'src/client/app/App.css';

export const App = (_props: AppProps) => {
	return <Content />;
};
