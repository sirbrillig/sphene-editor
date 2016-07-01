( function() {

	function findPostById( posts, id ) {
		return posts.reduce( ( found, post ) => {
			if ( post.ID === id ) {
				return post;
			}
			return found;
		} );
	}

	function getCurrentPageData() {
		return findPostById( window.spheneData.pages, window.spheneData.currentPageId );
	}

	function getBlockById( id ) {
		return findPostById( window.spheneData.blocks, id );
	}

	function getRenderedBlock( blockData ) {
		const block = getBlockById( blockData.postId );
		return '<div className="sphene-block">' + block.post_content + '</div>';
	}

	function getRenderedRow( rowData ) {
		return '<div className="sphene-row">' + rowData.columns.map( getRenderedBlock ).join( ' ' ) + '</div>';
	}

	function getPageDataFromPost( post ) {
		return JSON.parse( post.post_content );
	}

	function getRenderedPage() {
		const post = getCurrentPageData();
		const pageData = getPageDataFromPost( post );
		const markup = pageData.rows.map( getRenderedRow ).join( ' ' );
		console.log( markup );
		return getNodeFromString( markup );
	}

	function getNodeFromString( str ) {
		return jQuery( str )[0];
	}

	function createEditor() {
		const editorDiv = window.document.createElement( 'div' );
		editorDiv.className = 'sphene-editor';
		const editorTitle = window.document.createElement( 'h1' );
		editorTitle.className = 'sphene-editor__title';
		editorTitle.appendChild( window.document.createTextNode( 'Sphene Editor' ) );
		editorDiv.appendChild( editorTitle );
		editorDiv.appendChild( getRenderedPage() );
		return editorDiv;
	}

	function createAdminBarButton() {
		const button = window.document.createElement( 'li' );
		button.className = 'wp-admin-bar-sphene';
		const buttonLink = window.document.createElement( 'a' );
		buttonLink.className = 'ab-item';
		buttonLink.href = '#';
		buttonLink.appendChild( window.document.createTextNode( 'Sphene' ) );
		button.appendChild( buttonLink );
		return button;
	}

	function addActivationButton() {
		const adminBar = window.document.querySelector( '#wp-admin-bar-root-default' );
		if ( ! adminBar ) {
			console.error( 'Sphene error: could not find admin bar' );
			return;
		}
		const button = createAdminBarButton();
		adminBar.appendChild( button );
		button.addEventListener( 'click', function() {
			toggleEditor();
		} );
	}

	function toggleEditor() {
		const body = window.document.querySelector( 'body' );
		if ( ! body ) {
			console.error( 'Sphene error: could not find page body' );
			return;
		}
		const editor = createEditor();
		body.insertBefore( editor, body.firstChild );
	}

	// ---
	window.onload = function() {
		console.log('loading');
		addActivationButton();
	};
} )();
