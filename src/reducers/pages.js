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

function removeRowFromPage( rowId, page ) {
	return Object.assign( {}, page, { rows: page.rows.filter( row => row.rowId !== rowId ) } );
}

function getRowFromPage( rowId, page ) {
	return page.rows.find( row => row.rowId === rowId );
}

function replaceRowInPage( newRow, page ) {
	const newRows = page.rows.map( row => {
		if ( row.rowId === newRow.rowId ) {
			return newRow;
		}
		return row;
	} );
	return Object.assign( {}, page, {
		rows: newRows
	} );
}

function addBlockToRowInPage( blockId, rowId, page ) {
	const row = getRowFromPage( rowId, page );
	const newRow = Object.assign( {}, row, { columns: row.columns.concat( { postId: blockId } ) } );
	return replaceRowInPage( newRow, page );
}

function replacePage( pageId, newPage, state ) {
	return Object.assign( {}, state, { [ pageId ]: newPage } );
}

export default function pages( state = {}, action ) {
	switch ( action.type ) {
		case 'PAGE_RECEIVED':
			return replacePage( action.page.id, validatePage( action.page ), state );
		case 'PAGE_ADD_ROW':
			return replacePage( action.id, addRowToPage( action.row, state[ action.id ] ), state );
		case 'BLOCK_DELETE':
			return removeBlockFromPages( action.id, state );
		case 'BLOCK_REPLACED':
			return replaceBlockInPages( action.id, action.page.id, state );
		case 'ROW_DELETE':
			return replacePage( action.pageId, removeRowFromPage( action.rowId, state[ action.pageId ] ), state );
		case 'ROW_ADD_BLOCK':
			return replacePage( action.pageId, addBlockToRowInPage( action.blockId, action.rowId, state[ action.pageId ] ), state );
	}
	return state;
}
