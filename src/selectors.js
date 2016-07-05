export const getCurrentPageId = state => state.currentPageId;

export const getBlock = ( id, state ) => state.blocks[ id ];

export const getPage = ( id, state ) => state.pages[ id ];

export const getCurrentPage = state => getPage( state.currentPageId, state );

export const getFullRowContent = ( row, state ) => {
	return row.columns.map( block => getBlock( block.postId, state ).content ).join( ' ' );
};

export const getFullPageContent = ( rows, state ) => {
	return rows.map( row => getFullRowContent( row, state ) ).join( ' ' );
};

export const getAllBlocks = ( page, state ) => {
	return page.rows.reduce( ( blocks, row ) => {
		row.columns.map( block => blocks = blocks.concat( getBlock( block.postId, state ) ) );
		return blocks;
	}, [] );
};

export const getModifiedBlocks = ( page, state ) => getAllBlocks( page, state ).filter( block => ! block.unsaved );

export const getUnsavedBlocks = ( page, state ) => getAllBlocks( page, state ).filter( block => block.unsaved );
