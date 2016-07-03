import { getPageFromApi } from '../helpers';

export function fetchPage( id ) {
	return {
		type: 'PAGE_FETCH',
		id
	};
}

export function pageReceived( page ) {
	page.sphene_data_parsed = JSON.parse( page.sphene_data );
	return {
		type: 'PAGE_RECEIVED',
		page
	};
}

export function fetchPageAsync( id ) {
	return dispatch => {
		dispatch( fetchPage( id ) );
		getPageFromApi( id ).then( page => dispatch( pageReceived( page ) ) );
	};
}

export function setCurrentPageId( id ) {
	return {
		type: 'PAGE_ID_RECEIVED',
		id
	};
}
