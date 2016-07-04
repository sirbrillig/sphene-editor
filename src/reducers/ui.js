const initialState = {
	showingBlockEditor: false,
};

export default function ui( state = initialState, action ) {
	switch ( action.type ) {
		case 'BLOCK_EDIT':
			return Object.assign( {}, state, { showingBlockEditor: true } );
		case 'BLOCK_EDIT_COMPLETE':
			return Object.assign( {}, state, { showingBlockEditor: false } );
	}
	return state;
}
