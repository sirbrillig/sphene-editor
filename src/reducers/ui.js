const initialState = {
	currentOverlay: null,
};

export default function ui( state = initialState, action ) {
	switch ( action.type ) {
		case 'BLOCK_EDIT':
			return Object.assign( {}, state, { currentOverlay: 'block-editor' } );
		case 'OVERLAY_ACTIVATE':
			return Object.assign( {}, state, { currentOverlay: action.overlay } );
		case 'BLOCK_EDIT_COMPLETE':
			return Object.assign( {}, state, { currentOverlay: null } );
	}
	return state;
}
