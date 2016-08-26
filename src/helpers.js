import shortid from 'shortid';

export function assign( obj, newObj = {} ) {
	return Object.assign( {}, obj, newObj );
}

export function findPostById( posts, id ) {
	return posts.reduce( ( found, post ) => {
		if ( post.ID === id ) {
			return post;
		}
		return found;
	}, [] );
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

export function getImageUrlByBlockType( blockType ) {
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
