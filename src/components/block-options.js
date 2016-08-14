import React, { PropTypes } from 'react';
import classnames from 'classnames';

const BlockOptions = ( {
	isActive,
	onEdit,
	onDelete,
	activateOverlay,
	prepareNewBlock,
	rowId,
	blockId,
} ) => {
	const addColumnBeforeBlock = () => {
		prepareNewBlock( { rowId, beforeBlockId: blockId } );
		activateOverlay( 'block-type-picker' );
	};
	const addColumnAfterBlock = () => {
		prepareNewBlock( { rowId, afterBlockId: blockId } );
		activateOverlay( 'block-type-picker' );
	};
	const addRowBefore = () => {
		prepareNewBlock( { beforeRowId: rowId } );
		activateOverlay( 'block-type-picker' );
	};
	const addRowAfter = () => {
		prepareNewBlock( { afterRowId: rowId } );
		activateOverlay( 'block-type-picker' );
	};
	const classNames = classnames( 'sphene-editor__block-options', { 'is-active': isActive } );
	return (
		<div className={ classNames }>
			<button onClick={ onDelete }>Delete</button>
			<button onClick={ onEdit }>Edit</button>
			<button onClick={ addColumnBeforeBlock }>Add Column Before</button>
			<button onClick={ addColumnAfterBlock }>Add Column After</button>
			<button onClick={ addRowBefore }>Add Row Before</button>
			<button onClick={ addRowAfter }>Add Row After</button>
		</div>
	);
};

BlockOptions.propTypes = {
	isActive: PropTypes.bool,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	activateOverlay: PropTypes.func.isRequired,
	prepareNewBlock: PropTypes.func.isRequired,
	rowId: PropTypes.string,
	blockId: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
};

export default BlockOptions;
