export default function media( state = {}, action ) {
	switch ( action.type ) {
		case 'ALL_MEDIA_RECEIVED':
			return action.media.reduce( ( images, image ) => {
				return Object.assign( state, { [ image.id ]: image } );
			} );
	}
	return state;
}
