import shortid from 'shortid';

export function getHeaderDataFromApi() {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'sphene-editor/v1/settings/header',
		method: 'GET',
	} );
}

export function findPostById( posts, id ) {
	return posts.reduce( ( found, post ) => {
		if ( post.ID === id ) {
			return post;
		}
		return found;
	}, [] );
}

export function sendPageToApi( page ) {
	const { id, rows, content } = page;
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_page/' + id,
		method: 'POST',
		data: { id, sphene_data: JSON.stringify( { rows } ), content },
	} );
}

export function removeBlockFromApi( id ) {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_block/' + id,
		method: 'DELETE',
	} );
}

export function createBlockInApi( page ) {
	const { content } = page;
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_block',
		method: 'POST',
		data: { content, status: 'publish' },
	} );
}

export function sendBlockToApi( page ) {
	const { id, content } = page;
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_block/' + id,
		method: 'POST',
		data: { id, content },
	} );
}

export function getPageFromApi( id ) {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_page/' + id,
		method: 'GET',
		data: { context: 'edit' },
	} );
}

export function getBlockFromApi( id ) {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_block/' + id,
		method: 'GET',
		data: { context: 'edit' },
	} );
}

export function ajax( options ) {
	const ajaxOptions = Object.assign( {}, options, {
		beforeSend: ( xhr ) => {
			xhr.setRequestHeader( 'X-WP-Nonce', getSpheneData().wpApiSettings.nonce );
		}
	} );
	return new Promise( ( resolve, reject ) => {
		window.jQuery.ajax( ajaxOptions ).done( resolve ).fail( reject );
	} );
}

export function getSpheneData() {
	return window.spheneData;
}

export function buildUnsavedBlock( blockType = 'text' ) {
	const id = shortid.generate();
	const imageUrl = 'https://placehold.it/150x150';
	const defaultContent = blockType === 'text' ? 'This is a new block. <strong>Click</strong> to edit it!' : `<img src="${imageUrl}">`;
	return { id, unsaved: true, blockType, imageUrl, defaultContent };
}

export const buildRowWithBlock = block => ( { rowId: shortid.generate(), columns: [ { postId: block.id } ] } );
