const updatePage = ( page, data ) => {
	return Object.assign( {}, page, data );
};

const removeBlock = ( id, state ) => {
	const newState = Object.assign( {}, state );
	delete newState[ id ];
	return newState;
};

const addBlock = ( page, state ) => {
	return Object.assign( {}, state, { [ page.id ]: page } );
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
		case 'BLOCK_REPLACED':
			return addBlock( action.page, removeBlock( action.id, state ) );
	}
	return state;
}

