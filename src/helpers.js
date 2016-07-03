export function findPostById( posts, id ) {
	return posts.reduce( ( found, post ) => {
		if ( post.ID === id ) {
			return post;
		}
		return found;
	}, [] );
}

export function getPageFromApi( id ) {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_page/' + id,
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

