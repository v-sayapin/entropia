/* @refresh reload */

import type { Component } from 'solid-js';

import type { AppProps } from 'shared/app/types';

import { Content } from 'client/components/Content';

import './App.css';

export const App: Component<AppProps> = (_props) => {
	return <Content />;
};
