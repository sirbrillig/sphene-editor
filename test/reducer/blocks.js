import { expect } from 'chai';

import blocks from '../../src/reducers/blocks';

describe( 'blocks reducer', function() {
	it( 'has an initial state of an empty object', function() {
		const newState = blocks( undefined, { type: 'FAKE_ACTION' } );
		expect( newState ).to.eql( {} );
	} );

	it( 'adds a new block object when a block is received', function() {
		const page = { id: 4, content: 'hello', blockType: 'text', unsaved: false };
		const newState = blocks( undefined, { type: 'BLOCK_RECEIVED', page } );
		expect( newState ).to.eql( { 4: page } );
	} );

	it( 'replaces imageUrl in block with featuredImageUrl when an image block is received', function() {
		const page = { id: 4, content: '<p><img src="http://old.url"></p>', blockType: 'image', unsaved: false, imageUrl: 'http://old.url', featuredImageUrl: 'http://new.url' };
		const newState = blocks( undefined, { type: 'BLOCK_RECEIVED', page } );
		expect( newState[ 4 ].imageUrl ).to.eql( 'http://new.url' );
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

	it( 'updates the image data of an image block when the image data has been changed', function() {
		const page = { id: 4, content: '<p><img src="old.url"></p>', blockType: 'image', unsaved: false, imageUrl: 'old.url', imageId: 1 };
		const initial = { 4: page };
		const newPage = Object.assign( {}, page, { imageUrl: 'new.url', imageId: 4 } );
		const newState = blocks( initial, { type: 'BLOCK_SET_IMAGE', id: page.id, imageUrl: newPage.imageUrl, imageId: newPage.imageId } );
		expect( newState[ 4 ].imageUrl ).to.equal( newPage.imageUrl );
		expect( newState[ 4 ].imageId ).to.equal( newPage.imageId );
	} );

	it( 'updates the header image of a header block when the image has been changed', function() {
		const page = { id: 4, content: '<p><img src="old.url"></p>', blockType: 'header', unsaved: false, imageUrl: 'old.url' };
		const initial = { 4: page };
		const newState = blocks( initial, { type: 'BLOCK_SET_HEADER', id: page.id, imageUrl: 'new.url' } );
		expect( newState[ 4 ].imageUrl ).to.eql( 'new.url' );
	} );
} );
