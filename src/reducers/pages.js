import { generate as generateId } from 'shortid';

function assign( obj, newObj ) {
	return Object.assign( {}, obj, newObj );
}

function addRowToPage( row, page ) {
	return assign( page, {
		rows: page.rows.concat( row )
	} );
}

function validatePage( page ) {
	return assign( page, {
		rows: assign( { rows: [] }, page ).rows.map( row => assign( { rowId: generateId() }, row ) )
	} );
}

function removeRowFromPage( rowId, page ) {
	return assign( page, { rows: page.rows.filter( row => row.rowId !== rowId ) } );
}

function getRowFromPage( rowId, page ) {
	return page.rows.find( row => row.rowId === rowId );
}

function replaceRowInPage( newRow, page ) {
	return assign( page, {
		rows: page.rows.map( row => ( row.rowId === newRow.rowId ) ? newRow : row )
	} );
}

function addBlockToRowInPage( blockId, rowId, page ) {
	const row = getRowFromPage( rowId, page );
	const newRow = assign( row, { columns: row.columns.concat( { postId: blockId } ) } );
	return replaceRowInPage( newRow, page );
}

function replacePage( pageId, newPage, state ) {
	return assign( state, { [ pageId ]: newPage } );
}

export function rowReducer( state = {}, action ) {
	switch ( action.type ) {
		case 'BLOCK_DELETE':
			return assign( state, {
				columns: state.columns.filter( block => block.postId !== action.id )
			} );
		case 'BLOCK_REPLACED':
			const { id, page } = action;
			return assign( state, {
				columns: state.columns.map( block => {
					return ( block.postId === id ) ? assign( block, { postId: page.id } ) : block;
				} )
			} );
	}
	return state;
}

export function pageReducer( state = {}, action ) {
	switch ( action.type ) {
		case 'PAGE_ADD_ROW':
			return addRowToPage( action.row, state );
		case 'PAGE_ROW_DELETE':
			return removeRowFromPage( action.rowId, state );
		case 'BLOCK_DELETE':
			return assign( state, {
				rows: state.rows.map( row => rowReducer( row, action ) )
			} );
		case 'BLOCK_REPLACED':
			return assign( state, {
				rows: state.rows.map( row => rowReducer( row, action ) )
			} );
	}
	return state;
}

export function pageReducerOnAllPages( allPages, action ) {
	return Object.keys( allPages ).reduce( ( newState, pageId ) => {
		newState[ pageId ] = pageReducer( allPages[ pageId ], action );
		return newState;
	}, {} );
}

export default function pages( state = {}, action ) {
	switch ( action.type ) {
		case 'PAGE_RECEIVED':
			return replacePage( action.page.id, validatePage( action.page ), state );
		case 'PAGE_ADD_ROW':
			return replacePage( action.id, pageReducer( state[ action.id ], action ), state );
		case 'BLOCK_DELETE':
			return pageReducerOnAllPages( state, action );
		case 'BLOCK_REPLACED':
			return pageReducerOnAllPages( state, action );
		case 'PAGE_ROW_DELETE':
			return replacePage( action.pageId, pageReducer( state[ action.pageId ], action ), state );
		case 'PAGE_ROW_ADD_BLOCK':
			return replacePage(
				action.pageId,
				addBlockToRowInPage( action.blockId, action.rowId, state[ action.pageId ] ),
				state
			);
	}
	return state;
}
