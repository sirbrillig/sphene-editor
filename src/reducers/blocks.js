export default function blocks( state = {}, action ) {
	switch ( action.type ) {
		case 'BLOCK_RECEIVED':
			return Object.assign( {}, state, { [ action.page.id ]: action.page } );
	}
	return state;
}

