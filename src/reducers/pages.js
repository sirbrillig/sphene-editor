export default function pages( state = {}, action ) {
	switch ( action.type ) {
		case 'PAGE_RECEIVED':
			return Object.assign( {}, state, { [ action.post.ID ]: action.post } );
	}
	return state;
}
