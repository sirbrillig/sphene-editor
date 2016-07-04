import { getPageFromApi, getBlockFromApi, buildUnsavedBlock, buildRowWithBlock } from '../helpers';
import { getCurrentPageId } from '../selectors';

export function fetchPage( id ) {
	return {
		type: 'PAGE_FETCH',
		id
	};
}

export function pageReceived( data ) {
	const page = Object.assign( JSON.parse( data.sphene_data ), { id: data.id } );
	return {
		type: 'PAGE_RECEIVED',
		page
	};
}

export function fetchPageAsync( id ) {
	return dispatch => {
		dispatch( fetchPage( id ) );
		getPageFromApi( id ).then( page => dispatch( pageReceived( page ) ) );
	};
}

export function setCurrentPageId( id ) {
	return {
		type: 'PAGE_ID_RECEIVED',
		id
	};
}

export function fetchBlock( id ) {
	return {
		type: 'BLOCK_FETCH',
		id
	};
}

export function blockReceived( data ) {
	const page = { id: data.id, content: data.content.rendered };
	if ( data.unsaved ) {
		page.unsaved = true;
	}
	return {
		type: 'BLOCK_RECEIVED',
		page
	};
}

export function fetchBlockAsync( id ) {
	return dispatch => {
		dispatch( fetchBlock( id ) );
		getBlockFromApi( id ).then( page => dispatch( blockReceived( page ) ) );
	};
}

export function selectBlock( id ) {
	return {
		type: 'BLOCK_SELECT',
		id
	};
}

export function editBlock( id ) {
	return {
		type: 'BLOCK_EDIT',
		id
	};
}

export function deleteBlock( id ) {
	return {
		type: 'BLOCK_DELETE',
		id
	};
}

export function setBlockContent( id, content ) {
	return {
		type: 'BLOCK_SET_CONTENT',
		id,
		content,
	};
}

export function doneEditing() {
	return {
		type: 'BLOCK_EDIT_COMPLETE',
	};
}

export function createRowAndBlock() {
	return ( dispatch, getState ) => {
		const block = buildUnsavedBlock();
		const currentPageId = getCurrentPageId( getState() );
		dispatch( blockReceived( block ) );
		dispatch( addRowToPage( currentPageId, buildRowWithBlock( block ) ) );
	};
}

export function addRowToPage( id, row ) {
	return {
		type: 'PAGE_ADD_ROW',
		row,
		id
	};
}
