export function fetchPage( id ) {
	// TODO: do some real fetching, yo
	return {
		type: 'PAGE_FETCH',
		id
	};
}

export function pageReceived( page ) {
	// TODO: massage that data, yo
	return {
		type: 'PAGE_RECEIVED',
		page
	};
}
