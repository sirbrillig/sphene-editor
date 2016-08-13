import { expect } from 'chai';

import pages from '../../src/reducers/pages';

describe( 'pages reducer', function() {
	it( 'has an initial state of an empty object', function() {
		const newState = pages( undefined, { type: 'FAKE_ACTION' } );
		expect( newState ).to.eql( {} );
	} );

	it( 'adds a new page object when a page is received', function() {
		const page = { id: 5, rows: [] };
		const newState = pages( undefined, { type: 'PAGE_RECEIVED', page } );
		expect( newState ).to.eql( { 5: page } );
	} );

	it( 'adds a new row to the page when a row is added', function() {
		const page = { id: 5, rows: [] };
		const row = { rowId: 'abcd', columns: [] };
		const newState = pages( { 5: page }, { type: 'PAGE_ADD_ROW', id: page.id, row } );
		expect( newState[ 5 ] ).to.eql( { id: 5, rows: [ row ] } );
	} );
} );
