import React from 'react';
import classnames from 'classnames';

const BlockOptions = ( { isActive, onEdit } ) => {
	const classNames = classnames( 'sphene-editor__block-options', { 'is-active': isActive } );
	return (
		<div className={ classNames }>
			<button onClick={ onEdit }>Edit</button>
			<button>Delete</button>
			<button>Add Column</button>
		</div>
	);
};

BlockOptions.propTypes = {
	isActive: React.PropTypes.bool,
	onEdit: React.PropTypes.func.isRequired,
};

export default BlockOptions;
