import React from 'react';
import ReactDOM from 'react-dom';
import SpheneEditor from './components/sphene-editor';

export default function activateEditor() {
	ReactDOM.render( <SpheneEditor />, window.document.querySelector( '.sphene-editor' ) );
}
