/* @refresh reload */

import { render } from 'solid-js/web';

import { App } from 'src/client/app/App';

import 'src/client/app/index.css';

const root = document.getElementById('root');

render(() => <App />, root!);
