import React from 'react';
import classnames from 'classnames';

const BlockOptions = ( { blockId, onEdit } ) => {
	const classNames = classnames( 'sphene-editor__block-options', { 'is-active': !! blockId } );
	return (
		<div className={ classNames }>
			<button onClick={ onEdit }>Edit</button>
			<button>Delete</button>
			<button>Add Column</button>
		</div>
	);
};

BlockOptions.propTypes = {
	blockId: React.PropTypes.number,
	onEdit: React.PropTypes.func.isRequired,
};

export default BlockOptions;
