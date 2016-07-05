import {
	getPageFromApi,
	sendPageToApi,
	createBlockInApi,
	sendBlockToApi,
	getBlockFromApi,
	buildUnsavedBlock,
	buildRowWithBlock,
	removeBlockFromApi,
} from '../helpers';
import {
	getCurrentPageId,
	getPage,
	getPageWithFullContent,
	getModifiedBlocks,
	getUnsavedBlocks,
	getDeletedBlocks,
} from '../selectors';

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

export function deleteRow( rowId, pageId ) {
	return {
		type: 'ROW_DELETE',
		rowId,
		pageId,
	};
}

export function createAndAddBlockToRow( rowId ) {
	return ( dispatch, getState ) => {
		const block = buildUnsavedBlock();
		const pageId = getCurrentPageId( getState() );
		dispatch( blockReceived( block ) );
		dispatch( addBlockToRow( block.id, rowId, pageId ) );
	};
}

export function addBlockToRow( blockId, rowId, pageId ) {
	return {
		type: 'ROW_ADD_BLOCK',
		pageId,
		blockId,
		rowId,
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

export function savePage( id ) {
	return {
		type: 'PAGE_SAVE',
		id
	};
}

export function pageSaved( id ) {
	return {
		type: 'PAGE_SAVED',
		id
	};
}

export function savedBlockReceived( id, data ) {
	const page = { id: data.id, content: data.content.rendered };
	return {
		type: 'BLOCK_REPLACED',
		id,
		page
	};
}

export function blockDeleted( id ) {
	return {
		type: 'BLOCK_DELETED',
		id
	};
}

export function savePageAsync( id ) {
	return ( dispatch, getState ) => {
		const state = getState();
		dispatch( savePage( id ) );
		const page = getPage( id, state );
		// Update the blocks
		const updateBlocksPromises = getModifiedBlocks( page, state ).map( block => sendBlockToApi( block ) );
		// Create new blocks
		const saveNewBlocksPromises = getUnsavedBlocks( page, state ).map( block => {
			return createBlockInApi( block ).then( data => dispatch( savedBlockReceived( block.id, data ) ) );
		} );
		// Remove deleted blocks
		const deleteBlocksPromises = getDeletedBlocks( state ).map( block => {
			return removeBlockFromApi( block.id ).then( () => dispatch( blockDeleted( block.id ) ) );
		} );
		// Update the page after new blocks are created
		Promise.all( saveNewBlocksPromises )
		.then( () => sendPageToApi( getPageWithFullContent( id, getState() ) ) )
		.then( () => Promise.all( updateBlocksPromises.concat( deleteBlocksPromises ) ) )
		.then( () => dispatch( pageSaved( id ) ) );
	};
}
