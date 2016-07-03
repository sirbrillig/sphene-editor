import { combineReducers } from 'redux';
import pages from './pages';

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
} );

export default rootReducer;
