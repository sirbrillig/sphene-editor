import classnames from 'classnames';

export const getCurrentPageId = state => state.currentPageId;

export const getBlock = ( id, state ) => state.blocks[ id ] || {};

export const getPage = ( id, state ) => state.pages[ id ];

export const getCurrentPage = state => getPage( state.currentPageId, state );

const getFullBlockContent = ( { content, blockType } ) => {
	const className = classnames( 'sphene-block', {
		'is-header': blockType === 'header',
	} );
	return `<div class="${className}">${content}</div>`;
};

export const getFullRowContent = ( row, state ) => {
	return row.columns.map( block => getBlock( block.postId, state ) )
	.map( getFullBlockContent )
	.join( ' ' );
};

export const getFullPageContent = ( rows, state ) => {
	return rows.map( row => getFullRowContent( row, state ) )
	.map( content => `<div class="sphene-row">${content}</div>` )
	.join( ' ' );
};

export const getPageWithFullContent = ( id, state ) => {
	const page = getPage( id, state );
	page.content = '<div class="sphene-page-content">' + getFullPageContent( page.rows, state ) + '</div>';
	return page;
};

export const getAllBlocks = ( page, state ) => {
	if ( ! page || ! page.rows ) {
		return [];
	}
	return page.rows.reduce( ( blocks, row ) => {
		row.columns.map( block => blocks = blocks.concat( getBlock( block.postId, state ) ) );
		return blocks;
	}, [] );
};

export const getModifiedBlocks = ( page, state ) => getAllBlocks( page, state ).filter( block => ! block.unsaved );

export const getHeaderBlocks = ( page, state ) => getAllBlocks( page, state ).filter( block => block.blockType === 'header' );

export const getUnsavedBlocks = ( page, state ) => getAllBlocks( page, state ).filter( block => block.unsaved );

export const getDeletedBlocks = state => Object.keys( state.blocks ).map( id => state.blocks[ id ] ).filter( block => block.deleted );

export const getRowForBlock = ( blockId, state ) => {
	const page = getCurrentPage( state );
	if ( ! page ) {
		return null;
	}
	return page.rows.find( row => row.columns.some( block => block.postId === blockId ) );
};

export const getCurrentRow = state => getRowForBlock( state.currentBlockId, state );

export const getHeaderImageUrl = ( state ) => state.headerImageUrl;

export const getPreparedOptions = ( state ) => state.newBlockOptions;

export const getCurrentOverlay = ( state ) => state.ui.currentOverlay;
