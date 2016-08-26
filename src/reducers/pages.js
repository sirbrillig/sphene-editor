import { generate as generateId } from 'shortid';
import { assign } from '../helpers';

function ensureRowIds( page ) {
	return assign( page, {
		rows: assign( { rows: [] }, page ).rows.map( row => assign( { rowId: generateId() }, row ) )
	} );
}

export function columnReducer( state = [], action ) {
	switch ( action.type ) {
		case 'BLOCK_REPLACED':
			return state.map( block => {
				return ( block.postId === action.id ) ? assign( block, { postId: action.page.id } ) : block;
			} );
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

export function singleRowReducer( state = {}, action ) {
	switch ( action.type ) {
		case 'BLOCK_DELETE':
			return assign( state, {
				columns: state.columns.filter( block => block.postId !== action.id )
			} );
		case 'BLOCK_REPLACED':
			return assign( state, { columns: columnReducer( state.columns, action ) } );
		case 'PAGE_ROW_ADD_BLOCK':
			return state.rowId === action.rowId ? assign( state, {
				columns: columnReducer( state.columns, action )
			} ) : state;
	}
	return state;
}

export function rowReducer( state = [], action ) {
	switch ( action.type ) {
		case 'BLOCK_DELETE':
		case 'BLOCK_REPLACED':
		case 'PAGE_ROW_ADD_BLOCK':
			const newState = state.map( row => singleRowReducer( row, action ) );
			return newState.filter( row => row.columns.length > 0 );
		case 'PAGE_ROW_DELETE':
			return state.filter( row => row.rowId !== action.rowId );
		case 'PAGE_ADD_ROW':
			if ( action.beforeRowId ) {
				const rowIndex = state.indexOf( state.find( row => row.rowId === action.beforeRowId ) );
				return state.slice( 0, rowIndex ).concat( action.row ).concat( state.slice( rowIndex ) );
			} else if ( action.afterRowId ) {
				const rowIndex = state.indexOf( state.find( row => row.rowId === action.afterRowId ) ) + 1;
				return state.slice( 0, rowIndex ).concat( action.row ).concat( state.slice( rowIndex ) );
			}
			return state.concat( action.row );
	}
	return state;
}

export function pageReducer( state = {}, action ) {
	return assign( state, {
		rows: rowReducer( state.rows, action )
	} );
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
			return assign( state, { [ action.page.id ]: ensureRowIds( action.page ) } );
		case 'PAGE_ADD_ROW':
			return assign( state, { [ action.id ]: pageReducer( state[ action.id ], action ) } );
		case 'BLOCK_DELETE':
		case 'BLOCK_REPLACED':
			return pageReducerOnAllPages( state, action );
		case 'PAGE_ROW_DELETE':
		case 'PAGE_ROW_ADD_BLOCK':
			return assign( state, { [ action.pageId ]: pageReducer( state[ action.pageId ], action ) } );
	}
	return state;
}
