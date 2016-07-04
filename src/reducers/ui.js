const initialState = {
	showingBlockEditor: false,
};

export function ui( state = initialState, action ) {
	switch ( action.type ) {
		case 'BLOCK_EDIT':
			return Object.assign( {}, state, { showingBlockEditor: true } );
	}
	return state;
}
