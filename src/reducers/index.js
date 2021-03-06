import { combineReducers } from 'redux';
import pages from './pages';
import blocks from './blocks';
import ui from './ui';
import media from './media';

export function currentPageId( state = 0, action ) {
	switch ( action.type ) {
		case 'PAGE_ID_RECEIVED':
			return action.id;
	}
	return state;
}

export function currentBlockId( state = 0, action ) {
	switch ( action.type ) {
		case 'BLOCK_SELECT':
			return action.id;
		case 'BLOCK_EDIT_COMPLETE':
			return 0;
	}
	return state;
}

export function isUnsaved( state = false, action ) {
	switch ( action.type ) {
		case 'BLOCK_SET_CONTENT':
		case 'SITE_TITLE_SET':
		case 'BLOCK_DELETE':
		case 'BLOCK_RECEIVED':
		case 'PAGE_ADD_ROW':
		case 'PAGE_ROW_DELETE':
			return true;
		case 'PAGE_SAVED':
			return false;
	}
	return state;
}

export function headerImageUrl( state = null, action ) {
	switch ( action.type ) {
		case 'HEADER_IMAGE_RECEIVED':
			return action.imageUrl;
	}
	return state;
}

export function newBlockOptions( state = {}, action ) {
	switch ( action.type ) {
		case 'BLOCK_PREPARE_ADD':
			return Object.assign( {}, state, action.options );
		case 'BLOCK_EDIT_COMPLETE':
		case 'BLOCK_PREPARE_CLEAR':
			return {};
	}
	return state;
}

export function siteTitle( state = '', action ) {
	switch ( action.type ) {
		case 'SITE_TITLE_SET':
			return action.siteTitle;
	}
	return state;
}

const rootReducer = combineReducers( {
	ui,
	currentPageId,
	currentBlockId,
	pages,
	blocks,
	media,
	isUnsaved,
	headerImageUrl,
	newBlockOptions,
	siteTitle,
} );

export default rootReducer;
