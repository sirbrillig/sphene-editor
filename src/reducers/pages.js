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

function replacePage( pageId, newPage, state ) {
	return assign( state, { [ pageId ]: newPage } );
}

export function columnReducer( state = [], action ) {
	switch ( action.type ) {
		case 'PAGE_ROW_ADD_BLOCK':
			if ( action.beforeBlockId ) {
				const blockIndex = state.indexOf( state.find( block => block.postId === action.beforeBlockId ) );
				return state.slice( 0, blockIndex ).concat( { postId: action.blockId } ).concat( state.slice( blockIndex ) );
			} else if ( action.afterBlockId ) {
				const blockIndex = state.indexOf( state.find( block => block.postId === action.afterBlockId ) ) + 1;
				return state.slice( 0, blockIndex ).concat( { postId: action.blockId } ).concat( state.slice( blockIndex ) );
			}
			return state.concat( { postId: action.blockId } );
	}
	return state;
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
		case 'PAGE_ROW_ADD_BLOCK':
			return state.rowId === action.rowId ? assign( state, {
				columns: columnReducer( state.columns, action )
			} ) : state;
	}
	return state;
}

export function pageReducer( state = {}, action ) {
	switch ( action.type ) {
		case 'PAGE_ADD_ROW':
			return addRowToPage( action.row, state );
		case 'PAGE_ROW_DELETE':
			return removeRowFromPage( action.rowId, state );
		case 'PAGE_ROW_ADD_BLOCK':
		case 'BLOCK_DELETE':
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
		case 'BLOCK_REPLACED':
			return pageReducerOnAllPages( state, action );
		case 'PAGE_ROW_DELETE':
		case 'PAGE_ROW_ADD_BLOCK':
			return replacePage( action.pageId, pageReducer( state[ action.pageId ], action ), state );
	}
	return state;
}
