import shortid from 'shortid';

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

function replaceBlockInRow( oldId, newId, row ) {
	const columns = row.columns.map( block => {
		if ( block.postId === oldId ) {
			block.postId = newId;
		}
		return block;
	} );
	return Object.assign( {}, row, { columns } );
}

function replaceBlockInPage( oldId, newId, page ) {
	return Object.assign( {}, page, { rows: page.rows.map( row => replaceBlockInRow( oldId, newId, row ) ) } );
}

function replaceBlockInPages( oldId, newId, allPages ) {
	return Object.keys( allPages ).reduce( ( state, pageId ) => {
		state[ pageId ] = replaceBlockInPage( oldId, newId, allPages[ pageId ] );
		return state;
	}, {} );
}

function validatePage( page ) {
	const rows = page.rows.map( row => {
		if ( ! row.rowId ) {
			row.rowId = shortid.generate();
		}
		return row;
	} );
	return Object.assign( {}, page, { rows } );
}

export default function pages( state = {}, action ) {
	switch ( action.type ) {
		case 'PAGE_RECEIVED':
			return Object.assign( {}, state, { [ action.page.id ]: validatePage( action.page ) } );
		case 'PAGE_ADD_ROW':
			return Object.assign( {}, state, { [ action.id ]: addRowToPage( action.row, state[ action.id ] ) } );
		case 'BLOCK_DELETE':
			return removeBlockFromPages( action.id, state );
		case 'BLOCK_REPLACED':
			return replaceBlockInPages( action.id, action.page.id, state );
	}
	return state;
}
