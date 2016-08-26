import { ajax, getSpheneData } from './helpers';

export function getHeaderDataFromApi() {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'sphene-editor/v1/settings/header',
		method: 'GET',
	} );
}

export function sendHeaderToApi( url ) {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'sphene-editor/v1/settings/header',
		method: 'POST',
		data: { url },
	} );
}

export function sendPageToApi( page ) {
	const { id, rows, content } = page;
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_page/' + id,
		method: 'POST',
		data: { id, sphene_data: JSON.stringify( { rows } ), content },
	} );
}

export function removeBlockFromApi( id ) {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_block/' + id,
		method: 'DELETE',
	} );
}

export function createBlockInApi( page ) {
	const { content, blockType, imageUrl, imageId } = page;
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_block',
		method: 'POST',
		data: { content, status: 'publish', blockType, imageUrl, featured_media: imageId },
	} );
}

export function sendBlockToApi( page ) {
	const { id, content, blockType, imageUrl, imageId } = page;
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_block/' + id,
		method: 'POST',
		data: { id, content, blockType, imageUrl, featured_media: imageId },
	} );
}

export function getPageFromApi( id ) {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_page/' + id,
		method: 'GET',
		data: { context: 'edit' },
	} );
}

export function getBlockFromApi( id ) {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/sphene_block/' + id,
		method: 'GET',
		data: { context: 'edit' },
	} );
}

export function getMediaFromApi() {
	return ajax( {
		url: getSpheneData().wpApiSettings.root + 'wp/v2/media',
		method: 'GET',
	} );
}
