import React from 'react';
import ReactDOM from 'react-dom';
import SpheneEditor from './components/sphene-editor';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import spheneEditorStore from './reducers';
import thunk from 'redux-thunk';

function configureStore() {
	const middleware = compose( applyMiddleware( thunk ), window.devToolsExtension ? window.devToolsExtension() : f => f );
	return createStore( spheneEditorStore, middleware );
}

export default function activateEditor() {
	const store = configureStore();
	ReactDOM.render(
		<Provider store={ store }>
			<SpheneEditor />
		</Provider>, window.document.querySelector( '.sphene-editor' )
	);
}
