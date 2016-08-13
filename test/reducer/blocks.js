import { expect } from 'chai';

import blocks from '../../src/reducers/blocks';

describe( 'blocks reducer', function() {
	it( 'has an initial state of an empty object', function() {
		const newState = blocks( undefined, { type: 'FAKE_ACTION' } );
		expect( newState ).to.eql( {} );
	} );

	it( 'adds a new block object when a a block is received', function() {
		const page = { id: 4, content: 'hello', blockType: 'text', unsaved: false };
		const newState = blocks( undefined, { type: 'BLOCK_RECEIVED', page } );
		expect( newState ).to.eql( { 4: page } );
	} );

	it( 'marks a saved block as deleted when the block is deleted', function() {
		const page = { id: 4, content: 'hello', blockType: 'text', unsaved: false };
		const initial = { 4: page };
		const newState = blocks( initial, { type: 'BLOCK_DELETE', id: page.id } );
		expect( newState ).to.eql( { 4: Object.assign( {}, page, { deleted: true } ) } );
	} );

	it( 'deletes an unsaved block entirely when the block is deleted', function() {
		const page = { id: 4, content: 'hello', blockType: 'text', unsaved: true };
		const initial = { 4: page };
		const newState = blocks( initial, { type: 'BLOCK_DELETE', id: page.id } );
		expect( newState ).to.eql( {} );
	} );

	it( 'deletes a block entirely when a saved block has finished being deleted on the server', function() {
		const page = { id: 4, content: 'hello', blockType: 'text', unsaved: false };
		const initial = { 4: page };
		const newState = blocks( initial, { type: 'BLOCK_DELETED', id: page.id } );
		expect( newState ).to.eql( {} );
	} );

	it( 'replaces a block with an updated one when it has been saved', function() {
		const page = { id: 'abcd', content: 'hello', blockType: 'text', unsaved: true };
		const initial = { abcd: page };
		const newPage = Object.assign( {}, page, { id: 5, unsaved: false } );
		const newState = blocks( initial, { type: 'BLOCK_REPLACED', id: page.id, page: newPage } );
		expect( newState ).to.eql( { 5: newPage } );
	} );

	it( 'updates the content of a block when the content has been changed', function() {
		const page = { id: 4, content: 'hello', blockType: 'text', unsaved: false };
		const initial = { 4: page };
		const newPage = Object.assign( {}, page, { content: 'bye' } );
		const newState = blocks( initial, { type: 'BLOCK_SET_CONTENT', id: page.id, content: newPage.content } );
		expect( newState ).to.eql( { 4: newPage } );
	} );

	it( 'updates the header image of a header block when the image has been changed', function() {
		const page = { id: 4, content: '<p><img src="old.url"></p>', blockType: 'header', unsaved: false, imageUrl: 'old.url' };
		const initial = { 4: page };
		const newState = blocks( initial, { type: 'BLOCK_SET_HEADER', id: page.id, imageUrl: 'new.url' } );
		expect( newState[ 4 ].imageUrl ).to.eql( 'new.url' );
	} );

	it( 'updates the image inside the content of a header block when the image has been changed', function() {
		const page = { id: 4, content: '<p><img src="old.url"></p>', blockType: 'header', unsaved: false, imageUrl: 'old.url' };
		const initial = { 4: page };
		const newState = blocks( initial, { type: 'BLOCK_SET_HEADER', id: page.id, imageUrl: 'new.url' } );
		expect( newState[ 4 ].content ).to.eql( '<p><img src="new.url"></p>' );
	} );
} );
