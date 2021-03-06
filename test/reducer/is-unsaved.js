import { expect } from 'chai';

import { isUnsaved } from '../../src/reducers';

describe( 'isUnsaved reducer', function() {
	it( 'has an initial state of false', function() {
		const newState = isUnsaved( undefined, { type: 'FAKE_ACTION' } );
		expect( newState ).to.be.false;
	} );

	it( 'is true when a row is added', function() {
		const newState = isUnsaved( undefined, { type: 'PAGE_ADD_ROW' } );
		expect( newState ).to.be.true;
	} );

	it( 'is true when a row is deleted', function() {
		const newState = isUnsaved( undefined, { type: 'PAGE_ROW_DELETE' } );
		expect( newState ).to.be.true;
	} );

	it( 'is true when a block is deleted', function() {
		const newState = isUnsaved( undefined, { type: 'BLOCK_DELETE' } );
		expect( newState ).to.be.true;
	} );

	it( 'is true when a block is updated', function() {
		const newState = isUnsaved( undefined, { type: 'BLOCK_SET_CONTENT' } );
		expect( newState ).to.be.true;
	} );

	it( 'is true when a block is added', function() {
		const newState = isUnsaved( undefined, { type: 'BLOCK_RECEIVED' } );
		expect( newState ).to.be.true;
	} );

	it( 'is true when the site title is changed', function() {
		const newState = isUnsaved( undefined, { type: 'SITE_TITLE_SET' } );
		expect( newState ).to.be.true;
	} );

	it( 'is reset to false when a page is saved', function() {
		const newState = isUnsaved( true, { type: 'PAGE_SAVED' } );
		expect( newState ).to.be.false;
	} );
} );
