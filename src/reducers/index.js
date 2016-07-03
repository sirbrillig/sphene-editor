import { combineReducers } from 'redux';
import pages from './pages';
import blocks from './blocks';

function currentPageId( state = 0, action ) {
	switch ( action.type ) {
		case 'PAGE_ID_RECEIVED':
			return action.id;
	}
	return state;
}

const rootReducer = combineReducers( {
	currentPageId,
	pages,
	blocks,
} );

export default rootReducer;
