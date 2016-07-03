export const getCurrentPageId = state => state.currentPageId;

export const getCurrentPage = state => {
	const { currentPageId, pages } = state;
	return pages[ currentPageId ];
};

export const getBlock = ( id, state ) => state.blocks[ id ];
