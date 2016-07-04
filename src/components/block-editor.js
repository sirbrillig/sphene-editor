import React from 'react';
import classnames from 'classnames';

const BlockEditor = ( { isActive } ) => {
	const classNames = classnames( 'sphene-editor__block-editor', { 'is-active': isActive } );
	return (
		<div className={ classNames }>
		</div>
	);
};

export default BlockEditor;
