function addRowToPage( row, page ) {
	return Object.assign( {}, page, {
		rows: page.rows.concat( row )
	} );
}

function removeBlockFromRow( id, row ) {
	const columns = row.columns.filter( block => block.postId !== id );
	return Object.assign( {}, row, { columns } );
}

function removeBlockFromPage( id, page ) {
	return Object.assign( {}, page, { rows: page.rows.map( row => removeBlockFromRow( id, row ) ) } );
}

function removeBlockFromPages( id, allPages ) {
	return Object.keys( allPages ).reduce( ( state, pageId ) => {
		state[ pageId ] = removeBlockFromPage( id, allPages[ pageId ] );
		return state;
	}, {} );
}

export default function pages( state = {}, action ) {
	switch ( action.type ) {
		case 'PAGE_RECEIVED':
			return Object.assign( {}, state, { [ action.page.id ]: action.page } );
		case 'PAGE_ADD_ROW':
			return Object.assign( {}, state, { [ action.id ]: addRowToPage( action.row, state[ action.id ] ) } );
		case 'BLOCK_DELETE':
			return removeBlockFromPages( action.id, state );
	}
	return state;
}
