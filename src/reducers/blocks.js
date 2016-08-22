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
	if ( page.blockType === 'image' && page.featuredImageUrl ) {
		return Object.assign( {}, state, { [ page.id ]: Object.assign( {}, page, {
			imageUrl: page.featuredImageUrl,
			content: replaceUrlInContent( page.content, page.imageUrl, page.featuredImageUrl )
		} ) } );
	}
	return Object.assign( {}, state, { [ page.id ]: page } );
}

function replaceUrlInContent( content, oldUrl, newUrl ) {
	return content.replace( oldUrl, newUrl );
}

function replaceSiteTitleInContent( content, oldTitle, newTitle ) {
	if ( oldTitle && content.indexOf( oldTitle ) !== -1 ) {
		return content.replace( oldTitle, newTitle );
	}
	return `<h1 class="sphene-site-title">${ newTitle }</h1>${ content }`;
}

export function blockReducer( state = {}, action ) {
	switch ( action.type ) {
		case 'BLOCK_SET_CONTENT':
			return Object.assign( {}, state, { content: action.content } );
		case 'BLOCK_SET_IMAGE':
			return Object.assign( {}, state, {
				imageUrl: action.imageUrl,
				imageId: action.imageId,
				content: replaceUrlInContent( state.content, state.imageUrl, action.imageUrl ),
			} );
		case 'BLOCK_SET_HEADER':
			return Object.assign( {}, state, {
				imageUrl: action.imageUrl,
				content: replaceUrlInContent( state.content, state.imageUrl, action.imageUrl ),
			} );
		case 'SITE_TITLE_SET':
			return Object.assign( {}, state, {
				siteTitle: action.siteTitle,
				content: replaceSiteTitleInContent( state.content, state.siteTitle, action.siteTitle ),
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
			return Object.assign( {}, state, { [ action.id ]: blockReducer( state[ action.id ], action ) } );
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

