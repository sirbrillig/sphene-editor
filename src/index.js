import 'babel-polyfill';
import activateEditor from './load-editor';

function findPostById( posts, id ) {
	return posts.reduce( ( found, post ) => {
		if ( post.ID === id ) {
			return post;
		}
		return found;
	} );
}

function getContentFromPost( post ) {
	return post.post_content_filtered.length ? post.post_content_filtered : post.post_content;
}

function getCurrentPageData() {
	// TODO: use API to get the page data
	getPageFromApi( getSpheneData().currentPageId ).then( data => console.log( data ) );
	return findPostById( getSpheneData().pages, getSpheneData().currentPageId );
}

function getBlockById( id ) {
	return findPostById( getSpheneData().blocks, id );
}

function getRenderedBlock( blockData ) {
	const block = getBlockById( blockData.postId );
	return '<div className="sphene-block">' + block.post_content + '</div>';
}

function getRenderedRow( rowData ) {
	return '<div className="sphene-row">' + rowData.columns.map( getRenderedBlock ).join( ' ' ) + '</div>';
}

function getPageDataFromPost( post ) {
	return JSON.parse( getContentFromPost( post ) );
}

function getRenderedPage() {
	const post = getCurrentPageData();
	const pageData = getPageDataFromPost( post );
	const markup = pageData.rows.map( getRenderedRow ).join( ' ' );
	return getNodeFromString( markup );
}

function getNodeFromString( str ) {
	return window.jQuery( str )[ 0 ];
}

function getSpheneData() {
	return window.spheneData;
}

function createEditor() {
	const editorDiv = window.document.createElement( 'div' );
	editorDiv.className = 'sphene-editor';
	//const editorTitle = window.document.createElement( 'h1' );
	//editorTitle.className = 'sphene-editor__title';
	//editorTitle.appendChild( window.document.createTextNode( 'Sphene Editor' ) );
	//editorDiv.appendChild( editorTitle );
	//editorDiv.appendChild( getRenderedPage() );
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

function ajax( options ) {
	const ajaxOptions = Object.assign( {}, options, {
		beforeSend: ( xhr ) => {
			xhr.setRequestHeader( 'X-WP-Nonce', getSpheneData().wpApiSettings.nonce );
		}
	} );
	return new Promise( ( resolve, reject ) => {
		window.jQuery.ajax( ajaxOptions ).done( resolve ).fail( reject );
	} );
}

function getPageFromApi( id ) {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_page/' + id,
		method: 'GET',
		data: { context: 'edit' },
	} );
}

// ---
window.onload = function() {
	addSphenePageActivationButton();
};
