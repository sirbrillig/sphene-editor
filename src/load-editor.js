import React from 'react';
import ReactDOM from 'react-dom';
import SpheneEditor from './components/sphene-editor';
import { createStore } from 'redux';
import spheneEditorStore from './reducers';

export default function activateEditor() {
	const store = createStore( spheneEditorStore, window.devToolsExtension && window.devToolsExtension() );
	ReactDOM.render( <SpheneEditor store={ store } />, window.document.querySelector( '.sphene-editor' ) );
}
