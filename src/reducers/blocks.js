function removeBlock( id, state ) {
	const newState = Object.assign( {}, state );
	delete newState[ id ];
	return newState;
}

function markBlockDeleted( id, state ) {
	const block = state[ id ];
	if ( block.unsaved ) {
		return removeBlock( id, state );
	}
	block.deleted = true;
	return Object.assign( {}, state, { [ id ]: block } );
}

function addBlock( page, state ) {
	return Object.assign( {}, state, { [ page.id ]: page } );
}

function replaceUrlInContent( content, oldUrl, newUrl ) {
	return content.replace( oldUrl, newUrl );
}

export function blockReducer( state = {}, action ) {
	switch ( action.type ) {
		case 'BLOCK_SET_CONTENT':
			return Object.assign( {}, state, { content: action.content } );
		case 'BLOCK_SET_HEADER':
			return Object.assign( {}, state, {
				imageUrl: action.imageUrl,
				content: replaceUrlInContent( state.content, state.imageUrl, action.imageUrl ),
			} );
	}
	return state;
}

export default function blocks( state = {}, action ) {
	switch ( action.type ) {
		case 'BLOCK_RECEIVED':
			return addBlock( action.page, state );
		case 'BLOCK_SET_HEADER':
		case 'BLOCK_SET_CONTENT':
			return Object.assign( {}, state, { [ action.id ]: blockReducer( state[ action.id ], action ) } );
		case 'BLOCK_DELETE':
			return markBlockDeleted( action.id, state );
		case 'BLOCK_DELETED':
			return removeBlock( action.id, state );
		case 'BLOCK_REPLACED':
			return addBlock( action.page, removeBlock( action.id, state ) );
	}
	return state;
}

