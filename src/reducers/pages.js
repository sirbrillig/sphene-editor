function addRowToPage( page, row ) {
	return Object.assign( {}, page, {
		rows: page.rows.concat( row )
	} );
}

export default function pages( state = {}, action ) {
	switch ( action.type ) {
		case 'PAGE_RECEIVED':
			return Object.assign( {}, state, { [ action.page.id ]: action.page } );
		case 'PAGE_ADD_ROW':
			return Object.assign( {}, state, { [ action.id ]: addRowToPage( state[ action.id ], action.row ) } );
	}
	return state;
}
