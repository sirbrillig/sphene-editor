import get from 'lodash/get';

import { renderBlockToString } from '../content-renderer';
import {
	getPageFromApi,
	sendPageToApi,
	sendHeaderToApi,
	createBlockInApi,
	sendBlockToApi,
	getBlockFromApi,
	removeBlockFromApi,
	getHeaderDataFromApi,
	getMediaFromApi,
	getSiteTitleFromApi,
	sendSiteTitleToApi,
} from '../api';
import {
	buildUnsavedBlock,
	buildRowWithBlock,
} from '../helpers';
import {
	getCurrentPageId,
	getPage,
	getPageWithFullContent,
	getModifiedBlocks,
	getUnsavedBlocks,
	getDeletedBlocks,
	getHeaderImageUrl,
	getSiteTitle,
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
	const content = get( data, 'content.rendered', data.defaultContent );
	const allowedProperties = [
		'unsaved',
		'blockType',
		'imageUrl',
		'featuredImageUrl',
		'imageId',
	];
	const allowedData = Object.keys( data ).reduce( ( allowed, key ) => {
		return allowedProperties.indexOf( key ) === -1 ? allowed
			: Object.assign( {}, allowed, { [ key ]: data[ key ] } );
	}, {} );
	const page = Object.assign( {}, allowedData, { id: data.id, content } );
	if ( data.featured_media ) {
		page.imageId = data.featured_media;
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
		type: 'PAGE_ROW_DELETE',
		rowId,
		pageId,
	};
}

export function createAndAddBlockToRow( options = {} ) {
	return ( dispatch, getState ) => {
		if ( ! options.rowId ) {
			return dispatch( createRowAndBlock( options ) );
		}
		const block = buildUnsavedBlock( options );
		const pageId = getCurrentPageId( getState() );
		dispatch( blockReceived( block ) );
		dispatch( addBlockToRow( block.id, pageId, options ) );
	};
}

export function addBlockToRow( blockId, pageId, options = {} ) {
	return Object.assign( {}, options, {
		type: 'PAGE_ROW_ADD_BLOCK',
		pageId,
		blockId,
	} );
}

export function createRowAndBlock( options = {} ) {
	return ( dispatch, getState ) => {
		const block = buildUnsavedBlock( options );
		const currentPageId = getCurrentPageId( getState() );
		dispatch( blockReceived( block ) );
		dispatch( addRowToPage( currentPageId, buildRowWithBlock( block ), options ) );
	};
}

export function addRowToPage( id, row, options = {} ) {
	return Object.assign( {}, options, {
		type: 'PAGE_ADD_ROW',
		row,
		id
	} );
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
	const page = {
		id: data.id,
		content: data.content.rendered,
		blockType: data.blockType,
		imageUrl: data.imageUrl,
		imageId: data.featured_media,
	};
	return {
		type: 'BLOCK_REPLACED',
		id,
		page
	};
}

export function setBlockImage( id, imageUrl, imageId ) {
	return {
		type: 'BLOCK_SET_IMAGE',
		id,
		imageUrl,
		imageId,
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
		const siteTitle = getSiteTitle( state );
		// Update the site title
		const setSiteTitlePromise = sendSiteTitleToApi( siteTitle );
		// Update the blocks
		const updateBlocksPromises = getModifiedBlocks( page, state ).map( block => {
			block.content = renderBlockToString( block, state );
			return sendBlockToApi( block );
		} );
		// Create new blocks
		const saveNewBlocksPromises = getUnsavedBlocks( page, state ).map( block => {
			block.content = renderBlockToString( block, state );
			return createBlockInApi( block ).then( data => dispatch( savedBlockReceived( block.id, data ) ) );
		} );
		// Remove deleted blocks
		const deleteBlocksPromises = getDeletedBlocks( state ).map( block => {
			return removeBlockFromApi( block.id ).then( () => dispatch( blockDeleted( block.id ) ) );
		} );
		// Update the page after new blocks are created
		Promise.all( saveNewBlocksPromises )
		.then( () => sendPageToApi( getPageWithFullContent( id, getState() ) ) )
		.then( () => sendHeaderToApi( getHeaderImageUrl( getState() ) ) )
		.then( () => Promise.all( updateBlocksPromises.concat( deleteBlocksPromises ).concat( setSiteTitlePromise ) ) )
		.then( () => dispatch( pageSaved( id ) ) );
	};
}

export function activateOverlay( overlay ) {
	return {
		type: 'OVERLAY_ACTIVATE',
		overlay,
	};
}

export function deactivateOverlay() {
	return {
		type: 'OVERLAY_ACTIVATE',
		overlay: null,
	};
}

export function setHeaderImage( imageUrl ) {
	return {
		type: 'HEADER_IMAGE_RECEIVED',
		imageUrl,
	};
}

export function setBlockHeader( id, imageUrl ) {
	return {
		type: 'BLOCK_SET_HEADER',
		id,
		imageUrl,
	};
}

export function fetchHeader() {
	return {
		type: 'HEADER_FETCH'
	};
}

export function fetchHeaderAsync() {
	return ( dispatch ) => {
		dispatch( fetchHeader() );
		getHeaderDataFromApi()
			.then( data => dispatch( setHeaderImage( data.url ) ) );
	};
}

export function prepareNewBlock( options ) {
	return {
		type: 'BLOCK_PREPARE_ADD',
		options,
	};
}

export function clearPreparedOptions( options ) {
	return {
		type: 'BLOCK_PREPARE_CLEAR',
		options,
	};
}

export function mediaReceived( media ) {
	return {
		type: 'ALL_MEDIA_RECEIVED',
		media,
	};
}

export function fetchMediaAsync() {
	return ( dispatch ) => {
		getMediaFromApi().then( image => dispatch( mediaReceived( image ) ) );
	};
}

export function setSiteTitle( siteTitle ) {
	return {
		type: 'SITE_TITLE_SET',
		siteTitle,
	};
}

export function fetchSiteTitleAsync() {
	return dispatch => {
		getSiteTitleFromApi().then( title => dispatch( setSiteTitle( title ) ) );
	};
}
