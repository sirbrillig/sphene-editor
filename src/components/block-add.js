import React from 'react';
import classnames from 'classnames';

const BlockAdd = ( { isActive } ) => {
	const classNames = classnames( 'sphene-editor__block-add', { 'is-active': isActive } );
	return (
		<div className={ classNames }>
			<button>Text</button>
			<button>Image</button>
		</div>
	);
};

BlockAdd.propTypes = {
	isActive: React.PropTypes.bool,
	onEdit: React.PropTypes.func.isRequired,
};

export default BlockAdd;

