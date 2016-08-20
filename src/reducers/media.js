function buildImage( imageData ) {
	return {
		id: imageData.id,
		url: imageData.media_details.sizes.medium.source_url,
		thumbnailUrl: imageData.media_details.sizes.thumbnail.source_url,
	};
}

export default function media( state = {}, action ) {
	switch ( action.type ) {
		case 'ALL_MEDIA_RECEIVED':
			return action.media.reduce( ( images, image ) => {
				return Object.assign( state, { [ image.id ]: buildImage( image ) } );
			} );
	}
	return state;
}
