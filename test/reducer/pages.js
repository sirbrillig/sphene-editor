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

	it( 'removes a block from its columns when the block is deleted', function() {
		const page = { id: 5, rows: [
			{ columns: [
				{ postId: 17 },
				{ postId: 27 },
			] }
		] };
		const newState = pages( { 5: page }, { type: 'BLOCK_DELETE', id: 17 } );
		expect( newState[ 5 ] ).to.eql( { id: 5, rows: [ { columns: [ { postId: 27 } ] } ] } );
	} );

	it( 'replaces a block in its columns with a new ID when the block is saved', function() {
		const page = { id: 5, rows: [
			{ columns: [
				{ postId: 'abcd' },
				{ postId: 27 },
			] }
		] };
		const newBlock = { id: 30, content: 'hello' };
		const newState = pages( { 5: page }, { type: 'BLOCK_REPLACED', id: 'abcd', page: newBlock } );
		expect( newState[ 5 ].rows[ 0 ].columns ).to.eql( [ { postId: 30 }, { postId: 27 } ] );
	} );

	it( 'adds a new block to the end of the row when added to the end of the row', function() {
		const page = { id: 5, rows: [
			{ rowId: 'row1', columns: [
				{ postId: 27 },
			] }
		] };
		const newState = pages( { 5: page }, { type: 'PAGE_ROW_ADD_BLOCK', pageId: 5, blockId: 'abcd', rowId: 'row1' } );
		expect( newState[ 5 ].rows[ 0 ].columns ).to.eql( [ { postId: 27 }, { postId: 'abcd' } ] );
	} );
} );
