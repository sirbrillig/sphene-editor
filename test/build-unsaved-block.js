import { expect } from 'chai';

import { buildUnsavedBlock } from '../src/helpers';

describe( 'buildUnsavedBlock', function() {
	it( 'returns a block with a unique id', function() {
		const block = buildUnsavedBlock();
		const block2 = buildUnsavedBlock();
		expect( block.id ).to.not.equal( block2.id );
	} );

	it( 'returns a block with unsaved set to true', function() {
		const block = buildUnsavedBlock();
		expect( block.unsaved ).to.equal( true );
	} );

	it( 'returns a block with "text" blockType when no blockType is passed', function() {
		const block = buildUnsavedBlock();
		expect( block.blockType ).to.equal( 'text' );
	} );

	it( 'returns a block with the blockType passed', function() {
		const block = buildUnsavedBlock( 'foo' );
		expect( block.blockType ).to.equal( 'foo' );
	} );

	it( 'returns a block with placeholder defaultContent when no blockType is passed', function() {
		const block = buildUnsavedBlock();
		expect( block.defaultContent ).to.include( 'edit' );
	} );

	it( 'returns a block with placeholder defaultContent when "text" blockType is passed', function() {
		const block = buildUnsavedBlock( 'text' );
		expect( block.defaultContent ).to.include( 'edit' );
	} );

	it( 'returns a block with img tag defaultContent when "image" blockType is passed', function() {
		const block = buildUnsavedBlock( 'image' );
		expect( block.defaultContent ).to.include( 'img src' );
	} );

	it( 'returns a block with img tag defaultContent when "header" blockType is passed', function() {
		const block = buildUnsavedBlock( 'header' );
		expect( block.defaultContent ).to.include( 'img src' );
	} );

	it( 'returns a block with no imageUrl for a "text" blockType', function() {
		const block = buildUnsavedBlock( 'text' );
		expect( block.imageUrl ).to.be.null;
	} );

	it( 'returns a block with a placeholder imageUrl for an "image" blockType', function() {
		const block = buildUnsavedBlock( 'image' );
		expect( block.imageUrl ).to.not.be.null;
	} );

	it( 'returns a block with a placeholder imageUrl for an "header" blockType', function() {
		const block = buildUnsavedBlock( 'header' );
		expect( block.imageUrl ).to.not.be.null;
	} );
} );

