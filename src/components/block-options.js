import React from 'react';
import classnames from 'classnames';

const BlockOptions = ( { blockId } ) => {
	const classNames = classnames( 'sphene-editor__block-options', { 'is-active': !! blockId } );
	return (
		<div className={ classNames }>
			<button>Edit</button>
			<button>Delete</button>
			<button>Add Column</button>
		</div>
	);
};

BlockOptions.propTypes = {
	blockId: React.PropTypes.number,
};

export default BlockOptions;
