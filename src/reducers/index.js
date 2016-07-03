import { combineReducers } from 'redux';
import pages from './pages';

function currentPageId( state = 0 ) {
	return state;
}

const rootReducer = combineReducers( {
	currentPageId,
	pages,
} );

export default rootReducer;
