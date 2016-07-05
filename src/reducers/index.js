import { combineReducers } from 'redux';
import pages from './pages';
import blocks from './blocks';
import ui from './ui';

function currentPageId( state = 0, action ) {
	switch ( action.type ) {
		case 'PAGE_ID_RECEIVED':
			return action.id;
	}
	return state;
}

function currentBlockId( state = 0, action ) {
	switch ( action.type ) {
		case 'BLOCK_SELECT':
			return action.id;
		case 'BLOCK_EDIT_COMPLETE':
			return 0;
	}
	return state;
}

function isUnsaved( state = false, action ) {
	switch ( action.type ) {
		case 'BLOCK_SET_CONTENT':
		case 'BLOCK_DELETE':
		case 'PAGE_ADD_ROW':
		case 'ROW_DELETE':
			return true;
		case 'PAGE_SAVED':
			return false;
	}
	return state;
}

const rootReducer = combineReducers( {
	ui,
	currentPageId,
	currentBlockId,
	pages,
	blocks,
	isUnsaved,
} );

export default rootReducer;
