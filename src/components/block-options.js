import React from 'react';
import classnames from 'classnames';

const BlockOptions = ( { isActive, onEdit, onDelete, onAdd } ) => {
	const classNames = classnames( 'sphene-editor__block-options', { 'is-active': isActive } );
	return (
		<div className={ classNames }>
			<button onClick={ onEdit }>Edit</button>
			<button onClick={ onDelete }>Delete</button>
			<button onClick={ onAdd }>Add Column</button>
		</div>
	);
};

BlockOptions.propTypes = {
	isActive: React.PropTypes.bool,
	onEdit: React.PropTypes.func.isRequired,
	onDelete: React.PropTypes.func.isRequired,
	onAdd: React.PropTypes.func.isRequired,
};

export default BlockOptions;
