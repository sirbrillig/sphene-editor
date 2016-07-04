import 'babel-polyfill';
import activateEditor from './load-editor';

function createEditor() {
	const editorDiv = window.document.createElement( 'div' );
	editorDiv.className = 'sphene-editor';
	return editorDiv;
}

function addSphenePageActivationButton() {
	const button = findElement( '.sphene-edit-button' );
	if ( ! button ) {
		console.error( 'Sphene error: could not find activation button' );
		return;
	}
	button.addEventListener( 'click', function() {
		showEditor();
	} );
}

function findElement( selector ) {
	return window.document.querySelector( selector );
}

function showEditor() {
	if ( findElement( '.sphene-editor' ) ) {
		console.error( 'Sphene error: already running' );
		return;
	}
	const body = findElement( 'body' );
	if ( ! body ) {
		console.error( 'Sphene error: could not find page body' );
		return;
	}
	const editor = createEditor();
	body.insertBefore( editor, body.firstChild );
	activateEditor();
}

// ---
window.onload = function() {
	addSphenePageActivationButton();
};
