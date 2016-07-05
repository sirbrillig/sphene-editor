export const getCurrentPageId = state => state.currentPageId;

export const getBlock = ( id, state ) => state.blocks[ id ];

export const getPage = ( id, state ) => state.pages[ id ];

export const getCurrentPage = state => getPage( state.currentPageId, state );

