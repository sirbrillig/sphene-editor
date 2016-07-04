import React from 'react';
import classnames from 'classnames';

const Overlay = ( { isActive, onClick } ) => {
	const classNames = classnames( 'sphene-editor__overlay', { 'is-active': isActive } );
	return (
		<div className={ classNames } onClick={ onClick }>
		</div>
	);
};

export default Overlay;
