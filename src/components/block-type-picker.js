import React from 'react';
import classnames from 'classnames';

const BlockTypePicker = ( { isActive } ) => {
	const classNames = classnames( 'sphene-editor__block-type-picker', { 'is-active': isActive } );
	return (
		<div className={ classNames }>
		</div>
	);
};

BlockTypePicker.propTypes = {
	isActive: React.PropTypes.bool,
	onEdit: React.PropTypes.func.isRequired,
	onDelete: React.PropTypes.func.isRequired,
	onAdd: React.PropTypes.func.isRequired,
};

export default BlockTypePicker;

