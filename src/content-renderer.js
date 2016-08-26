import { getSiteTitle } from './selectors';
import { getImageUrlByBlockType } from './helpers';

export function renderBlockToString( block, state = {} ) {
	const siteTitle = getSiteTitle( state );
	if ( block.blockType === 'text' ) {
		return block.content;
	}
	if ( block.blockType === 'image' ) {
		const imageUrl = block.imageUrl || getImageUrlByBlockType( block.blockType );
		return `<img src="${imageUrl}">`;
	}
	if ( block.blockType === 'header' ) {
		const imageUrl = block.imageUrl || getImageUrlByBlockType( block.blockType );
		const headerText = siteTitle ? `<h1>${siteTitle}</h1>` : '';
		return `${headerText}<img src="${imageUrl}">`;
	}
}

