import { expect } from 'chai';

import { renderBlockToString } from '../src/content-renderer';
import { buildUnsavedBlock } from '../src/helpers';

describe( 'renderBlockToString', function() {
	it( 'returns the block content for blockType "text"', function() {
		const block = buildUnsavedBlock( { blockType: 'text' } );
		const rendered = renderBlockToString( block );
		expect( rendered ).to.equal( block.content );
	} );

	it( 'returns a string with an img tag set to the imageUrl for blockType "image"', function() {
		const block = buildUnsavedBlock( { blockType: 'image', imageUrl: 'new.url' } );
		block.content = '';
		const rendered = renderBlockToString( block );
		expect( rendered ).to.equal( '<img src="new.url">' );
	} );

	it( 'returns a string with an img tag set to a placeholder when imageUrl is null for blockType "image"', function() {
		const block = buildUnsavedBlock( { blockType: 'image' } );
		block.content = '';
		const rendered = renderBlockToString( block );
		expect( rendered ).to.equal( '<img src="https://placehold.it/150x150">' );
	} );

	it( 'returns a string with an img tag set to the imageUrl for blockType "header"', function() {
		const block = buildUnsavedBlock( { blockType: 'header', imageUrl: 'new.url' } );
		block.content = '';
		const rendered = renderBlockToString( block );
		expect( rendered ).to.equal( '<img src="new.url">' );
	} );

	it( 'returns a string with an img tag set to a placeholder when imageUrl is null for blockType "header"', function() {
		const block = buildUnsavedBlock( { blockType: 'header' } );
		block.content = '';
		const rendered = renderBlockToString( block );
		expect( rendered ).to.equal( '<img src="https://placehold.it/150x150">' );
	} );

	it( 'returns a string without header text when siteTitle is null for blockType "header"', function() {
		const block = buildUnsavedBlock( { blockType: 'header', imageUrl: 'new.url' } );
		const rendered = renderBlockToString( block );
		expect( rendered ).to.not.include( 'h1' );
	} );

	it( 'returns a string with header text when siteTitle is set for blockType "header"', function() {
		const block = buildUnsavedBlock( { blockType: 'header', imageUrl: 'new.url' } );
		const rendered = renderBlockToString( block, { siteTitle: 'super cool' } );
		expect( rendered ).to.include( '<h1>super cool</h1>' );
	} );

	it( 'returns a string with an img tag when siteTitle is set for blockType "header"', function() {
		const block = buildUnsavedBlock( { blockType: 'header', imageUrl: 'new.url' } );
		const rendered = renderBlockToString( block, { siteTitle: 'super cool' } );
		expect( rendered ).to.include( '<img src="new.url">' );
	} );
} );
