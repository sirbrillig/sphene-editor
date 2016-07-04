import React from 'react';
import classnames from 'classnames';

const SaveButton = ( { isActive, onClick } ) => {
	const classNames = classnames( 'sphene-editor__save', { 'is-active': isActive } );
	return (
		<button className={ classNames } onClick={ onClick } disabled={ ! isActive }>Save Page</button>
	);
};

export default SaveButton;
