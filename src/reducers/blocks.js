import { assign } from '../helpers';

function removeBlock( id, state ) {
	const newState = assign( state );
	delete newState[ id ];
	return newState;
}

function markBlockDeleted( id, state ) {
	const block = state[ id ];
	if ( block.unsaved ) {
		return removeBlock( id, state );
	}
	block.deleted = true;
	return assign( state, { [ id ]: block } );
}

function addBlock( page, state ) {
	if ( page.blockType === 'image' && page.featuredImageUrl ) {
		return assign( state, { [ page.id ]: assign( page, {
			imageUrl: page.featuredImageUrl,
		} ) } );
	}
	return assign( state, { [ page.id ]: page } );
}

export function blockReducer( state = {}, action ) {
	switch ( action.type ) {
		case 'BLOCK_SET_CONTENT':
			return assign( state, { content: action.content } );
		case 'BLOCK_SET_IMAGE':
			return assign( state, {
				imageUrl: action.imageUrl,
				imageId: action.imageId,
			} );
		case 'BLOCK_SET_HEADER':
			return assign( state, {
				imageUrl: action.imageUrl,
			} );
	}
	return state;
}

export function blockReducerOnAllBlocksMatching( allBlocks, matcher, action ) {
	return Object.keys( allBlocks ).reduce( ( newState, blockId ) => {
		if ( matcher( allBlocks[ blockId ] ) ) {
			newState[ blockId ] = blockReducer( allBlocks[ blockId ], action );
		} else {
			newState[ blockId ] = allBlocks[ blockId ];
		}
		return newState;
	}, {} );
}

export default function blocks( state = {}, action ) {
	switch ( action.type ) {
		case 'BLOCK_RECEIVED':
			return addBlock( action.page, state );
		case 'BLOCK_SET_HEADER':
		case 'BLOCK_SET_CONTENT':
		case 'BLOCK_SET_IMAGE':
			return assign( state, { [ action.id ]: blockReducer( state[ action.id ], action ) } );
		case 'BLOCK_DELETE':
			return markBlockDeleted( action.id, state );
		case 'BLOCK_DELETED':
			return removeBlock( action.id, state );
		case 'BLOCK_REPLACED':
			return addBlock( action.page, removeBlock( action.id, state ) );
		case 'SITE_TITLE_SET':
			return blockReducerOnAllBlocksMatching( state, block => block.blockType === 'header', action );
	}
	return state;
}

