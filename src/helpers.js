import shortid from 'shortid';

export function getHeaderDataFromApi() {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'sphene-editor/v1/settings/header',
		method: 'GET',
	} );
}

export function sendHeaderToApi( url ) {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'sphene-editor/v1/settings/header',
		method: 'POST',
		data: { url },
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
	const { content, blockType, imageUrl, imageId } = page;
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_block',
		method: 'POST',
		data: { content, status: 'publish', blockType, imageUrl, featured_media: imageId },
	} );
}

export function sendBlockToApi( page ) {
	const { id, content, blockType, imageUrl, imageId } = page;
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_block/' + id,
		method: 'POST',
		data: { id, content, blockType, imageUrl, featured_media: imageId },
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

function getImageUrlByBlockType( blockType ) {
	const imageUrlOptions = {
		header: 'https://placehold.it/150x150',
		image: 'https://placehold.it/150x150',
	};
	return imageUrlOptions[ blockType ] || null;
}

export function buildUnsavedBlock( options = {} ) {
	const blockType = options.blockType || 'text';
	const id = shortid.generate();
	const imageUrl = options.imageUrl || getImageUrlByBlockType( blockType );
	const defaultContentOptions = {
		text: 'This is a new block. <strong>Click</strong> to edit it!',
		image: `<img src="${imageUrl}">`,
		header: `<img src="${imageUrl}">`,
	};
	const defaultContent = defaultContentOptions[ blockType ] || defaultContentOptions.text;
	return Object.assign( {}, options, { id, unsaved: true, blockType, imageUrl, defaultContent } );
}

export const buildRowWithBlock = block => ( { rowId: shortid.generate(), columns: [ { postId: block.id } ] } );

export function getMediaFromApi() {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/media',
		method: 'GET',
	} );
}

export function renderBlockToString( block ) {
	if ( block.blockType === 'text' ) {
		return block.content;
	}
	if ( block.blockType === 'image' ) {
		const imageUrl = block.imageUrl || getImageUrlByBlockType( block.blockType );
		return `<img src="${imageUrl}">`;
	}
	if ( block.blockType === 'header' ) {
		const imageUrl = block.imageUrl || getImageUrlByBlockType( block.blockType );
		const headerText = block.siteTitle ? `<h1>${block.siteTitle}</h1>` : '';
		return `${headerText}<img src="${imageUrl}">`;
	}
}
