const updatePage = ( page, data ) => {
	return Object.assign( {}, page, data );
};

const removeBlock = ( id, state ) => {
	const newState = Object.assign( {}, state );
	delete newState[ id ];
	return newState;
};

export default function blocks( state = {}, action ) {
	switch ( action.type ) {
		case 'BLOCK_RECEIVED':
			return Object.assign( {}, state, { [ action.page.id ]: action.page } );
		case 'BLOCK_SET_CONTENT':
			return Object.assign( {}, state, { [ action.id ]: updatePage(
				state[ action.id ],
				{ content: action.content }
			) } );
		case 'BLOCK_DELETE':
			return removeBlock( action.id, state );
	}
	return state;
}

