( function() {

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
		return JSON.parse( getContentFromPost( post ) );
	}

	function getRenderedPage() {
		const post = getCurrentPageData();
		const pageData = getPageDataFromPost( post );
		const markup = pageData.rows.map( getRenderedRow ).join( ' ' );
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

	function addAdminBarActivationButton() {
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

	function addSphenePageActivationButton() {
		const button = window.document.querySelector( '.sphene-edit-button' );
		if ( ! button ) {
			console.error( 'Sphene error: could not find activation button' );
			return;
		}
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

	function getPagesFromApi() {
		jQuery.ajax( {
			url: spheneData.wpApiSettings.root + 'wp/v2/sphene_page',
			method: 'GET',
			beforeSend: function ( xhr ) {
				xhr.setRequestHeader( 'X-WP-Nonce', spheneData.wpApiSettings.nonce );
			},
		} ).done( function ( response ) {
			console.log( response );
		} );
	}

	// ---
	window.onload = function() {
		//addAdminBarActivationButton();
		addSphenePageActivationButton();
		getPagesFromApi();
	};
} )();
